"""VK Sports — product share cards (1200x630 JPEG) for WhatsApp / Facebook / X link previews.

    python scripts/make-share-images.py

Needs Python 3 with Pillow (pip install pillow) and Node (to read assets/js/data.js).
Writes assets/img/share/product-<id>.jpg. Run it after adding or changing products,
then run: node scripts/build-seo.mjs
"""
import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "img" / "share"
FONTS = ROOT / "scripts" / "fonts"
W, H = 1200, 630
INK = (7, 17, 27)
VOLT = (36, 214, 83)

# Read the catalogue through Node so data.js stays the single source of truth
JS = r"""
const vm = require('vm'), fs = require('fs');
const s = {}; s.window = s; vm.createContext(s);
vm.runInContext(fs.readFileSync('assets/js/data.js', 'utf8'), s);
console.log(JSON.stringify({ products: s.VK.products, colours: s.VK.colours, sports: s.VK.sports }));
"""
data = json.loads(subprocess.run(["node", "-e", JS], cwd=ROOT, capture_output=True, text=True, encoding="utf-8", check=True).stdout)
colours = data["colours"]
sport_label = {s["key"]: s["label"] for s in data["sports"]}


def font(name, size):
    return ImageFont.truetype(str(FONTS / name), size)


def rupee_font(size):
    # Barlow has no ₹ glyph; Arial Bold (bundled with Windows) does
    for f in ("C:/Windows/Fonts/arialbd.ttf", "/Library/Fonts/Arial Bold.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"):
        try:
            return ImageFont.truetype(f, size)
        except OSError:
            continue
    return None


def hex_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def wrap(draw, text, fnt, max_w):
    words, lines, line = text.split(), [], ""
    for w in words:
        test = f"{line} {w}".strip()
        if draw.textlength(test, font=fnt) <= max_w:
            line = test
        else:
            lines.append(line)
            line = w
    lines.append(line)
    return lines


logo = Image.open(ROOT / "assets/img/logo-tight.png").convert("RGBA")
logo.thumbnail((240, 60), Image.LANCZOS)
OUT.mkdir(parents=True, exist_ok=True)

for p in data["products"]:
    accent = hex_rgb(colours[p["colours"][0]["key"]]["hex"])
    card = Image.new("RGBA", (W, H), INK + (255,))

    # Glow in the product's main colour behind the jersey
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse((560, 40, 1240, 640), fill=accent + (150,))
    card.alpha_composite(glow.filter(ImageFilter.GaussianBlur(120)))

    # Diagonal accent stripe
    stripe = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(stripe).polygon([(470, H), (560, H), (760, 0), (670, 0)], fill=accent + (40,))
    card.alpha_composite(stripe)

    # Jersey (front + back photo)
    jersey = Image.open(ROOT / p["colours"][0]["img"]).convert("RGBA")
    jersey.thumbnail((630, 480), Image.LANCZOS)
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).ellipse((560, 520, 1180, 600), fill=(0, 0, 0, 170))
    card.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(20)))
    card.alpha_composite(jersey, (W - jersey.width - 30, (H - jersey.height) // 2 + 10))

    d = ImageDraw.Draw(card)
    card.alpha_composite(logo, (60, 52))

    label = f"{sport_label.get(p['sport'], p['sport'])} · {p['fabric']}".upper()
    d.text((62, 150), label, font=font("BarlowCondensed-Bold.ttf", 28), fill=VOLT)

    title_f = font("BarlowCondensed-BlackItalic.ttf", 76)
    y = 188
    for line in wrap(d, p["name"].upper(), title_f, 470)[:3]:
        d.text((60, y), line, font=title_f, fill=(255, 255, 255))
        y += 72

    # Price: ₹ in Arial Bold, digits in Barlow
    y += 18
    price_f = font("BarlowCondensed-BlackItalic.ttf", 84)
    rf = rupee_font(64)
    x = 60
    if rf:
        d.text((x, y + 14), "₹", font=rf, fill=(255, 255, 255))
        x += int(d.textlength("₹", font=rf)) + 6
    else:
        d.text((x, y), "Rs.", font=price_f, fill=(255, 255, 255))
        x += int(d.textlength("Rs. ", font=price_f))
    price = f"{p['price']:,}"
    d.text((x, y), price, font=price_f, fill=(255, 255, 255))
    x += int(d.textlength(price, font=price_f)) + 22
    mrp_f = font("BarlowCondensed-Bold.ttf", 40)
    mrp = f"{p['mrp']:,}"
    d.text((x, y + 36), mrp, font=mrp_f, fill=(148, 163, 184))
    mw = d.textlength(mrp, font=mrp_f)
    d.line((x - 2, y + 60, x + mw + 2, y + 60), fill=(148, 163, 184), width=3)
    off = round((1 - p["price"] / p["mrp"]) * 100)
    pill_f = font("BarlowCondensed-Bold.ttf", 30)
    px = x + mw + 22
    pill = f"{off}% OFF"
    pw = d.textlength(pill, font=pill_f)
    d.rounded_rectangle((px, y + 30, px + pw + 28, y + 72), radius=21, fill=VOLT)
    d.text((px + 14, y + 33), pill, font=pill_f, fill=INK)

    # Footer bar
    d.rectangle((0, H - 70, W, H), fill=(4, 10, 17))
    d.rectangle((0, H - 70, W, H - 66), fill=VOLT)
    d.text((60, H - 54), "ORDER ON WHATSAPP  ·  CUSTOM NAMES & NUMBERS  ·  PAN-INDIA DELIVERY",
           font=font("BarlowCondensed-Bold.ttf", 30), fill=(226, 232, 240))

    out = OUT / f"product-{p['id']}.jpg"
    card.convert("RGB").save(out, quality=85, optimize=True, progressive=True)
    print("wrote", out.relative_to(ROOT))
