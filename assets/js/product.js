/* VK Sports — product detail page.
   Pre-built pages (product-<id>.html) carry the id in <body data-product-id>;
   product.html?id=…&colour=… still works as a fallback. */
(() => {
  const { products, colours, sizes, sizeChart, fabricInfo, care, icons: I, inr, esc } = VK;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const params = new URLSearchParams(location.search);
  const fixedId = document.body.dataset.productId;
  const p = products.find(x => x.id === (fixedId || params.get('id')));
  const root = $('[data-product]');

  if (!p) {
    document.title = 'Product not found — VK Sports';
    root.innerHTML = `
      <div class="mx-auto max-w-lg py-20 text-center">
        <p class="font-display text-5xl font-black uppercase italic">Product not found</p>
        <p class="mt-2 text-slate-500">This product may have been removed or the link is incorrect.</p>
        <a href="shop.html" class="mt-6 inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3 font-bold text-white">Browse all products ${I.arrow('h-4 w-4')}</a>
      </div>`;
    $('[data-related-wrap]').remove();
    return;
  }

  const off = Math.round((1 - p.price / p.mrp) * 100);
  const state = {
    colour: p.colours.some(c => c.key === params.get('colour')) ? params.get('colour') : p.colours[0].key,
    size: null,
    qty: 1,
  };

  document.title = `${p.name} — ${inr(p.price)} | VK Sports`;
  $('meta[name=description]').content = `${p.name} in ${p.fabric}. Sizes ${p.sizes[0]}–${p.sizes.at(-1)}, ${p.colours.length} colour${p.colours.length > 1 ? 's' : ''}. ${inr(p.price)}. Order on WhatsApp with pan-India delivery.`;

  const accordion = (title, body, openByDefault = false, id = '') => `
    <details class="group border-b border-slate-200 py-4" ${openByDefault ? 'open' : ''} ${id ? `id="${id}"` : ''}>
      <summary class="flex items-center justify-between gap-4 font-semibold">${title}<span class="faq-icon grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ice text-xl transition">+</span></summary>
      <div class="mt-3 text-sm leading-relaxed text-slate-600">${body}</div>
    </details>`;

  const chartRows = sizes.filter(s => p.sizes.includes(s)).map(s => `<tr class="border-b last:border-0"><td class="py-2 font-semibold">${s}</td><td>${sizeChart[s][0]}"</td><td>${sizeChart[s][1]}"</td></tr>`).join('');

  const render = () => {
    const c = p.colours.find(x => x.key === state.colour);
    const openState = $$('details', root).map(d => d.open);
    root.innerHTML = `
    <nav class="text-sm text-slate-500" aria-label="Breadcrumb">
      <a href="index.html" class="hover:text-ink">Home</a><span class="mx-2">/</span><a href="shop.html" class="hover:text-ink">Shop</a><span class="mx-2">/</span><a href="shop.html?sport=${p.sport}" class="hover:text-ink">${VK.sportLabel(p.sport)}</a><span class="mx-2">/</span><span class="text-ink">${esc(p.name)}</span>
    </nav>

    <div class="mt-6 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
      <!-- Gallery -->
      <div class="lg:sticky lg:top-32 lg:self-start">
        <div class="zoom-wrap relative overflow-hidden rounded-3xl bg-gradient-to-b from-white to-[#dfe6ee] ring-1 ring-black/5" data-zoom>
          ${p.badge ? `<span class="absolute left-4 top-4 z-10 rounded-full bg-ink px-3 py-1 text-xs font-bold uppercase tracking-wider text-volt">${p.badge}</span>` : ''}
          <span class="absolute right-4 top-4 z-10 rounded-full bg-volt px-2.5 py-1 text-xs font-bold text-ink">${off}% OFF</span>
          <img src="${c.img}" alt="${esc(p.name)} in ${colours[c.key].label}, front and back" class="aspect-[4/3] w-full object-contain p-4">
        </div>
        ${p.colours.length > 1 ? `
        <div class="mt-4 flex gap-3">
          ${p.colours.map(x => `
            <button class="w-24 overflow-hidden rounded-xl bg-white ring-2 transition sm:w-28 ${x.key === c.key ? 'ring-ink' : 'ring-transparent hover:ring-slate-300'}" data-colour="${x.key}" aria-label="Show ${colours[x.key].label}" aria-pressed="${x.key === c.key}">
              <img src="${x.img}" alt="" class="aspect-[4/3] w-full object-contain p-1">
            </button>`).join('')}
        </div>` : ''}
        <p class="mt-3 hidden text-xs text-slate-400 lg:block">Hover the image to zoom.</p>
      </div>

      <!-- Details -->
      <div>
        <p class="text-xs font-bold uppercase tracking-widest text-slate-400">${VK.sportLabel(p.sport)} · ${p.fabric}</p>
        <h1 class="mt-1 font-display text-4xl font-black uppercase italic leading-[.95] tracking-tight md:text-5xl">${esc(p.name)}</h1>
        <div class="mt-3 flex items-center gap-2 text-sm text-slate-500">${VK.stars(p.rating)} <span>${p.rating} · ${p.reviews} reviews</span></div>

        <div class="mt-5 flex flex-wrap items-baseline gap-3">
          <span class="text-4xl font-extrabold">${inr(p.price)}</span>
          <span class="text-lg text-slate-400 line-through">${inr(p.mrp)}</span>
          <span class="rounded-full bg-volt/15 px-2.5 py-1 text-sm font-bold text-emerald-700">You save ${inr(p.mrp - p.price)}</span>
        </div>
        <p class="mt-1 text-xs text-slate-400">Inclusive of all taxes. Shipping confirmed on WhatsApp.</p>

        <div class="mt-7">
          <p class="text-sm font-semibold">Colour: <span class="font-normal text-slate-500">${colours[c.key].label}</span></p>
          <div class="mt-2 flex gap-3">
            ${p.colours.map(x => `<button class="h-10 w-10 rounded-full ring-2 ring-offset-2 transition ${x.key === c.key ? 'ring-ink' : 'ring-transparent hover:ring-slate-300'}" style="background:${colours[x.key].hex}" data-colour="${x.key}" aria-label="${colours[x.key].label}" aria-pressed="${x.key === c.key}"></button>`).join('')}
          </div>
        </div>

        <div class="mt-7" id="sizes">
          <div class="flex items-center justify-between">
            <p class="text-sm font-semibold">Size${state.size ? `: <span class="font-normal text-slate-500">${state.size}</span>` : ''}</p>
            <a href="#size-chart" class="text-sm font-semibold text-emerald-700 underline underline-offset-4" data-open-chart>Size chart</a>
          </div>
          <div class="mt-2 flex flex-wrap gap-2" data-sizes>
            ${sizes.map(s => {
              const ok = p.sizes.includes(s);
              return `<button class="h-12 min-w-14 rounded-xl border px-3 font-semibold transition ${!ok ? 'cursor-not-allowed border-slate-100 text-slate-300 line-through' : s === state.size ? 'border-ink bg-ink text-white' : 'border-slate-200 bg-white hover:border-ink'}" ${ok ? `data-size="${s}"` : 'disabled'} aria-pressed="${s === state.size}">${s}</button>`;
            }).join('')}
          </div>
          <p class="mt-2 hidden text-sm font-medium text-red-600" data-size-err>Please select a size.</p>
        </div>

        <div class="mt-7 flex items-center gap-4">
          <p class="text-sm font-semibold">Qty</p>
          <div class="flex items-center rounded-xl border border-slate-200 bg-white">
            <button class="h-11 w-11 text-lg hover:bg-slate-50" data-qty="-1" aria-label="Decrease quantity">−</button>
            <span class="w-10 text-center font-semibold" data-qty-val>${state.qty}</span>
            <button class="h-11 w-11 text-lg hover:bg-slate-50" data-qty="1" aria-label="Increase quantity">+</button>
          </div>
        </div>

        <div class="mt-7 grid gap-3 sm:grid-cols-2">
          <button class="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-4 font-bold text-white transition hover:brightness-105" data-buy-now>${I.whatsapp('h-5 w-5')} Buy on WhatsApp</button>
          <button class="flex items-center justify-center gap-2 rounded-xl border-2 border-ink py-4 font-bold transition hover:bg-ink hover:text-white" data-add>${I.bag('h-5 w-5')} Add to Bag</button>
        </div>

        <div class="mt-5 flex items-center gap-4 rounded-2xl bg-ink p-4 text-white">
          <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-volt/15 text-volt">${I.shirt('h-6 w-6')}</span>
          <div class="flex-1 text-sm"><p class="font-semibold">Need names, numbers or a team logo?</p><p class="text-slate-400">Get team pricing for bulk and personalised orders.</p></div>
          <button class="shrink-0 rounded-lg bg-white px-3 py-2 text-sm font-bold text-ink hover:bg-volt" data-quote-open>Get quote</button>
        </div>

        <ul class="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-slate-600">
          <li class="rounded-xl bg-white p-3 ring-1 ring-black/5">${I.truck('mx-auto h-6 w-6 text-emerald-600')}<span class="mt-1 block font-semibold">Pan-India delivery</span></li>
          <li class="rounded-xl bg-white p-3 ring-1 ring-black/5">${I.check('mx-auto h-6 w-6 text-emerald-600')}<span class="mt-1 block font-semibold">Size exchange</span></li>
          <li class="rounded-xl bg-white p-3 ring-1 ring-black/5">${I.headset('mx-auto h-6 w-6 text-emerald-600')}<span class="mt-1 block font-semibold">WhatsApp support</span></li>
        </ul>

        <div class="mt-8">
          ${accordion('Description', `<p>The ${esc(p.name)} is made for ${VK.sportLabel(p.sport).toLowerCase()} players who want to look sharp and stay comfortable. Sublimated graphics won't crack or fade, and the raglan sleeves give you a full range of movement.</p>
            <ul class="mt-3 space-y-1.5">${['Sublimation print — colours stay bright wash after wash', 'Raglan sleeves and V-neck collar', `Suited to ${p.type.includes('team') ? 'teams, clubs and bulk orders' : 'individual players'}`, 'Names, numbers and logos can be added on request'].map(t => `<li class="flex gap-2">${I.check('h-4 w-4 mt-0.5 shrink-0 text-volt')}${t}</li>`).join('')}</ul>`, true)}
          ${accordion('Fabric & care', `<p><strong class="text-ink">${p.fabric}:</strong> ${fabricInfo[p.fabric] || ''}</p>
            <ul class="mt-3 space-y-1.5">${care.map(t => `<li class="flex gap-2">${I.check('h-4 w-4 mt-0.5 shrink-0 text-volt')}${t}</li>`).join('')}</ul>`)}
          ${accordion('Size chart', `<p>Measure around the fullest part of your chest. Between sizes? Go one up for a relaxed fit.</p>
            <table class="mt-3 w-full text-center"><thead><tr class="bg-ink text-white"><th class="rounded-l-lg py-2">Size</th><th>Chest</th><th class="rounded-r-lg">Length</th></tr></thead><tbody>${chartRows}</tbody></table>
            <p class="mt-2"><a href="faq.html#size-guide" class="font-semibold text-emerald-700 underline">Full size guide</a></p>`, false, 'size-chart')}
          ${accordion('Delivery & returns', `<p>We ship across India. Ready-stock items are usually dispatched within 1–2 working days. Unused items can be exchanged for another size within 7 days of delivery; personalised items can't be returned unless damaged or incorrect.</p>
            <p class="mt-2"><a href="shipping.html" class="font-semibold text-emerald-700 underline">Shipping policy</a> · <a href="returns.html" class="font-semibold text-emerald-700 underline">Returns policy</a></p>`)}
        </div>
      </div>
    </div>

    <!-- Sticky buy bar on phones -->
    <div class="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
      <div class="min-w-0 flex-1">
        <p class="truncate text-xs text-slate-500">${colours[c.key].label}${state.size ? ` · Size ${state.size}` : ' · Select size'}</p>
        <p class="text-lg font-extrabold leading-tight">${inr(p.price * state.qty)}</p>
      </div>
      <button class="grid h-12 w-12 place-items-center rounded-xl border-2 border-ink" data-add aria-label="Add to bag">${I.bag('h-5 w-5')}</button>
      <button class="flex h-12 items-center gap-2 rounded-xl bg-[#25D366] px-5 font-bold text-white" data-buy-now>${I.whatsapp('h-5 w-5')} Buy</button>
    </div>`;
    // Keep accordions as the shopper left them
    if (openState.length) $$('details', root).forEach((d, i) => { d.open = openState[i]; });
  };

  const requireSize = () => {
    if (state.size) return true;
    $('[data-size-err]', root).classList.remove('hidden');
    const box = $('[data-sizes]', root);
    $('#sizes').scrollIntoView({ behavior: 'smooth', block: 'center' });
    box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake');
    return false;
  };
  const item = () => ({ id: p.id, name: p.name, price: p.price, colour: state.colour, size: state.size, qty: state.qty });

  root.addEventListener('click', e => {
    const t = e.target.closest('button,[data-open-chart]');
    if (!t) return;
    if (t.dataset.colour) {
      state.colour = t.dataset.colour;
      history.replaceState(null, '', fixedId ? `?colour=${state.colour}` : `?id=${p.id}&colour=${state.colour}`);
      render();
    } else if (t.dataset.size) { state.size = t.dataset.size; render(); }
    else if (t.dataset.qty) { state.qty = Math.max(1, Math.min(99, state.qty + +t.dataset.qty)); render(); }
    else if (t.matches('[data-buy-now]')) { if (requireSize()) window.open(VK.waLink(VK.orderText([item()])), '_blank', 'noopener'); }
    else if (t.matches('[data-add]')) {
      if (!requireSize()) return;
      VK.bag.add(item());
      VK.flyToBag($('[data-zoom] img', root));
      VK.toast(`Added — ${colours[state.colour].label}, size ${state.size}`, { viewBag: true });
    }
    else if (t.matches('[data-open-chart]')) { e.preventDefault(); const d = $('#size-chart'); d.open = true; d.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  });

  // Zoom follows the cursor
  root.addEventListener('mousemove', e => {
    const z = e.target.closest('[data-zoom]');
    if (!z) return;
    const r = z.getBoundingClientRect();
    $('img', z).style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
  });

  render();

  // Related: same sport first, then bestsellers
  const related = products.filter(x => x.id !== p.id)
    .sort((a, b) => (b.sport === p.sport) - (a.sport === p.sport) || (b.bestseller || 0) - (a.bestseller || 0));
  const rel = $('[data-related]');
  $('[data-track]', rel).innerHTML = related.map(x =>
    `<div class="w-[78%] shrink-0 snap-start sm:w-[calc((100%-16px)/2)] md:w-[calc((100%-32px)/3)] lg:w-[calc((100%-48px)/4)]">${VK.productCard(x)}</div>`).join('');
  VK.initTrack(rel);
})();
