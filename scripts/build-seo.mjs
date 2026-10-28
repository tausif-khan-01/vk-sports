#!/usr/bin/env node
/* VK Sports — SEO build.
 *
 *   node scripts/build-seo.mjs
 *
 * Reads site.config.json (domain, hours, address) and assets/js/data.js (products), then:
 *   • writes canonical / Open Graph / Twitter tags + JSON-LD structured data into every page,
 *     between <!-- seo:start --> and <!-- seo:end --> (safe to re-run; edit the page's <title>
 *     and meta description by hand, everything in the block is regenerated)
 *   • generates a crawlable page per product: product-<id>.html (from product.html)
 *   • writes sitemap.xml, robots.txt and site.webmanifest
 *
 * Re-run after changing the domain, adding/editing products, or adding a page.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const write = (f, s) => fs.writeFileSync(path.join(ROOT, f), s);

const cfg = JSON.parse(read('site.config.json'));
const SITE = cfg.siteUrl.replace(/\/+$/, '') + '/';
const abs = p => new URL(p, SITE).href;
const now = new Date();
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`; // local date

// Load the catalogue the same way the browser does
const sandbox = {};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(read('assets/js/data.js'), sandbox);
const { config, products, sports, colours } = sandbox.VK;
const sportLabel = k => (sports.find(s => s.key === k) || {}).label || k;
const inr = n => '₹' + n.toLocaleString('en-IN');

/* ---------- Pages ---------- */
const PAGES = {
  'index.html':     { kind: 'home' },
  'shop.html':      { kind: 'CollectionPage', crumb: 'Shop' },
  'customise.html': { kind: 'WebPage', crumb: 'Jersey Designer' },
  'about.html':     { kind: 'AboutPage', crumb: 'About Us' },
  'contact.html':   { kind: 'ContactPage', crumb: 'Contact' },
  'faq.html':       { kind: 'FAQPage', crumb: 'FAQ' },
  'shipping.html':  { kind: 'WebPage', crumb: 'Shipping & Delivery' },
  'returns.html':   { kind: 'WebPage', crumb: 'Returns & Refunds' },
  'privacy.html':   { kind: 'WebPage', crumb: 'Privacy Policy' },
  'terms.html':     { kind: 'WebPage', crumb: 'Terms & Conditions' },
  'product.html':   { kind: 'noindex' },  // dynamic fallback (?id=…); real product URLs are product-<id>.html
  '404.html':       { kind: 'noindex' },
};
const pageUrl = file => (file === 'index.html' ? SITE : abs(file));

/* ---------- Structured data ---------- */
const STORE_ID = SITE + '#store';
const WEBSITE_ID = SITE + '#website';
const sameAs = Object.values(config.social || {}).filter(u => /^https?:\/\//.test(u));
const store = {
  '@type': 'SportingGoodsStore',
  '@id': STORE_ID,
  name: config.brand,
  url: SITE,
  logo: abs('assets/img/icon-512.png'),
  image: abs('assets/img/og-image.jpg'),
  description: 'Premium sportswear and custom teamwear for teams, clubs, schools and individuals, with ordering on WhatsApp and pan-India delivery.',
  telephone: '+' + config.whatsapp,
  email: config.email,
  priceRange: '₹₹',
  address: { '@type': 'PostalAddress', addressLocality: cfg.address.locality, addressRegion: cfg.address.region, addressCountry: cfg.address.country },
  areaServed: { '@type': 'Country', name: 'India' },
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: cfg.openingHours.days, opens: cfg.openingHours.opens, closes: cfg.openingHours.closes }],
  contactPoint: [{ '@type': 'ContactPoint', contactType: 'customer service', telephone: '+' + config.whatsapp, availableLanguage: ['English', 'Hindi', 'Marathi'] }],
  ...(sameAs.length ? { sameAs } : {}),
};
const website = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE,
  name: config.brand,
  inLanguage: 'en-IN',
  publisher: { '@id': STORE_ID },
  potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: abs('shop.html') + '?q={search_term_string}' }, 'query-input': 'required name=search_term_string' },
};
const breadcrumbs = trail => ({
  '@type': 'BreadcrumbList',
  itemListElement: [['Home', SITE], ...trail].map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
});
const stripTags = h => h.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

function faqEntities(html) {
  const out = [];
  const re = /<details[^>]*>\s*<summary[^>]*>([\s\S]*?)<span class="faq-icon[\s\S]*?<\/summary>([\s\S]*?)<\/details>/g;
  for (let m; (m = re.exec(html));) {
    out.push({ '@type': 'Question', name: stripTags(m[1]), acceptedAnswer: { '@type': 'Answer', text: stripTags(m[2]) } });
  }
  return out;
}

const productImages = p => [...new Set(p.colours.map(c => abs(c.img)))];
const productDescription = p =>
  `${p.name} by VK Sports — ${p.fabric.toLowerCase()} ${sportLabel(p.sport).toLowerCase()} jersey in ${p.colours.map(c => colours[c.key].label).join(', ')}. ` +
  `Sizes ${p.sizes[0]}–${p.sizes.at(-1)}, ${inr(p.price)}. Names & numbers available. Order on WhatsApp, pan-India delivery.`;

function productLd(p) {
  const url = abs(`product-${p.id}.html`);
  return {
    '@type': 'Product',
    '@id': url + '#product',
    name: p.name,
    description: productDescription(p),
    sku: p.id,
    image: productImages(p),
    brand: { '@type': 'Brand', name: config.brand },
    category: `Sportswear > ${sportLabel(p.sport)} jerseys`,
    color: p.colours.map(c => colours[c.key].label).join(', '),
    material: p.fabric,
    size: p.sizes.join(', '),
    // aggregateRating is left out on purpose: the ratings in data.js are placeholders.
    // Add it back only with genuine customer reviews (Google penalises made-up ratings).
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'INR',
      price: p.price,
      priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': STORE_ID },
    },
  };
}

/* ---------- Head block ---------- */
const escAttr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const getTitle = html => (html.match(/<title>([\s\S]*?)<\/title>/) || [, config.brand])[1].trim();
const getDesc = html => (html.match(/<meta name="description" content="([^"]*)"/) || [, ''])[1];

function headBlock({ url, title, description, image, imageSize, type = 'website', graph, noindex = false }) {
  const t = escAttr(title), d = escAttr(description);
  const lines = [
    '<!-- seo:start — generated by scripts/build-seo.mjs from site.config.json; edits inside this block are overwritten -->',
    noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">',
    url && `<link rel="canonical" href="${url}">`,
    '<link rel="manifest" href="site.webmanifest">',
    `<meta property="og:type" content="${type}">`,
    `<meta property="og:site_name" content="${escAttr(config.brand)}">`,
    '<meta property="og:locale" content="en_IN">',
    url && `<meta property="og:url" content="${url}">`,
    `<meta property="og:title" content="${t}">`,
    `<meta property="og:description" content="${d}">`,
    `<meta property="og:image" content="${image}">`,
    imageSize && `<meta property="og:image:width" content="${imageSize[0]}">`,
    imageSize && `<meta property="og:image:height" content="${imageSize[1]}">`,
    `<meta property="og:image:alt" content="${t}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${t}">`,
    `<meta name="twitter:description" content="${d}">`,
    `<meta name="twitter:image" content="${image}">`,
    graph && `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>`,
    '<!-- seo:end -->',
  ].filter(Boolean);
  return lines.map(l => '  ' + l).join('\n') + '\n';
}

// Remove the previous block and any loose tags it now owns, then insert the new block
function applyHead(html, block) {
  // Files may use Windows (\r\n) or Unix (\n) line endings
  html = html.replace(/[ \t]*<!-- seo:start[\s\S]*?<!-- seo:end -->\r?\n?/, '');
  html = html.replace(/^[ \t]*<(meta (property="og:[^"]*"|name="(twitter:[^"]*|robots)")|link rel="(canonical|manifest)")[^>]*>\r?\n/gm, '');
  const anchor = /([ \t]*<meta name="description" content="[^"]*">\r?\n)/;
  if (!anchor.test(html)) throw new Error('page is missing <meta name="description">');
  return html.replace(anchor, `$1${block}`);
}

/* ---------- Build pages ---------- */
const OG_DEFAULT = abs('assets/img/og-image.jpg');
const written = [];

for (const [file, page] of Object.entries(PAGES)) {
  if (!fs.existsSync(path.join(ROOT, file))) { console.warn(`skip ${file} (missing)`); continue; }
  let html = read(file);
  const title = getTitle(html), description = getDesc(html);
  const url = page.kind === 'noindex' ? null : pageUrl(file);
  let graph = null;
  if (page.kind === 'home') {
    graph = [store, website, { '@type': 'WebPage', '@id': SITE + '#webpage', url: SITE, name: title, description, isPartOf: { '@id': WEBSITE_ID }, about: { '@id': STORE_ID } }];
  } else if (page.kind !== 'noindex') {
    const webpage = { '@type': page.kind, url, name: title, description, isPartOf: { '@id': WEBSITE_ID } };
    if (page.kind === 'FAQPage') webpage.mainEntity = faqEntities(html);
    if (page.kind === 'CollectionPage') {
      webpage.mainEntity = { '@type': 'ItemList', itemListElement: products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`product-${p.id}.html`), name: p.name })) };
    }
    if (page.kind === 'ContactPage') webpage.about = { '@id': STORE_ID };
    graph = [webpage, breadcrumbs([[page.crumb, url]])];
  }
  html = applyHead(html, headBlock({ url, title, description, image: OG_DEFAULT, imageSize: [1200, 630], graph, noindex: page.kind === 'noindex' }));
  write(file, html);
  written.push(file);
}

/* ---------- Product pages ---------- */
// Remove pages for products that no longer exist
for (const f of fs.readdirSync(ROOT)) {
  const m = f.match(/^product-(.+)\.html$/);
  if (m && !products.some(p => p.id === m[1])) { fs.unlinkSync(path.join(ROOT, f)); console.log(`removed ${f}`); }
}

const template = read('product.html');
for (const p of products) {
  const file = `product-${p.id}.html`;
  const url = abs(file);
  const title = `${p.name} — ${inr(p.price)} | VK Sports`;
  const description = productDescription(p);
  const img = p.colours[0].img;
  // Prefer the JPEG share card (made by scripts/make-share-images.py) — WhatsApp previews are unreliable with .webp
  const shareCard = `assets/img/share/product-${p.id}.jpg`;
  const hasCard = fs.existsSync(path.join(ROOT, shareCard));
  if (!hasCard) console.warn(`no share card for ${p.id} — run: python scripts/make-share-images.py`);
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escAttr(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escAttr(description)}">`)
    .replace(/<body([^>]*)data-page="product"/, `<body$1data-page="product" data-product-id="${p.id}"`)
    .replace('<!doctype html>', `<!doctype html>\n<!-- Generated by scripts/build-seo.mjs from product.html + assets/js/data.js — edit those, not this file. -->`);
  // Static fallback content for crawlers and no-JS visitors; product.js replaces it on load
  const fallback = `
      <nav class="text-sm text-slate-500" aria-label="Breadcrumb"><a href="index.html">Home</a> / <a href="shop.html">Shop</a> / <a href="shop.html?sport=${p.sport}">${sportLabel(p.sport)}</a> / ${escAttr(p.name)}</nav>
      <div class="mt-6 grid gap-8 lg:grid-cols-2">
        <img src="${img}" alt="${escAttr(p.name)}, front and back" width="1536" height="1024" class="w-full rounded-3xl bg-white">
        <div>
          <h1 class="font-display text-4xl font-black uppercase italic">${escAttr(p.name)}</h1>
          <p class="mt-3 text-3xl font-extrabold">${inr(p.price)} <s class="text-lg text-slate-400">${inr(p.mrp)}</s></p>
          <p class="mt-4 text-slate-600">${escAttr(description)}</p>
          <p class="mt-2 text-sm text-slate-500">Colours: ${p.colours.map(c => colours[c.key].label).join(', ')} · Sizes: ${p.sizes.join(', ')} · Fabric: ${p.fabric}</p>
        </div>
      </div>
    `;
  html = html.replace(/(<div class="[^"]*" data-product>)[\s\S]*?(<\/div>)/, `$1${fallback}$2`);
  const graph = [productLd(p), breadcrumbs([['Shop', abs('shop.html')], [sportLabel(p.sport), abs(`shop.html?sport=${p.sport}`)], [p.name, url]])];
  html = applyHead(html, headBlock({ url, title, description, image: abs(hasCard ? shareCard : img), imageSize: hasCard ? [1200, 630] : [1536, 1024], type: 'product', graph }));
  write(file, html);
  written.push(file);
}

/* ---------- sitemap.xml, robots.txt, site.webmanifest ---------- */
const urls = [
  ...Object.entries(PAGES).filter(([f, pg]) => pg.kind !== 'noindex' && fs.existsSync(path.join(ROOT, f))).map(([f]) => pageUrl(f)),
  ...products.map(p => abs(`product-${p.id}.html`)),
];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
write('robots.txt', `User-agent: *
Allow: /

Sitemap: ${abs('sitemap.xml')}
`);
write('site.webmanifest', JSON.stringify({
  name: `${config.brand} — Premium Sportswear & Custom Teamwear`,
  short_name: config.brand,
  start_url: './',
  display: 'standalone',
  background_color: '#07111B',
  theme_color: '#07111B',
  icons: [
    { src: 'assets/img/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    { src: 'assets/img/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
  ],
}, null, 2) + '\n');

console.log(`site: ${SITE}`);
console.log(`updated ${written.length} pages, sitemap has ${urls.length} URLs`);
