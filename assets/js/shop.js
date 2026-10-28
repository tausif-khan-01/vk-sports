/* VK Sports — catalogue filters */
(() => {
  const { products, sports, colours, fabrics, sizes, inr } = VK;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const maxPrice = Math.ceil(Math.max(...products.map(p => p.price)) / 50) * 50;
  const params = new URLSearchParams(location.search);
  const listParam = k => new Set((params.get(k) || '').split(',').filter(Boolean));
  const state = {
    sport: listParam('sport'),
    type: listParam('type'),
    size: listParam('size'),
    fabric: listParam('fabric'),
    colour: listParam('colour'),
    price: Math.min(+params.get('max') || maxPrice, maxPrice),
    q: (params.get('q') || '').trim(),
    sort: params.get('sort') || 'popular',
  };
  const types = [{ key: 'team', label: 'Team & bulk orders' }, { key: 'individual', label: 'Individual' }];

  /* Build filter form */
  const count = (field, val) => products.filter(p => field === 'type' ? p.type.includes(val) : p[field] === val).length;
  const checkRow = (name, val, label, n) => `
    <label class="flex cursor-pointer items-center gap-3 py-1 text-sm">
      <input type="checkbox" name="${name}" value="${val}" class="h-4 w-4 rounded border-slate-300 accent-[#24D653]" ${state[name].has(val) ? 'checked' : ''}>
      <span class="flex-1">${label}</span><span class="text-xs text-slate-400">${n}</span>
    </label>`;
  const group = (title, body) => `<fieldset><legend class="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">${title}</legend>${body}</fieldset>`;

  const form = $('[data-filter-form]');
  form.innerHTML = [
    state.q ? group('Search', `<div class="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-black/5"><span>“${state.q.replace(/[<>&"]/g, '')}”</span><button type="button" class="text-slate-400 hover:text-red-600" data-clear-q aria-label="Clear search">✕</button></div>`) : '',
    group('Sport', sports.map(s => checkRow('sport', s.key, s.label, count('sport', s.key))).join('')),
    group('Team type', types.map(t => checkRow('type', t.key, t.label, count('type', t.key))).join('')),
    group('Size', `<div class="flex flex-wrap gap-2">${sizes.map(s => `
      <label class="cursor-pointer"><input type="checkbox" name="size" value="${s}" class="peer sr-only" ${state.size.has(s) ? 'checked' : ''}>
        <span class="grid h-10 min-w-11 place-items-center rounded-lg border border-slate-200 bg-white px-2 text-sm font-semibold transition peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-volt">${s}</span></label>`).join('')}</div>`),
    group('Max price', `
      <input type="range" name="price" min="${Math.floor(Math.min(...products.map(p => p.price)) / 50) * 50}" max="${maxPrice}" step="50" value="${state.price}" class="w-full" aria-label="Maximum price">
      <div class="mt-1 flex justify-between text-sm"><span class="text-slate-500">Up to</span><span class="font-bold" data-price-out>${inr(state.price)}</span></div>`),
    group('Fabric', fabrics.map(f => checkRow('fabric', f, f, count('fabric', f))).join('')),
    group('Colour', `<div class="flex flex-wrap gap-2">${Object.entries(colours).map(([k, c]) => `
      <label class="cursor-pointer"><input type="checkbox" name="colour" value="${k}" class="peer sr-only" ${state.colour.has(k) ? 'checked' : ''}>
        <span class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 text-sm transition peer-checked:border-ink peer-checked:ring-1 peer-checked:ring-ink peer-focus-visible:ring-2 peer-focus-visible:ring-volt"><span class="h-5 w-5 rounded-full" style="background:${c.hex}"></span>${c.label}</span></label>`).join('')}</div>`),
    `<button type="button" class="hidden text-sm font-semibold text-slate-500 underline hover:text-ink lg:block" data-filters-reset>Reset all filters</button>`,
  ].join('');
  $('[data-sort]').value = state.sort;

  /* Filtering */
  const matches = p => {
    if (state.sport.size && !state.sport.has(p.sport)) return false;
    if (state.type.size && !p.type.some(t => state.type.has(t))) return false;
    if (state.size.size && !p.sizes.some(s => state.size.has(s))) return false;
    if (state.fabric.size && !state.fabric.has(p.fabric)) return false;
    if (state.colour.size && !p.colours.some(c => state.colour.has(c.key))) return false;
    if (p.price > state.price) return false;
    if (state.q) {
      const hay = `${p.name} ${VK.sportLabel(p.sport)} ${p.fabric} ${p.colours.map(c => colours[c.key].label).join(' ')} jersey t-shirt`.toLowerCase();
      if (!state.q.toLowerCase().split(/\s+/).every(w => hay.includes(w))) return false;
    }
    return true;
  };
  const sorters = {
    popular: (a, b) => b.reviews - a.reviews,
    low: (a, b) => a.price - b.price,
    high: (a, b) => b.price - a.price,
    discount: (a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp,
  };

  const syncURL = () => {
    const u = new URLSearchParams();
    ['sport', 'type', 'size', 'fabric', 'colour'].forEach(k => state[k].size && u.set(k, [...state[k]].join(',')));
    if (state.price < maxPrice) u.set('max', state.price);
    if (state.q) u.set('q', state.q);
    if (state.sort !== 'popular') u.set('sort', state.sort);
    history.replaceState(null, '', u.toString() ? `?${u}` : location.pathname);
  };

  const chip = (label, key, val) => `<button class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600" data-chip="${key}" data-val="${val}">${label} <span aria-hidden="true">✕</span><span class="sr-only">remove filter</span></button>`;

  const render = () => {
    const list = products.filter(matches).sort(sorters[state.sort]);
    // Show the first matching colourway on each card when filtering by colour
    $('[data-grid]').innerHTML = list.map(p => {
      const cs = state.colour.size ? [...p.colours].sort((a, b) => state.colour.has(b.key) - state.colour.has(a.key)) : p.colours;
      return `<div class="reveal in">${VK.productCard({ ...p, colours: cs })}</div>`;
    }).join('');
    $('[data-empty]').classList.toggle('hidden', list.length > 0);
    $('[data-result-count]').textContent = `${list.length} product${list.length === 1 ? '' : 's'}`;

    const chips = [
      ...[...state.sport].map(v => chip(VK.sportLabel(v), 'sport', v)),
      ...[...state.type].map(v => chip(types.find(t => t.key === v)?.label || v, 'type', v)),
      ...[...state.size].map(v => chip(`Size ${v}`, 'size', v)),
      ...[...state.fabric].map(v => chip(v, 'fabric', v)),
      ...[...state.colour].map(v => chip(colours[v]?.label || v, 'colour', v)),
      ...(state.price < maxPrice ? [chip(`Under ${inr(state.price)}`, 'price', '')] : []),
    ];
    $('[data-active-chips]').innerHTML = chips.join('');
    const fc = $('[data-filter-count]');
    fc.textContent = chips.length;
    fc.classList.toggle('hidden', !chips.length);

    const onlySport = state.sport.size === 1 ? VK.sportLabel([...state.sport][0]) : null;
    $('[data-shop-title]').textContent = state.q ? `Results for “${state.q}”` : onlySport || 'All Products';
    syncURL();
  };

  form.addEventListener('input', e => {
    const t = e.target;
    if (t.name === 'price') { state.price = +t.value; $('[data-price-out]').textContent = inr(state.price); }
    else if (state[t.name] instanceof Set) t.checked ? state[t.name].add(t.value) : state[t.name].delete(t.value);
    render();
  });
  $('[data-sort]').addEventListener('change', e => { state.sort = e.target.value; render(); });

  const resetAll = () => {
    ['sport', 'type', 'size', 'fabric', 'colour'].forEach(k => state[k].clear());
    state.price = maxPrice;
    state.q = '';
    $$('input[type=checkbox]', form).forEach(i => { i.checked = false; });
    $('input[name=price]', form).value = maxPrice;
    $('[data-price-out]').textContent = inr(maxPrice);
    $('[data-clear-q]')?.closest('fieldset').remove();
    render();
  };

  const drawer = $('[data-filters]');
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-chip],[data-filters-reset],[data-filters-open],[data-filters-close],[data-clear-q]');
    if (!t) return;
    if (t.dataset.chip) {
      const k = t.dataset.chip;
      if (k === 'price') { state.price = maxPrice; $('input[name=price]', form).value = maxPrice; $('[data-price-out]').textContent = inr(maxPrice); }
      else { state[k].delete(t.dataset.val); const box = $(`input[name="${k}"][value="${t.dataset.val}"]`, form); if (box) box.checked = false; }
      render();
    } else if (t.matches('[data-filters-reset]')) resetAll();
    else if (t.matches('[data-clear-q]')) { state.q = ''; t.closest('fieldset').remove(); $$('input[name=q]').forEach(i => { i.value = ''; }); render(); }
    else if (t.matches('[data-filters-open]')) { drawer.classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
    else if (t.matches('[data-filters-close]')) { drawer.classList.add('hidden'); document.body.style.overflow = ''; }
  });

  $$('input[name=q]').forEach(i => { i.value = state.q; });
  render();
})();
