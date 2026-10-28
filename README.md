# VK Sports

Website for VK Sports — premium sportswear and custom teamwear, with ordering on WhatsApp.

Plain HTML + Tailwind CSS (Play CDN) + vanilla JavaScript. No build step.

## Run locally

```bash
python -m http.server 8080
```

Then open http://localhost:8080.

## Pages

| Page | File |
| --- | --- |
| Home | `index.html` |
| Shop (filters) | `shop.html` |
| Product detail | `product-<product-id>.html` (generated — see SEO below) |
| Jersey designer | `customise.html` |
| About, Contact, FAQ & size guide | `about.html`, `contact.html`, `faq.html` |
| Policies | `shipping.html`, `returns.html`, `privacy.html`, `terms.html` |

## Where to edit things

- **Contact details, WhatsApp number, products, prices, sizes, teams** — `assets/js/data.js`
- **Header, footer, product cards, bag, quick view** — `assets/js/app.js`
- **Brand colours and fonts** — `assets/js/tw-config.js`
- **Custom styles and animations** — `assets/css/styles.css`

## SEO

SEO tags, structured data and product pages are generated — don't edit them by hand.

- **Domain, opening hours, address** — `site.config.json` (`siteUrl` is a stand-in until the domain is decided)
- **Page titles and descriptions** — the `<title>` and `<meta name="description">` in each HTML file

After changing the domain, products, or adding a page, run:

```bash
python scripts/make-share-images.py   # product share cards (needs Pillow: pip install pillow)
node scripts/build-seo.mjs            # head tags, JSON-LD, product pages, sitemap, robots, manifest
```

What `build-seo.mjs` produces:

- In every page's `<head>`, between `<!-- seo:start -->` and `<!-- seo:end -->`: canonical URL, robots, Open Graph / Twitter tags with full image URLs, and JSON-LD (store + website search on the home page, breadcrumbs everywhere, FAQ questions on `faq.html`, product list on `shop.html`).
- `product-<id>.html` for each product in `data.js`: unique title, description, share card, `Product` structured data, and plain-HTML content for crawlers. Pages for deleted products are removed.
- `sitemap.xml`, `robots.txt`, `site.webmanifest`.

`product.html?id=…` still works but is `noindex`; `404.html` is the not-found page.

Product ratings are deliberately **not** in the structured data — the ones in `data.js` are placeholders. Add `aggregateRating` in `build-seo.mjs` only once you have genuine reviews.

After launch: add the site to [Google Search Console](https://search.google.com/search-console), submit `sitemap.xml`, and create a Google Business Profile for the Parbhani store.

## Before launch

- Replace placeholder reviews (`assets/js/home.js`) and placeholder teams (`VK.teams` in `data.js`).
- Review the FAQ and policy pages so they match how the business works.
- Swap the Tailwind Play CDN for a Tailwind CLI build.
- Set the real domain in `site.config.json` and re-run `node scripts/build-seo.mjs`.
