/* VK Sports — homepage sections */
(() => {
  const { products, icons: I } = VK;
  const $ = (s, r = document) => r.querySelector(s);

  /* Shop by sport tiles */
  const tiles = [
    { key: 'cricket',    label: 'Cricket',         icon: 'cricket',    bg: 'from-[#0b2a6b] to-[#1E5BFF]' },
    { key: 'football',   label: 'Football',        icon: 'football',   bg: 'from-[#06331a] to-[#16a34a]' },
    { key: 'basketball', label: 'Basketball',      icon: 'basketball', bg: 'from-[#4a1404] to-[#ea580c]' },
    { key: 'running',    label: 'Running',         icon: 'running',    bg: 'from-[#073b4c] to-[#0891b2]' },
    { key: 'gym',        label: 'Gym & Training',  icon: 'dumbbell',   bg: 'from-[#111827] to-[#4b5563]' },
    { key: 'custom',     label: 'Custom Teamwear', icon: 'shirt',      img: 'assets/img/jersey-blue-stadium.webp' },
  ];
  $('[data-sport-tiles]').innerHTML = tiles.map(t => `
    <a href="shop.html?sport=${t.key}" class="reveal group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br ${t.bg || 'from-ink to-ink'} p-4 text-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      ${t.img ? `<img src="${t.img}" alt="" loading="lazy" class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"><span class="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent"></span>`
              : `<span class="absolute -right-6 -top-4 text-white/15 transition duration-700 group-hover:rotate-12 group-hover:scale-110">${I[t.icon]('h-40 w-40')}</span>
                 <span class="absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(135deg,#fff_0_1px,transparent_1px_14px)]"></span>`}
      <span class="tile-sheen absolute inset-0"></span>
      <span class="relative mb-3 grid h-11 w-11 place-items-center rounded-xl bg-white/15 backdrop-blur">${I[t.icon]('h-6 w-6')}</span>
      <span class="relative font-display text-2xl font-extrabold uppercase italic leading-none">${t.label}</span>
      <span class="relative mt-2 inline-flex items-center gap-1 text-sm font-semibold text-volt">Shop now ${I.arrow('h-4 w-4 transition group-hover:translate-x-1')}</span>
    </a>`).join('');

  /* Best sellers carousel */
  const best = $('[data-best]');
  $('[data-track]', best).innerHTML = products.filter(p => p.bestseller).map(p =>
    `<div class="w-[78%] shrink-0 snap-start sm:w-[calc((100%-16px)/2)] md:w-[calc((100%-32px)/3)] lg:w-[calc((100%-48px)/4)] xl:w-[calc((100%-64px)/5)]">${VK.productCard(p)}</div>`).join('');
  VK.initTrack(best);

  /* Testimonials — placeholder content, replace with real reviews */
  const reviews = [
    { name: 'Amit Sharma',    role: 'Cricket Team Captain', text: 'Excellent quality jerseys and great service. Our entire team loved the custom designs from VK Sports.' },
    { name: 'Rohit Patil',    role: 'Football Coach',       text: 'Best sportswear store for team kits. Timely delivery and amazing fabric quality.' },
    { name: 'Sneha Deshmukh', role: 'Fitness Enthusiast',   text: 'Comfortable and stylish sportswear. Perfect for my training sessions.' },
    { name: 'Faizan Shaikh',  role: 'Kabaddi Club Manager', text: 'Names and numbers came out crisp, and the WhatsApp ordering made it so easy for our club.' },
    { name: 'Priya Kulkarni', role: 'School Sports Teacher', text: 'Ordered house jerseys for 120 students. Sizes were spot on and the colours really pop.' },
  ];
  const initials = n => n.split(' ').map(w => w[0]).join('').slice(0, 2);
  const avatarBg = ['bg-[#1E5BFF]', 'bg-[#E31B23]', 'bg-volt text-ink', 'bg-ink', 'bg-amber-500'];
  const rev = $('[data-reviews]');
  $('[data-track]', rev).innerHTML = reviews.map((r, i) => `
    <figure class="flex w-[86%] shrink-0 snap-start flex-col rounded-2xl bg-ice p-6 ring-1 ring-black/5 sm:w-[calc((100%-16px)/2)] lg:w-[calc((100%-32px)/3)]">
      <div class="flex items-center gap-4">
        <span class="grid h-14 w-14 shrink-0 place-items-center rounded-full ${avatarBg[i % avatarBg.length]} font-display text-xl font-extrabold text-white">${initials(r.name)}</span>
        <figcaption><p class="font-bold">${r.name}</p><p class="text-sm text-slate-500">${r.role}</p>
          <span class="mt-1 flex text-amber-400">${I.star('h-4 w-4').repeat(5)}</span></figcaption>
      </div>
      <blockquote class="mt-4 leading-relaxed text-slate-700">“${r.text}”</blockquote>
    </figure>`).join('');
  VK.initTrack(rev, { autoplay: 5000 });

  /* Teams we've kitted — drawn crests (or real logos when provided) */
  const crest = (t, i) => {
    const [c1, c2] = t.colours;
    const initials = t.name.split(/\s+/).filter(w => /^[A-Z]/.test(w)).map(w => w[0]).join('').slice(0, 2);
    return t.logo
      ? `<img src="${t.logo}" alt="" class="h-16 w-16 object-contain" loading="lazy">`
      : `<svg viewBox="0 0 100 100" class="h-16 w-16 drop-shadow transition duration-300 group-hover:scale-110 group-hover:-rotate-3" aria-hidden="true">
          <defs><clipPath id="crest-${i}"><path d="M50 4 L92 17 V48 C92 74 72 90 50 97 C28 90 8 74 8 48 V17 Z"/></clipPath></defs>
          <g clip-path="url(#crest-${i})"><rect width="100" height="100" fill="${c1}"/><polygon points="0,62 100,38 100,52 0,76" fill="${c2}" opacity=".9"/></g>
          <path d="M50 4 L92 17 V48 C92 74 72 90 50 97 C28 90 8 74 8 48 V17 Z" fill="none" stroke="${c2}" stroke-width="4"/>
          <text x="50" y="56" text-anchor="middle" font-family="'Barlow Condensed', sans-serif" font-weight="900" font-style="italic" font-size="34" fill="${c2}" stroke="${c1}" stroke-width="3" paint-order="stroke">${initials}</text>
        </svg>`;
  };
  const teamsEl = $('[data-teams]');
  const teamStrip = `<div class="flex shrink-0 items-center gap-6 pr-6 md:gap-10 md:pr-10">${VK.teams.map((t, i) => `
    <div class="group flex w-40 shrink-0 flex-col items-center text-center">
      ${crest(t, i)}
      <p class="mt-2 text-sm font-bold leading-tight">${t.name}</p>
      <p class="text-xs text-slate-400">${t.sport}</p>
    </div>`).join('')}</div>`;
  // Second copy keeps the loop seamless; hide it from screen readers
  teamsEl.innerHTML = teamStrip + teamStrip.replace(/crest-(\d+)/g, 'crest-b$1').replace('<div class="flex', '<div aria-hidden="true" class="flex');

  /* Marquee: duplicate the strip so the loop is seamless */
  const strip = $('[data-marquee]');
  strip.after(strip.cloneNode(true));

  VK.initHero($('[data-hero]'));
})();
