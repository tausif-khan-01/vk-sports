/* VK Sports — shared layout, product cards, quick view, bag, carousels. */
(() => {
  const { config, products, colours, sports } = VK;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const inr = n => '₹' + n.toLocaleString('en-IN');
  const waLink = text => `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`;
  const sportLabel = key => (sports.find(s => s.key === key) || {}).label || key;
  const byId = id => products.find(p => p.id === id);
  // Each product has a pre-built page (product-<id>.html, made by scripts/build-seo.mjs)
  const productUrl = (id, colour) => `product-${id}.html${colour ? `?colour=${colour}` : ''}`;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Icons ---------- */
  const svg = (body, cls = 'h-5 w-5', fill = false) =>
    `<svg class="${cls}" viewBox="0 0 24 24" ${fill ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${body}</svg>`;
  const I = {
    whatsapp: c => svg('<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>', c, true),
    search: c => svg('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>', c),
    bag: c => svg('<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>', c),
    menu: c => svg('<path d="M4 6h16M4 12h16M4 18h16"/>', c),
    close: c => svg('<path d="M18 6 6 18M6 6l12 12"/>', c),
    arrow: c => svg('<path d="M5 12h14M13 6l6 6-6 6"/>', c),
    left: c => svg('<path d="m15 18-6-6 6-6"/>', c),
    right: c => svg('<path d="m9 18 6-6-6-6"/>', c),
    down: c => svg('<path d="m6 9 6 6 6-6"/>', c),
    check: c => svg('<path d="M20 6 9 17l-5-5"/>', c),
    star: c => svg('<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>', c, true),
    trash: c => svg('<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>', c),
    pin: c => svg('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>', c),
    phone: c => svg('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>', c),
    mail: c => svg('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>', c),
    clock: c => svg('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>', c),
    instagram: c => svg('<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>', c),
    facebook: c => svg('<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>', c),
    youtube: c => svg('<path d="M2.5 17a24 24 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24 24 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>', c),
    trophy: c => svg('<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.7V17c0 .6-.5 1-1 1.2C7.8 18.8 7 20.2 7 22M14 14.7V17c0 .6.5 1 1 1.2 1.2.6 2 2 2 3.8M18 2H6v7a6 6 0 0 0 12 0z"/>', c),
    gear: c => svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>', c),
    truck: c => svg('<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2M15 18H9M19 18h2a1 1 0 0 0 1-1v-3.6a1 1 0 0 0-.2-.6l-3.5-4.4A1 1 0 0 0 17.5 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>', c),
    headset: c => svg('<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>', c),
    shirt: c => svg('<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>', c),
    cricket: c => svg('<path d="M3.5 20.5 6 18"/><path d="M6 18 16.5 7.5l2 2L8 20z"/><path d="m16.5 7.5 3-3"/><circle cx="18.5" cy="18.5" r="2.5"/>', c),
    football: c => svg('<circle cx="12" cy="12" r="10"/><path d="m12 7 4 3-1.5 4.5h-5L8 10z"/><path d="M12 2v5M16 10l5-1.5M14.5 14.5l3 4.5M9.5 14.5l-3 4.5M8 10 3 8.5"/>', c),
    basketball: c => svg('<circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20M5 5c3.5 3.5 3.5 10.5 0 14M19 5c-3.5 3.5-3.5 10.5 0 14"/>', c),
    running: c => svg('<circle cx="15" cy="4" r="2"/><path d="M6 12.5 9 9h5l2.5 3.5 3 .5"/><path d="m10 9 1.5 6L8 21"/><path d="m11.5 15 3.5 2v4"/>', c),
    dumbbell: c => svg('<path d="M6.5 6.5v11M17.5 6.5v11M3 9.5v5M21 9.5v5M6.5 12h11"/>', c),
  };
  VK.icons = I;

  /* ---------- Header ---------- */
  const page = document.body.dataset.page || 'home';
  const navLinks = [
    { href: 'index.html', label: 'Home', key: 'home' },
    { href: 'shop.html', label: 'Shop', key: 'shop' },
    { label: 'Sports', key: 'sports', dropdown: true },
    { href: 'customise.html', label: 'Design Your Jersey', key: 'customise' },
    { href: 'about.html', label: 'About Us', key: 'about' },
    { href: 'contact.html', label: 'Contact', key: 'contact' },
    { href: 'faq.html', label: 'FAQ', key: 'faq' },
  ];
  const sportLinks = sports.map(s => `<a href="shop.html?sport=${s.key}" class="block rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/10 hover:text-volt">${s.label}</a>`).join('');

  const headerHTML = `
  <header class="sticky top-0 z-40 bg-ink/95 text-white backdrop-blur supports-[backdrop-filter]:bg-ink/85 border-b border-white/10">
    <div class="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 md:h-[72px]">
      <button class="-ml-2 rounded-lg p-2 lg:hidden hover:bg-white/10" data-menu-open aria-label="Open menu">${I.menu('h-6 w-6')}</button>
      <a href="index.html" class="shrink-0" aria-label="VK Sports home"><img src="assets/img/logo-tight.webp" alt="VK Sports" width="640" height="112" class="block h-auto w-32 md:w-40"></a>
      <form action="shop.html" class="relative mx-auto hidden w-full max-w-lg md:block" role="search">
        <input name="q" type="search" placeholder="Search for jerseys, tracksuits, t-shirts…" class="h-11 w-full rounded-full border-0 bg-white pl-5 pr-12 text-sm text-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-volt" aria-label="Search products">
        <button class="absolute right-1.5 top-1.5 grid h-8 w-8 place-items-center rounded-full bg-ink text-white hover:bg-volt hover:text-ink transition" aria-label="Search">${I.search('h-4 w-4')}</button>
      </form>
      <div class="ml-auto flex items-center gap-1 md:ml-0 md:gap-3">
        <a href="${waLink('Hi VK Sports! I have a question.')}" target="_blank" rel="noopener" class="hidden items-center gap-2 rounded-full px-3 py-1.5 hover:bg-white/10 lg:flex">
          <span class="text-[#25D366]">${I.whatsapp('h-7 w-7')}</span>
          <span class="leading-tight"><span class="block text-[11px] text-slate-400">WhatsApp</span><span class="block text-sm font-semibold">${config.whatsappDisplay}</span></span>
        </a>
        <button class="rounded-lg p-2 hover:bg-white/10 md:hidden" data-search-toggle aria-label="Search">${I.search('h-6 w-6')}</button>
        <button class="relative rounded-lg p-2 hover:bg-white/10" data-bag-open aria-label="Open order bag">
          ${I.bag('h-6 w-6')}
          <span data-bag-count class="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-volt px-1 text-[11px] font-bold text-ink">0</span>
        </button>
      </div>
    </div>
    <form action="shop.html" class="hidden border-t border-white/10 px-4 py-3 md:hidden" data-mobile-search role="search">
      <div class="relative">
        <input name="q" type="search" placeholder="Search jerseys, t-shirts…" class="h-11 w-full rounded-full border-0 bg-white pl-5 pr-12 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-volt" aria-label="Search products">
        <button class="absolute right-1.5 top-1.5 grid h-8 w-8 place-items-center rounded-full bg-ink text-white" aria-label="Search">${I.search('h-4 w-4')}</button>
      </div>
    </form>
    <nav class="hidden border-t border-white/10 lg:block" aria-label="Main">
      <ul class="mx-auto flex max-w-7xl items-center justify-center gap-1 px-6">
        ${navLinks.map(l => l.dropdown ? `
          <li class="group relative">
            <button class="flex items-center gap-1 px-4 py-3 text-sm font-medium text-slate-200 hover:text-volt">${l.label}${I.down('h-4 w-4 transition group-hover:rotate-180')}</button>
            <div class="invisible absolute left-1/2 top-full w-56 -translate-x-1/2 translate-y-2 rounded-xl bg-ink p-2 opacity-0 shadow-2xl ring-1 ring-white/10 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">${sportLinks}</div>
          </li>` : `
          <li><a href="${l.href}" class="relative block px-4 py-3 text-sm font-medium ${l.key === page ? 'text-white after:absolute after:inset-x-4 after:bottom-0 after:h-0.5 after:bg-volt' : 'text-slate-200 hover:text-volt'}">${l.label}</a></li>`).join('')}
      </ul>
    </nav>
  </header>

  <div class="fixed inset-0 z-50 hidden" data-menu>
    <div class="absolute inset-0 bg-black/60" data-menu-close></div>
    <aside class="absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col overflow-y-auto bg-ink p-5 text-white shadow-2xl">
      <div class="flex items-center justify-between">
        <img src="assets/img/logo-tight.webp" alt="VK Sports" width="640" height="112" class="block h-auto w-32">
        <button class="rounded-lg p-2 hover:bg-white/10" data-menu-close aria-label="Close menu">${I.close('h-6 w-6')}</button>
      </div>
      <nav class="mt-6 space-y-1" aria-label="Mobile">
        ${navLinks.filter(l => !l.dropdown).map(l => `<a href="${l.href}" class="block rounded-lg px-3 py-3 font-medium ${l.key === page ? 'bg-white/10 text-volt' : 'hover:bg-white/10'}" data-menu-close>${l.label}</a>`).join('')}
      </nav>
      <p class="mt-6 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">Shop by sport</p>
      <div class="mt-2 grid grid-cols-2 gap-1">${sportLinks}</div>
      <a href="${waLink('Hi VK Sports! I have a question.')}" target="_blank" rel="noopener" class="mt-auto flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 font-semibold text-white">${I.whatsapp('h-5 w-5')} Chat on WhatsApp</a>
    </aside>
  </div>`;

  /* ---------- Footer ---------- */
  const footerHTML = `
  <section class="relative overflow-hidden bg-ink text-white">
    <img src="assets/img/hero-athletes.webp" alt="" class="absolute inset-0 h-full w-full object-cover object-right opacity-25" loading="lazy">
    <div class="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/40"></div>
    <div class="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
      <div class="reveal">
        <h2 class="font-display text-3xl font-extrabold uppercase italic tracking-tight md:text-4xl">Join the VK Sports Community</h2>
        <p class="mt-1 text-slate-300">Get the latest products, offers and teamwear updates on WhatsApp.</p>
      </div>
      <a href="${waLink('Hi VK Sports! Please add me to your updates list.')}" target="_blank" rel="noopener" class="reveal inline-flex items-center gap-2 rounded-xl bg-volt px-7 py-4 font-bold text-ink shadow-lg shadow-volt/20 transition hover:-translate-y-0.5 hover:shadow-volt/40">${I.whatsapp('h-6 w-6')} Chat on WhatsApp</a>
    </div>
  </section>
  <footer class="bg-[#050c14] text-slate-300">
    <div class="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.3fr]">
      <div>
        <img src="assets/img/logo-tight.webp" alt="VK Sports" width="640" height="112" class="block h-auto w-40" loading="lazy">
        <p class="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">Premium sportswear for teams, clubs and individuals. Play Together, Win Big.</p>
        <div class="mt-5 flex gap-3">
          ${['instagram', 'facebook', 'youtube'].map(s => `<a href="${config.social[s]}" class="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-white transition hover:bg-volt hover:text-ink" aria-label="${s}">${I[s]('h-5 w-5')}</a>`).join('')}
        </div>
      </div>
      <div>
        <h3 class="font-semibold text-white">Quick Links</h3>
        <ul class="mt-4 space-y-2 text-sm">
          ${[['Home', 'index.html'], ['Shop', 'shop.html'], ['About Us', 'about.html'], ['Custom Teamwear', 'index.html#custom'], ['Jersey Designer', 'customise.html'], ['Contact', 'contact.html'], ['FAQ', 'faq.html']].map(([t, h]) => `<li><a href="${h}" class="hover:text-volt">${t}</a></li>`).join('')}
        </ul>
      </div>
      <div>
        <h3 class="font-semibold text-white">Shop by Sport</h3>
        <ul class="mt-4 space-y-2 text-sm">
          ${sports.slice(0, 6).map(s => `<li><a href="shop.html?sport=${s.key}" class="hover:text-volt">${s.label}</a></li>`).join('')}
        </ul>
      </div>
      <div>
        <h3 class="font-semibold text-white">Customer Support</h3>
        <ul class="mt-4 space-y-2 text-sm">
          ${[['Shipping & Delivery', 'shipping.html'], ['Returns & Refunds', 'returns.html'], ['Size Guide', 'faq.html#size-guide'], ['Privacy Policy', 'privacy.html'], ['Terms & Conditions', 'terms.html']].map(([t, h]) => `<li><a href="${h}" class="hover:text-volt">${t}</a></li>`).join('')}
        </ul>
      </div>
      <div>
        <h3 class="font-semibold text-white">Contact Us</h3>
        <ul class="mt-4 space-y-3 text-sm">
          <li class="flex gap-3">${I.pin('h-5 w-5 shrink-0 text-volt')}${config.address}</li>
          <li><a href="tel:+${config.whatsapp}" class="flex gap-3 hover:text-volt">${I.phone('h-5 w-5 shrink-0 text-volt')}${config.whatsappDisplay}</a></li>
          <li><a href="mailto:${config.email}" class="flex gap-3 hover:text-volt">${I.mail('h-5 w-5 shrink-0 text-volt')}${config.email}</a></li>
          <li class="flex gap-3">${I.clock('h-5 w-5 shrink-0 text-volt')}${config.hours}</li>
        </ul>
      </div>
    </div>
    <div class="border-t border-white/10">
      <div class="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:justify-between sm:px-6">
        <p>© ${new Date().getFullYear()} VK Sports. All rights reserved.</p>
        <p>Designed with <span class="text-red-500">♥</span> for sports lovers</p>
      </div>
    </div>
  </footer>

  <a href="${waLink('Hi VK Sports! I have a question.')}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"
     class="wa-float wa-pulse fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-110">${I.whatsapp('h-7 w-7')}</a>`;

  /* ---------- Modals: quick view, bag, quote ---------- */
  const modalsHTML = `
  <div class="fixed inset-0 z-50 hidden" data-qv role="dialog" aria-modal="true" aria-labelledby="qv-title">
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" data-qv-close></div>
    <div class="absolute inset-x-0 bottom-0 max-h-[92vh] overflow-y-auto rounded-t-3xl bg-white md:inset-auto md:left-1/2 md:top-1/2 md:w-[min(960px,92vw)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl" data-qv-panel></div>
  </div>

  <div class="fixed inset-0 z-50 hidden" data-bag role="dialog" aria-modal="true" aria-label="Your order bag">
    <div class="absolute inset-0 bg-black/60" data-bag-close></div>
    <aside class="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl">
      <div class="flex items-center justify-between border-b px-5 py-4">
        <h2 class="font-display text-2xl font-extrabold uppercase italic text-ink">Your Order Bag</h2>
        <button class="rounded-lg p-2 hover:bg-slate-100" data-bag-close aria-label="Close">${I.close('h-6 w-6')}</button>
      </div>
      <div class="flex-1 overflow-y-auto px-5 py-4" data-bag-items></div>
      <div class="border-t px-5 py-5" data-bag-footer></div>
    </aside>
  </div>

  <div class="fixed inset-0 z-50 hidden" data-quote role="dialog" aria-modal="true" aria-labelledby="quote-title">
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" data-quote-close></div>
    <form class="absolute inset-x-0 bottom-0 max-h-[92vh] overflow-y-auto rounded-t-3xl bg-white p-6 md:inset-auto md:left-1/2 md:top-1/2 md:w-[min(560px,92vw)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl md:p-8" data-quote-form>
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs font-bold uppercase tracking-widest text-volt">Custom Teamwear</p>
          <h2 id="quote-title" class="font-display text-3xl font-extrabold uppercase italic text-ink">Get a Custom Quote</h2>
          <p class="mt-1 text-sm text-slate-500">Tell us about your team — we'll reply on WhatsApp with designs and pricing.</p>
        </div>
        <button type="button" class="rounded-lg p-2 hover:bg-slate-100" data-quote-close aria-label="Close">${I.close('h-6 w-6')}</button>
      </div>
      <div class="mt-6 grid gap-4 sm:grid-cols-2">
        <label class="sm:col-span-2 text-sm font-medium text-ink">Team / organisation name
          <input name="team" required class="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 font-normal focus:border-volt focus:outline-none focus:ring-2 focus:ring-volt/30" placeholder="e.g. Parbhani Strikers">
        </label>
        <label class="text-sm font-medium text-ink">Sport
          <select name="sport" class="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-normal focus:border-volt focus:outline-none focus:ring-2 focus:ring-volt/30">
            ${sports.filter(s => s.key !== 'custom').map(s => `<option>${s.label}</option>`).join('')}<option>Other</option>
          </select>
        </label>
        <label class="text-sm font-medium text-ink">Quantity
          <input name="qty" type="number" min="1" value="15" required class="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 font-normal focus:border-volt focus:outline-none focus:ring-2 focus:ring-volt/30">
        </label>
        <fieldset class="sm:col-span-2">
          <legend class="text-sm font-medium text-ink">Personalisation</legend>
          <div class="mt-2 flex flex-wrap gap-2">
            ${['Team logo', 'Player names', 'Numbers', 'Sponsor logo'].map(o => `
              <label class="cursor-pointer"><input type="checkbox" name="extras" value="${o}" class="peer sr-only" checked>
                <span class="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm transition peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white">${o}</span></label>`).join('')}
          </div>
        </fieldset>
        <label class="sm:col-span-2 text-sm font-medium text-ink">Colours & notes <span class="font-normal text-slate-400">(optional)</span>
          <textarea name="notes" rows="3" class="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal focus:border-volt focus:outline-none focus:ring-2 focus:ring-volt/30" placeholder="Preferred colours, deadline, delivery city…"></textarea>
        </label>
      </div>
      <button class="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-4 font-bold text-white transition hover:brightness-105">${I.whatsapp('h-5 w-5')} Send Enquiry on WhatsApp</button>
      <p class="mt-3 text-center text-xs text-slate-400">This opens WhatsApp with your details pre-filled. Nothing is sent until you press send there.</p>
    </form>
  </div>

  <div class="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4" aria-live="polite"><div data-toast class="pointer-events-none flex translate-y-4 items-center gap-3 rounded-full bg-ink py-2.5 pl-5 pr-2.5 text-sm font-medium text-white opacity-0 shadow-xl transition [&:not(.pointer-events-none)]:pointer-events-auto"></div></div>`;

  const headerSlot = $('#site-header');
  const footerSlot = $('#site-footer');
  if (headerSlot) headerSlot.outerHTML = headerHTML;
  if (footerSlot) footerSlot.outerHTML = footerHTML;
  document.body.insertAdjacentHTML('beforeend', modalsHTML);

  // Expose the sticky header's height so full-screen sections can fit beneath it
  const siteHeader = $('header');
  if (siteHeader) {
    const setHeaderH = () => document.documentElement.style.setProperty('--header-h', `${siteHeader.offsetHeight}px`);
    setHeaderH();
    new ResizeObserver(setHeaderH).observe(siteHeader);
  }

  /* ---------- Overlay helpers ---------- */
  let lastFocus = null;
  const open = el => { lastFocus = document.activeElement; el.classList.remove('hidden'); document.body.style.overflow = 'hidden'; };
  const close = el => { el.classList.add('hidden'); if (!$$('[data-qv],[data-bag],[data-quote],[data-menu]').some(m => !m.classList.contains('hidden'))) document.body.style.overflow = ''; lastFocus?.focus?.(); };
  document.addEventListener('keydown', e => { if (e.key === 'Escape') $$('[data-qv],[data-bag],[data-quote],[data-menu]').forEach(m => !m.classList.contains('hidden') && close(m)); });

  let toastTimer;
  const toast = (msg, { viewBag = false } = {}) => {
    const t = $('[data-toast]');
    t.innerHTML = `<span>${esc(msg)}</span>${viewBag ? '<button class="rounded-full bg-volt px-3 py-1 text-xs font-bold text-ink hover:bg-white" data-bag-open>View bag</button>' : ''}`;
    t.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none'), viewBag ? 3800 : 2200);
  };

  /* Fly a copy of the product photo into the header bag, then bump the count */
  const bumpBag = () => $$('[data-bag-count]').forEach(c => { c.classList.remove('bag-bump'); void c.offsetWidth; c.classList.add('bag-bump'); });
  const flyToBag = src => {
    const bagBtn = $('header [data-bag-open]');
    const a = src?.getBoundingClientRect();
    if (!a?.width || !bagBtn || matchMedia('(prefers-reduced-motion: reduce)').matches) return bumpBag();
    const b = bagBtn.getBoundingClientRect();
    const w = Math.min(a.width, 180), h = w * 0.66;
    const el = Object.assign(document.createElement('img'), { src: src.currentSrc || src.src, className: 'fly-item', alt: '' });
    Object.assign(el.style, { left: `${a.left + a.width / 2 - w / 2}px`, top: `${a.top + a.height / 2 - h / 2}px`, width: `${w}px`, height: `${h}px` });
    document.body.append(el);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    el.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * 0.45}px, ${dy * 0.45 - 60}px) scale(.6)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(.12)`, opacity: 0.5 },
    ], { duration: 800, easing: 'ease-in-out' }).finished.then(() => { el.remove(); bumpBag(); });
  };

  /* ---------- Product cards ---------- */
  const stars = r => `<span class="flex text-amber-400">${[1, 2, 3, 4, 5].map(i => I.star(`h-3.5 w-3.5 ${r >= i - 0.25 ? '' : r >= i - 0.75 ? 'opacity-60' : 'text-slate-200'}`)).join('')}</span>`;
  const off = p => Math.round((1 - p.price / p.mrp) * 100);

  VK.productCard = p => `
  <article class="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl" data-card="${p.id}" data-colour="${p.colours[0].key}">
    <div class="relative aspect-[4/3] overflow-hidden bg-gradient-to-b from-ice to-[#e3e9f0]">
      <button class="absolute inset-0 block h-full w-full" data-quickview="${p.id}" aria-label="Quick view: ${esc(p.name)}">
        <img src="${p.colours[0].img}" alt="${esc(p.name)}" loading="lazy" data-card-img class="card-img absolute inset-0 h-full w-full object-contain p-1 pt-5 sm:p-2">
      </button>
      <span class="pointer-events-none absolute inset-x-2 top-2 z-10 flex flex-wrap items-start justify-between gap-1 sm:inset-x-3 sm:top-3">
        ${p.badge ? `<span class="rounded-full bg-ink px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-volt sm:px-2.5 sm:py-1 sm:text-[10px]">${p.badge}</span>` : '<span></span>'}
        <span class="rounded-full bg-volt px-1.5 py-0.5 text-[9px] font-bold text-ink sm:px-2 sm:py-1 sm:text-[10px]">${off(p)}% OFF</span>
      </span>
      <!-- Mouse users: quick-add sizes slide up over the back view -->
      <div class="quick-add absolute inset-x-2 bottom-2 z-10 rounded-xl bg-ink/90 p-2 text-white backdrop-blur" role="group" aria-label="Quick add a size">
        <p class="mb-1.5 text-center text-[10px] font-semibold uppercase tracking-widest text-slate-300">Quick add · tap a size</p>
        <div class="flex flex-wrap justify-center gap-1">
          ${p.sizes.map(s => `<button class="h-7 min-w-8 rounded-md bg-white/10 px-1.5 text-[11px] font-bold transition hover:bg-volt hover:text-ink" data-quick-size="${s}" aria-label="Add size ${s} to bag">${s}</button>`).join('')}
        </div>
      </div>
    </div>
    <div class="flex flex-1 flex-col p-3 sm:p-4">
      <p class="truncate text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:text-[11px]">${sportLabel(p.sport)}<span class="hidden sm:inline"> · ${p.fabric}</span></p>
      <h3 class="mt-1 text-sm font-semibold leading-snug text-ink sm:text-base"><a href="${productUrl(p.id, p.colours[0].key)}" class="line-clamp-2 hover:text-emerald-700" data-card-link>${esc(p.name)}</a></h3>
      <div class="mt-1.5 flex flex-wrap items-baseline gap-x-2 sm:mt-2">
        <span class="text-lg font-extrabold text-ink sm:text-xl">${inr(p.price)}</span>
        <span class="text-xs text-slate-400 line-through sm:text-sm">${inr(p.mrp)}</span>
      </div>
      <div class="mt-1 flex items-center gap-1 text-[11px] text-slate-500 sm:gap-1.5 sm:text-xs">${stars(p.rating)}<span>(${p.reviews})</span></div>
      <div class="mb-3 mt-2.5 flex gap-2 sm:mb-4 sm:mt-3" role="radiogroup" aria-label="Colour">
        ${p.colours.map((c, i) => `<button class="h-5 w-5 rounded-full ring-2 ring-offset-2 transition sm:h-6 sm:w-6 ${i === 0 ? 'ring-ink' : 'ring-transparent hover:ring-slate-300'}" style="background:${colours[c.key].hex}" data-swatch="${c.key}" data-img="${c.img}" role="radio" aria-checked="${i === 0}" aria-label="${colours[c.key].label}" title="${colours[c.key].label}"></button>`).join('')}
      </div>
      <button class="mt-auto flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-volt py-2.5 text-[13px] font-bold text-ink transition hover:bg-ink hover:text-volt sm:gap-2 sm:py-3 sm:text-sm" data-buy="${p.id}">${I.whatsapp('h-4 w-4 shrink-0')}<span class="sm:hidden">Buy Now</span><span class="hidden sm:inline">Buy on WhatsApp</span></button>
    </div>
  </article>`;

  /* ---------- Quick view ---------- */
  const qv = $('[data-qv]');
  const qvPanel = $('[data-qv-panel]');
  let qvState = null;

  const orderText = items => {
    const lines = items.map((it, i) =>
      `${items.length > 1 ? `${i + 1}. ` : '• '}${it.name}\n   Colour: ${colours[it.colour].label} | Size: ${it.size} | Qty: ${it.qty}\n   Price: ${inr(it.price)} × ${it.qty} = ${inr(it.price * it.qty)}`);
    const total = items.reduce((s, it) => s + it.price * it.qty, 0);
    return `Hi VK Sports! I'd like to order:\n\n${lines.join('\n\n')}${items.length > 1 ? `\n\nTotal: ${inr(total)}` : ''}\n\nPlease confirm availability and delivery details.`;
  };

  const renderQV = () => {
    const p = byId(qvState.id);
    const c = p.colours.find(x => x.key === qvState.colour) || p.colours[0];
    qvPanel.innerHTML = `
    <div class="grid md:grid-cols-2">
      <div class="relative bg-gradient-to-b from-ice to-[#dfe6ee] md:rounded-l-3xl">
        <img src="${c.img}" alt="${esc(p.name)} in ${colours[c.key].label}" class="aspect-[4/3] w-full object-contain p-4 md:h-full md:aspect-auto">
        <button class="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow hover:bg-white md:hidden" data-qv-close aria-label="Close">${I.close('h-5 w-5')}</button>
      </div>
      <div class="p-6 md:p-8">
        <div class="flex items-start justify-between gap-4">
          <p class="text-xs font-bold uppercase tracking-widest text-slate-400">${sportLabel(p.sport)}</p>
          <button class="-mr-2 -mt-2 hidden rounded-lg p-2 hover:bg-slate-100 md:block" data-qv-close aria-label="Close">${I.close('h-6 w-6')}</button>
        </div>
        <h2 id="qv-title" class="font-display text-3xl font-extrabold uppercase italic leading-none text-ink md:text-4xl">${esc(p.name)}</h2>
        <div class="mt-3 flex items-center gap-2 text-sm text-slate-500">${stars(p.rating)} ${p.rating} · ${p.reviews} reviews</div>
        <div class="mt-4 flex items-baseline gap-3">
          <span class="text-3xl font-extrabold text-ink">${inr(p.price)}</span>
          <span class="text-slate-400 line-through">${inr(p.mrp)}</span>
          <span class="rounded-full bg-volt/15 px-2 py-0.5 text-xs font-bold text-emerald-700">Save ${off(p)}%</span>
        </div>

        <p class="mt-6 text-sm font-semibold text-ink">Colour: <span class="font-normal text-slate-500">${colours[c.key].label}</span></p>
        <div class="mt-2 flex gap-3">
          ${p.colours.map(x => `<button class="h-9 w-9 rounded-full ring-2 ring-offset-2 transition ${x.key === c.key ? 'ring-ink' : 'ring-transparent hover:ring-slate-300'}" style="background:${colours[x.key].hex}" data-qv-colour="${x.key}" aria-label="${colours[x.key].label}" aria-pressed="${x.key === c.key}"></button>`).join('')}
        </div>

        <p class="mt-6 text-sm font-semibold text-ink">Size</p>
        <div class="mt-2 flex flex-wrap gap-2" data-qv-sizes>
          ${VK.sizes.map(s => {
            const ok = p.sizes.includes(s);
            return `<button class="h-11 min-w-12 rounded-xl border px-3 text-sm font-semibold transition ${!ok ? 'cursor-not-allowed border-slate-100 text-slate-300 line-through' : s === qvState.size ? 'border-ink bg-ink text-white' : 'border-slate-200 text-ink hover:border-ink'}" ${ok ? `data-qv-size="${s}"` : 'disabled'} aria-pressed="${s === qvState.size}">${s}</button>`;
          }).join('')}
        </div>
        <p class="mt-2 hidden text-sm font-medium text-red-600" data-qv-err>Please select a size.</p>

        <div class="mt-6 flex items-center gap-4">
          <p class="text-sm font-semibold text-ink">Qty</p>
          <div class="flex items-center rounded-xl border border-slate-200">
            <button class="h-10 w-10 text-lg hover:bg-slate-50" data-qv-qty="-1" aria-label="Decrease quantity">−</button>
            <span class="w-10 text-center font-semibold" data-qv-qtyval>${qvState.qty}</span>
            <button class="h-10 w-10 text-lg hover:bg-slate-50" data-qv-qty="1" aria-label="Increase quantity">+</button>
          </div>
        </div>

        <div class="mt-7 grid gap-3 sm:grid-cols-2">
          <button class="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 font-bold text-white transition hover:brightness-105" data-qv-buy>${I.whatsapp('h-5 w-5')} Buy on WhatsApp</button>
          <button class="flex items-center justify-center gap-2 rounded-xl border-2 border-ink py-3.5 font-bold text-ink transition hover:bg-ink hover:text-white" data-qv-add>${I.bag('h-5 w-5')} Add to Bag</button>
        </div>
        <ul class="mt-6 space-y-2 text-sm text-slate-600">
          <li class="flex gap-2">${I.check('h-5 w-5 text-volt')} ${p.fabric} — breathable & quick-dry</li>
          <li class="flex gap-2">${I.check('h-5 w-5 text-volt')} Add names, numbers & team logos on request</li>
          <li class="flex gap-2">${I.check('h-5 w-5 text-volt')} Pan-India delivery</li>
        </ul>
        <a href="${productUrl(p.id, c.key)}" class="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline-offset-4 hover:underline">View full details ${I.arrow('h-4 w-4')}</a>
      </div>
    </div>`;
  };

  const openQV = (id, colour) => {
    qvState = { id, colour, size: null, qty: 1 };
    renderQV();
    open(qv);
    $('[data-qv-close]:not(.md\\:hidden)', qvPanel)?.focus();
  };

  const requireSize = () => {
    if (qvState.size) return true;
    const err = $('[data-qv-err]', qvPanel);
    err.classList.remove('hidden');
    const sizes = $('[data-qv-sizes]', qvPanel);
    sizes.classList.remove('shake'); void sizes.offsetWidth; sizes.classList.add('shake');
    return false;
  };
  const qvItem = () => { const p = byId(qvState.id); return { id: p.id, name: p.name, price: p.price, colour: qvState.colour, size: qvState.size, qty: qvState.qty }; };

  qv.addEventListener('click', e => {
    const t = e.target.closest('button,[data-qv-close]');
    if (!t) return;
    if (t.matches('[data-qv-close]')) return close(qv);
    if (t.dataset.qvColour) { qvState.colour = t.dataset.qvColour; renderQV(); }
    else if (t.dataset.qvSize) { qvState.size = t.dataset.qvSize; renderQV(); }
    else if (t.dataset.qvQty) { qvState.qty = Math.max(1, Math.min(99, qvState.qty + +t.dataset.qvQty)); $('[data-qv-qtyval]', qvPanel).textContent = qvState.qty; }
    else if (t.matches('[data-qv-buy]')) { if (requireSize()) window.open(waLink(orderText([qvItem()])), '_blank', 'noopener'); }
    else if (t.matches('[data-qv-add]')) {
      if (!requireSize()) return;
      bag.add(qvItem());
      flyToBag($('img', qvPanel));
      close(qv);
      toast(`Added — ${colours[qvState.colour].label}, size ${qvState.size}`, { viewBag: true });
    }
  });

  /* ---------- Bag (stored in this browser only) ---------- */
  const BAG_KEY = 'vk-bag';
  const bag = {
    items: (() => { try { return JSON.parse(localStorage.getItem(BAG_KEY)) || []; } catch { return []; } })(),
    save() { try { localStorage.setItem(BAG_KEY, JSON.stringify(this.items)); } catch { /* storage unavailable */ } this.render(); },
    add(it) {
      const same = this.items.find(x => x.id === it.id && x.colour === it.colour && x.size === it.size);
      same ? same.qty += it.qty : this.items.push(it);
      this.save();
    },
    render() {
      const count = this.items.reduce((s, x) => s + x.qty, 0);
      $$('[data-bag-count]').forEach(el => { el.textContent = count; });
      const list = $('[data-bag-items]');
      const foot = $('[data-bag-footer]');
      if (!this.items.length) {
        list.innerHTML = `<div class="grid h-full place-items-center text-center"><div>${I.bag('mx-auto h-14 w-14 text-slate-200')}<p class="mt-3 font-semibold text-ink">Your bag is empty</p><p class="text-sm text-slate-500">Add products, then send your whole order in one WhatsApp message.</p><a href="shop.html" class="mt-5 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-bold text-white">Browse products ${I.arrow('h-4 w-4')}</a></div></div>`;
        foot.innerHTML = '';
        return;
      }
      list.innerHTML = this.items.map((it, i) => {
        const p = byId(it.id);
        const img = p ? (p.colours.find(c => c.key === it.colour) || p.colours[0]).img : '';
        return `<div class="flex gap-4 border-b py-4 last:border-0">
          <img src="${img}" alt="" class="h-20 w-24 shrink-0 rounded-xl bg-ice object-contain">
          <div class="min-w-0 flex-1">
            <p class="font-semibold leading-snug text-ink">${esc(it.name)}</p>
            <p class="text-xs text-slate-500">${colours[it.colour].label} · Size ${it.size}</p>
            <div class="mt-2 flex items-center justify-between">
              <div class="flex items-center rounded-lg border border-slate-200 text-sm">
                <button class="h-8 w-8 hover:bg-slate-50" data-bag-qty="${i}" data-d="-1" aria-label="Decrease">−</button>
                <span class="w-7 text-center font-semibold">${it.qty}</span>
                <button class="h-8 w-8 hover:bg-slate-50" data-bag-qty="${i}" data-d="1" aria-label="Increase">+</button>
              </div>
              <span class="font-bold text-ink">${inr(it.price * it.qty)}</span>
            </div>
          </div>
          <button class="self-start p-1 text-slate-400 hover:text-red-600" data-bag-remove="${i}" aria-label="Remove ${esc(it.name)}">${I.trash('h-5 w-5')}</button>
        </div>`;
      }).join('');
      const total = this.items.reduce((s, x) => s + x.price * x.qty, 0);
      foot.innerHTML = `
        <div class="flex items-center justify-between text-lg"><span class="font-semibold text-ink">Total</span><span class="font-extrabold text-ink">${inr(total)}</span></div>
        <p class="mt-1 text-xs text-slate-500">Shipping and final price confirmed on WhatsApp.</p>
        <a href="${waLink(orderText(this.items))}" target="_blank" rel="noopener" class="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-4 font-bold text-white transition hover:brightness-105">${I.whatsapp('h-5 w-5')} Send Order on WhatsApp</a>
        <button class="mt-2 w-full py-2 text-sm text-slate-500 hover:text-red-600" data-bag-clear>Clear bag</button>`;
    },
  };
  bag.render();

  $('[data-bag]').addEventListener('click', e => {
    const t = e.target.closest('[data-bag-close],[data-bag-qty],[data-bag-remove],[data-bag-clear]');
    if (!t) return;
    if (t.matches('[data-bag-close]')) return close($('[data-bag]'));
    if (t.dataset.bagQty) { const it = bag.items[+t.dataset.bagQty]; it.qty = Math.max(1, Math.min(99, it.qty + +t.dataset.d)); }
    else if (t.dataset.bagRemove) bag.items.splice(+t.dataset.bagRemove, 1);
    else if (t.matches('[data-bag-clear]')) bag.items = [];
    bag.save();
  });

  /* ---------- Quote form ---------- */
  const quote = $('[data-quote]');
  quote.addEventListener('click', e => { if (e.target.closest('[data-quote-close]')) close(quote); });
  $('[data-quote-form]').addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const extras = f.getAll('extras');
    const msg = `Hi VK Sports! I'd like a quote for custom teamwear.\n\nTeam: ${f.get('team')}\nSport: ${f.get('sport')}\nQuantity: ${f.get('qty')} pcs\nPersonalisation: ${extras.length ? extras.join(', ') : 'None'}${f.get('notes') ? `\nNotes: ${f.get('notes')}` : ''}`;
    window.open(waLink(msg), '_blank', 'noopener');
    close(quote);
  });

  /* ---------- Global clicks ---------- */
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-quick-size],[data-swatch],[data-quickview],[data-buy],[data-bag-open],[data-quote-open],[data-menu-open],[data-menu-close],[data-search-toggle]');
    if (!t) return;
    if (t.dataset.quickSize) {
      const card = t.closest('[data-card]');
      const p = byId(card.dataset.card);
      bag.add({ id: p.id, name: p.name, price: p.price, colour: card.dataset.colour, size: t.dataset.quickSize, qty: 1 });
      flyToBag($('[data-card-img]', card));
      toast(`Added — ${colours[card.dataset.colour].label}, size ${t.dataset.quickSize}`, { viewBag: true });
    } else if (t.dataset.swatch) {
      const card = t.closest('[data-card]');
      card.dataset.colour = t.dataset.swatch;
      $('[data-card-img]', card).src = t.dataset.img;
      $('[data-card-link]', card).href = productUrl(card.dataset.card, t.dataset.swatch);
      $$('[data-swatch]', card).forEach(s => {
        const on = s === t;
        s.classList.toggle('ring-ink', on);
        s.classList.toggle('ring-transparent', !on);
        s.setAttribute('aria-checked', on);
      });
    } else if (t.dataset.quickview || t.dataset.buy) {
      const card = t.closest('[data-card]');
      openQV(t.dataset.quickview || t.dataset.buy, card?.dataset.colour);
    } else if (t.matches('[data-bag-open]')) open($('[data-bag]'));
    else if (t.matches('[data-quote-open]')) { e.preventDefault(); open(quote); $('input[name=team]', quote).focus(); }
    else if (t.matches('[data-menu-open]')) open($('[data-menu]'));
    else if (t.matches('[data-menu-close]')) close($('[data-menu]'));
    else if (t.matches('[data-search-toggle]')) { const f = $('[data-mobile-search]'); f.classList.toggle('hidden'); if (!f.classList.contains('hidden')) $('input', f).focus(); }
  });

  /* ---------- Hero fade carousel ---------- */
  VK.initHero = root => {
    const slides = $$('.hero-slide', root);
    const dots = $('[data-hero-dots]', root);
    if (slides.length < 2) { slides[0]?.classList.add('is-active'); return; }
    dots.innerHTML = slides.map((_, i) => `<button class="hero-dot" aria-label="Go to slide ${i + 1}"></button>`).join('');
    const dotEls = $$('button', dots);
    // The progress bar's animation is the timer: when it finishes, advance.
    // Hover pauses it; reduced-motion users get no autoplay at all.
    const bar = $('[data-hero-progress]', root);
    root.style.setProperty('--hero-ms', '6500ms');
    let i = 0, started = false;
    const go = n => {
      // From the first change on, incoming slides wipe in (the first slide just appears)
      if (started) root.classList.add('ready');
      started = true;
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => { s.classList.toggle('is-active', k === i); s.setAttribute('aria-hidden', k !== i); s.inert = k !== i; });
      dotEls.forEach((d, k) => d.classList.toggle('is-active', k === i));
      bar.classList.remove('run'); void bar.offsetWidth; bar.classList.add('run');
    };
    bar.addEventListener('animationend', () => go(i + 1));
    dotEls.forEach((d, k) => d.addEventListener('click', () => go(k)));
    $('[data-hero-prev]', root).addEventListener('click', () => go(i - 1));
    $('[data-hero-next]', root).addEventListener('click', () => go(i + 1));
    // Mouse only — a tap on a phone would otherwise leave it stuck paused
    root.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') bar.classList.add('paused'); });
    root.addEventListener('pointerleave', () => bar.classList.remove('paused'));
    let x0 = null;
    root.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
      x0 = null;
    });
    go(0);

    // Mouse parallax: layers drift against the cursor by their data-depth (px)
    if (matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) {
      $$('.parallax', root).forEach(el => el.style.setProperty('--d', el.dataset.depth || 12));
      let frame;
      root.addEventListener('pointermove', e => {
        if (e.pointerType !== 'mouse') return;
        const r = root.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 2 - 1;
        const y = ((e.clientY - r.top) / r.height) * 2 - 1;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          root.style.setProperty('--px', x.toFixed(3));
          root.style.setProperty('--py', y.toFixed(3));
        });
      });
      root.addEventListener('pointerleave', () => { root.style.setProperty('--px', 0); root.style.setProperty('--py', 0); });
    }
  };

  /* ---------- Scroll-snap track carousel ---------- */
  VK.initTrack = (root, { autoplay = 0 } = {}) => {
    const track = $('[data-track]', root);
    const step = () => (track.firstElementChild?.getBoundingClientRect().width || 300) + parseFloat(getComputedStyle(track).columnGap || 16);
    const atEnd = () => track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    $('[data-prev]', root)?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    $('[data-next]', root)?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    const dots = $('[data-dots]', root);
    if (dots) {
      const pages = () => Math.max(1, Math.round((track.scrollWidth - track.clientWidth) / step()) + 1);
      const draw = () => {
        const n = pages(), cur = atEnd() ? n - 1 : Math.round(track.scrollLeft / step());
        dots.innerHTML = Array.from({ length: n }, (_, k) => `<button class="h-2.5 rounded-full transition-all ${k === cur ? 'w-7 bg-volt' : 'w-2.5 bg-slate-300'}" data-k="${k}" aria-label="Go to slide ${k + 1}"></button>`).join('');
      };
      dots.addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (b) track.scrollTo({ left: +b.dataset.k * step(), behavior: 'smooth' }); });
      track.addEventListener('scroll', () => requestAnimationFrame(draw), { passive: true });
      addEventListener('resize', draw);
      draw();
    }
    if (autoplay) {
      let timer;
      const play = () => { clearInterval(timer); timer = setInterval(() => track.scrollTo({ left: atEnd() ? 0 : track.scrollLeft + step(), behavior: 'smooth' }), autoplay); };
      root.addEventListener('mouseenter', () => clearInterval(timer));
      root.addEventListener('mouseleave', play);
      root.addEventListener('touchstart', () => clearInterval(timer), { passive: true });
      play();
    }
  };

  /* ---------- Scroll reveal ---------- */
  VK.observeReveal = () => {
    const els = $$('.reveal:not(.in)');
    if (!('IntersectionObserver' in window)) return els.forEach(el => el.classList.add('in'));
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
  };

  /* Fill <span data-icon="name" data-size="h-4 w-4"> placeholders and data-wa links in page markup */
  VK.hydrate = (root = document) => {
    $$('[data-icon]', root).forEach(el => { el.innerHTML = I[el.dataset.icon]?.(el.dataset.size || 'h-5 w-5') || ''; });
    $$('a[data-wa]', root).forEach(a => { a.href = waLink(a.dataset.wa); });
    $$('[data-config]', root).forEach(el => { el.textContent = config[el.dataset.config]; });
    $$('a[data-tel]', root).forEach(a => { a.href = `tel:+${config.whatsapp}`; });
    $$('a[data-mail]', root).forEach(a => { a.href = `mailto:${config.email}`; });
  };
  VK.hydrate();

  /* Policy pages: build the "On this page" list from the article's headings */
  const toc = $('[data-toc]');
  if (toc) {
    toc.innerHTML = $$('.prose-vk h2[id]').map(h => `<a href="#${h.id}" class="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-ink">${h.textContent}</a>`).join('');
  }

  VK.inr = inr;
  VK.waLink = waLink;
  VK.sportLabel = sportLabel;
  VK.esc = esc;
  VK.productUrl = productUrl;
  VK.stars = stars;
  VK.orderText = orderText;
  VK.bag = bag;
  VK.toast = toast;
  VK.flyToBag = flyToBag;
  VK.openOverlay = open;
  VK.closeOverlay = close;
  document.addEventListener('DOMContentLoaded', () => VK.observeReveal());
})();
