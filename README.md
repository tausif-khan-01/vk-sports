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
| Product detail | `product.html?id=<product-id>` |
| Jersey designer | `customise.html` |
| About, Contact, FAQ & size guide | `about.html`, `contact.html`, `faq.html` |
| Policies | `shipping.html`, `returns.html`, `privacy.html`, `terms.html` |

## Where to edit things

- **Contact details, WhatsApp number, products, prices, sizes, teams** — `assets/js/data.js`
- **Header, footer, product cards, bag, quick view** — `assets/js/app.js`
- **Brand colours and fonts** — `assets/js/tw-config.js`
- **Custom styles and animations** — `assets/css/styles.css`

## Before launch

- Replace placeholder reviews (`assets/js/home.js`) and placeholder teams (`VK.teams` in `data.js`).
- Review the FAQ and policy pages so they match how the business works.
- Swap the Tailwind Play CDN for a Tailwind CLI build.
- Set the share image (`og:image`) to a full URL once the site has a domain.
