/* VK Sports — live jersey designer (customise.html)
   The design is drawn as SVG, saved in this browser, and encoded in the page link (#d=…)
   so a shared WhatsApp link reopens the exact design. The uploaded logo never leaves the device. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const { esc } = VK;

  const PALETTE = [
    ['Black', '#111418'], ['White', '#F5F7FA'], ['Navy', '#0B1F4B'], ['Royal Blue', '#1E5BFF'],
    ['Sky', '#38BDF8'], ['Fire Red', '#E31B23'], ['Maroon', '#7A1222'], ['Volt Green', '#24D653'],
    ['Forest', '#0F6B3A'], ['Yellow', '#FACC15'], ['Orange', '#F97316'], ['Purple', '#7C3AED'],
  ];
  const PATTERNS = [['chevron', 'Chevron'], ['diagonal', 'Diagonal'], ['sash', 'Sash'], ['hoops', 'Hoops'], ['halves', 'Halves'], ['fade', 'Fade'], ['plain', 'Plain']];
  const FONTS = {
    block:   { label: 'Block',   family: "'Barlow Condensed', Impact, sans-serif", weight: 800, style: 'normal' },
    italic:  { label: 'Speed',   family: "'Barlow Condensed', Impact, sans-serif", weight: 800, style: 'italic' },
    varsity: { label: 'Varsity', family: "Georgia, 'Times New Roman', serif",      weight: 700, style: 'normal' },
  };
  const PRESETS = [
    { label: 'Pro Blue', pattern: 'chevron',  base: '#111418', accent: '#1E5BFF', text: '#F5F7FA', collar: 'v', sleeves: true },
    { label: 'Inferno',  pattern: 'diagonal', base: '#111418', accent: '#E31B23', text: '#F5F7FA', collar: 'v', sleeves: true },
    { label: 'Volt',     pattern: 'chevron',  base: '#111418', accent: '#24D653', text: '#F5F7FA', collar: 'v', sleeves: true },
    { label: 'Classic',  pattern: 'hoops',    base: '#F5F7FA', accent: '#0B1F4B', text: '#0B1F4B', collar: 'round', sleeves: false },
  ];
  const DEFAULTS = { ...PRESETS[0], name: 'YOUR NAME', number: '10', font: 'italic', frontNumber: false, team: '', qty: '' };
  const KEYS = Object.keys(DEFAULTS).filter(k => k !== 'label');
  const STORE_KEY = 'vk-design';

  const colourName = hex => (PALETTE.find(([, h]) => h.toLowerCase() === hex.toLowerCase()) || [`Custom ${hex.toUpperCase()}`])[0];
  const lum = hex => {
    const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

  /* ---------- State: link > saved > defaults ---------- */
  const encode = s => btoa(unescape(encodeURIComponent(JSON.stringify(Object.fromEntries(KEYS.map(k => [k, s[k]])))))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const decode = str => JSON.parse(decodeURIComponent(escape(atob(str.replace(/-/g, '+').replace(/_/g, '/')))));
  const clean = obj => {
    const s = { ...DEFAULTS };
    for (const k of KEYS) if (obj && k in obj && typeof obj[k] === typeof DEFAULTS[k]) s[k] = obj[k];
    for (const k of ['base', 'accent', 'text']) if (!/^#[0-9a-f]{6}$/i.test(s[k])) s[k] = DEFAULTS[k];
    if (!PATTERNS.some(([p]) => p === s.pattern)) s.pattern = DEFAULTS.pattern;
    if (!FONTS[s.font]) s.font = DEFAULTS.font;
    s.name = s.name.slice(0, 14); s.number = s.number.replace(/\D/g, '').slice(0, 2);
    return s;
  };
  let state = (() => {
    const m = location.hash.match(/d=([\w-]+)/);
    if (m) { try { return clean(decode(m[1])); } catch { /* bad link, fall through */ } }
    try { return clean(JSON.parse(localStorage.getItem(STORE_KEY))); } catch { return { ...DEFAULTS }; }
  })();
  let logo = null; // data URL, memory only

  /* ---------- Jersey drawing ---------- */
  const OUTLINE_REST = 'L305,45 Q345,60 382,150 L330,182 L302,150 L300,428 Q200,444 100,428 L98,150 L70,182 L18,150 Q55,60 95,45 Z';
  const NECK = { v: 'M150,30 L200,96 L250,30', round: 'M150,30 Q200,72 250,30', back: 'M150,30 Q200,46 250,30' };
  const SLEEVES = [
    'M150,30 L95,45 Q55,60 18,150 L70,182 L98,150 Q118,86 150,30 Z',
    'M250,30 L305,45 Q345,60 382,150 L330,182 L302,150 Q282,86 250,30 Z',
  ];

  const pattern = (s, id) => {
    const a = s.accent;
    switch (s.pattern) {
      case 'chevron': return Array.from({ length: 9 }, (_, k) => {
        const y = 150 + k * 30;
        return `<polyline points="20,${y} 200,${y + 100} 380,${y}" fill="none" stroke="${a}" stroke-width="${k % 2 ? 6 : 13}" opacity="${(0.5 + (k % 3) * 0.2).toFixed(2)}"/>`;
      }).join('');
      case 'diagonal': return Array.from({ length: 20 }, (_, k) => `<line x1="${k * 34 - 300}" y1="470" x2="${k * 34}" y2="0" stroke="${a}" stroke-width="${k % 3 ? 7 : 16}" opacity="${k % 2 ? 0.55 : 0.9}"/>`).join('');
      case 'sash': return `<polygon points="70,20 165,20 340,450 245,450" fill="${a}"/><polygon points="175,20 195,20 370,450 350,450" fill="${a}" opacity=".6"/>`;
      case 'hoops': return Array.from({ length: 6 }, (_, k) => `<rect x="0" y="${140 + k * 54}" width="400" height="26" fill="${a}"/>`).join('');
      case 'halves': return `<rect x="200" y="0" width="200" height="460" fill="${a}"/>`;
      case 'fade': return `<linearGradient id="${id}-fade" x1="0" y1="0" x2="0" y2="1"><stop offset=".25" stop-color="${a}" stop-opacity="0"/><stop offset="1" stop-color="${a}"/></linearGradient><rect width="400" height="460" fill="url(#${id}-fade)"/>`;
      default: return '';
    }
  };

  const textAttrs = (s, size, weight) => {
    const f = FONTS[s.font];
    return `font-family="${f.family}" font-weight="${weight || f.weight}" font-style="${f.style}" font-size="${size}" text-anchor="middle"`;
  };

  // One view of the shirt in a 400×460 box. view: 'front' | 'back'
  const shirt = (s, view, id, { thumb = false } = {}) => {
    const neck = view === 'back' ? NECK.back : NECK[s.collar];
    const outline = `${neck} ${OUTLINE_REST}`;
    const mirror = view === 'back' && ['diagonal', 'sash', 'halves'].includes(s.pattern) ? 'transform="translate(400,0) scale(-1,1)"' : '';
    const trimCol = s.sleeves ? s.base : s.accent;
    const sleeveFill = s.sleeves ? s.accent : 'none';
    const numStroke = contrast(s.accent, s.text) < 1.5 ? s.base : s.accent;
    const name = (s.name || '').toUpperCase();
    const num = s.number || '';
    let marks = '';
    if (!thumb && view === 'back') {
      marks += `<text x="200" y="66" ${textAttrs({ font: 'italic' }, 17)} fill="${s.text}" opacity=".85">VK</text>`;
      if (name) marks += `<text x="200" y="140" ${textAttrs(s, 48)} fill="${s.text}" letter-spacing="2" ${name.length > 9 ? 'textLength="230" lengthAdjust="spacingAndGlyphs"' : ''}>${esc(name)}</text>`;
      if (num) marks += `<text x="200" y="345" ${textAttrs(s, s.font === 'varsity' ? 170 : 205)} fill="${s.text}" stroke="${numStroke}" stroke-width="7" paint-order="stroke" stroke-linejoin="round">${esc(num)}</text>`;
    }
    if (!thumb && view === 'front') {
      marks += `<text x="140" y="128" ${textAttrs({ font: 'italic' }, 34, 900)} fill="${s.text}">VK</text>
                <text x="140" y="146" ${textAttrs({ font: 'italic' }, 13)} fill="${s.text}" letter-spacing="1">SPORTS</text>`;
      if (logo) marks += `<image href="${logo}" x="226" y="94" width="58" height="58" preserveAspectRatio="xMidYMid meet"/>`;
      if (s.frontNumber && num) marks += `<text x="200" y="262" ${textAttrs(s, s.font === 'varsity' ? 74 : 88)} fill="${s.text}" stroke="${numStroke}" stroke-width="4" paint-order="stroke">${esc(num)}</text>`;
    }
    return `
      <defs>
        <clipPath id="${id}-clip"><path d="${outline}"/></clipPath>
        <linearGradient id="${id}-shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/>
        </linearGradient>
      </defs>
      ${view === 'front' ? `<path d="M150,30 Q200,52 250,30 L200,96 Z" fill="${s.base}"/><path d="M150,30 Q200,52 250,30 L200,96 Z" fill="#000" opacity=".45"/>` : ''}
      <g clip-path="url(#${id}-clip)">
        <rect width="400" height="460" fill="${s.base}"/>
        <g ${mirror}>${pattern(s, id)}</g>
        ${SLEEVES.map(d => `<path d="${d}" fill="${sleeveFill}"/>`).join('')}
        <path d="M150,170 Q160,300 142,430 M262,180 Q250,310 262,430" stroke="#000" stroke-opacity=".1" stroke-width="10" fill="none"/>
        <rect width="400" height="460" fill="url(#${id}-shade)"/>
      </g>
      <path d="M18,150 L70,182 M382,150 L330,182" stroke="${trimCol}" stroke-width="12"/>
      <path d="${neck}" fill="none" stroke="${s.accent === s.base ? s.text : s.accent}" stroke-width="${view === 'back' ? 9 : 11}" stroke-linejoin="round"/>
      <path d="${outline}" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="2"/>
      ${marks}`;
  };

  const fullSVG = (s, extraDefs = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 470" role="img" aria-label="Jersey design preview, front and back" class="h-auto w-full drop-shadow-[0_25px_30px_rgba(0,0,0,.5)]">
      ${extraDefs}
      <g transform="translate(10,6)">${shirt(s, 'front', 'jf')}</g>
      <g transform="translate(430,6)">${shirt(s, 'back', 'jb')}</g>
    </svg>`;

  /* ---------- Controls ---------- */
  const form = $('[data-designer]');
  const ring = (on) => (on ? 'ring-2 ring-ink ring-offset-2' : 'ring-1 ring-slate-200 hover:ring-slate-400');

  $('[data-presets]').innerHTML = PRESETS.map((p, i) => `
    <button type="button" class="group overflow-hidden rounded-xl bg-ice p-2 text-center ring-1 ring-slate-200 transition hover:ring-ink" data-preset="${i}">
      <svg viewBox="0 0 400 460" class="mx-auto h-16 w-auto transition group-hover:scale-105" aria-hidden="true">${shirt({ ...DEFAULTS, ...p }, 'front', `p${i}`, { thumb: true })}</svg>
      <span class="mt-1 block text-xs font-bold uppercase tracking-wide">${p.label}</span>
    </button>`).join('');

  const patternsEl = $('[data-patterns]');
  patternsEl.className = 'mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7';

  $('[data-colour-rows]').innerHTML = [['base', 'Base colour'], ['accent', 'Accent colour'], ['text', 'Name & number']].map(([key, label]) => `
    <div>
      <p class="text-sm font-semibold">${label}: <span class="font-normal text-slate-500" data-colour-name="${key}"></span></p>
      <div class="mt-2 flex flex-wrap items-center gap-2">
        ${PALETTE.map(([n, h]) => `<button type="button" class="h-8 w-8 rounded-full border border-black/10 transition" style="background:${h}" data-colour="${key}" data-hex="${h}" aria-label="${label}: ${n}" title="${n}"></button>`).join('')}
        <label class="relative grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-[conic-gradient(red,yellow,lime,cyan,blue,magenta,red)] ring-1 ring-slate-200" title="Pick any colour">
          <input type="color" class="absolute inset-0 h-full w-full cursor-pointer opacity-0" data-colour-custom="${key}" aria-label="${label}: custom colour">
          <span class="h-3 w-3 rounded-full bg-white"></span>
        </label>
      </div>
    </div>`).join('');

  const renderControls = () => {
    patternsEl.innerHTML = PATTERNS.map(([key, label]) => `
      <button type="button" class="rounded-xl bg-ice p-1.5 text-center transition ${ring(state.pattern === key)}" data-pattern="${key}" role="radio" aria-checked="${state.pattern === key}">
        <svg viewBox="0 0 400 460" class="mx-auto h-14 w-auto" aria-hidden="true">${shirt({ ...state, pattern: key }, 'front', `t-${key}`, { thumb: true })}</svg>
        <span class="mt-0.5 block text-[11px] font-bold uppercase">${label}</span>
      </button>`).join('');
    $$('[data-colour]').forEach(b => {
      const on = state[b.dataset.colour].toLowerCase() === b.dataset.hex.toLowerCase();
      b.className = `h-8 w-8 rounded-full border border-black/10 transition ${on ? 'ring-2 ring-ink ring-offset-2' : 'hover:scale-110'}`;
      b.setAttribute('aria-pressed', on);
    });
    $$('[data-colour-name]').forEach(el => { el.textContent = colourName(state[el.dataset.colourName]); });
    $$('[data-colour-custom]').forEach(i => { i.value = state[i.dataset.colourCustom]; });
  };

  const syncInputs = () => {
    for (const el of form.elements) {
      if (!el.name || !(el.name in state)) continue;
      if (el.type === 'radio') el.checked = state[el.name] === el.value;
      else if (el.type === 'checkbox') el.checked = !!state[el.name];
      else if (el.type !== 'file') el.value = state[el.name];
    }
  };

  /* ---------- Message & link ---------- */
  const designURL = () => `${location.origin}${location.pathname}#d=${encode(state)}`;
  const message = () => {
    const f = FONTS[state.font];
    return [
      "Hi VK Sports! I designed a jersey on your website:",
      '',
      state.team ? `Team: ${state.team}` : null,
      `Style: ${PATTERNS.find(([k]) => k === state.pattern)[1]} pattern, ${state.collar === 'v' ? 'V-neck' : 'round'} collar${state.sleeves ? ', contrast sleeves' : ''}`,
      `Colours: ${colourName(state.base)} base, ${colourName(state.accent)} accent, ${colourName(state.text)} lettering`,
      `Name: ${state.name ? state.name.toUpperCase() : '(none)'} | Number: ${state.number || '(none)'}${state.frontNumber ? ' (front + back)' : ''}`,
      `Lettering: ${f.label}`,
      `Team logo: ${logo ? "Yes — I'll attach it here" : 'No'}`,
      state.qty ? `Quantity: about ${state.qty} pcs` : null,
      '',
      `View my design: ${designURL()}`,
      '',
      'Please share pricing and delivery time.',
    ].filter(l => l !== null).join('\n');
  };

  /* ---------- Render ---------- */
  const preview = $('[data-preview]');
  const render = () => {
    preview.innerHTML = fullSVG(state);
    renderControls();
    $('[data-send]').href = VK.waLink(message());
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch { /* storage unavailable */ }
    history.replaceState(null, '', `#d=${encode(state)}`);
  };

  form.addEventListener('input', e => {
    const el = e.target;
    if (el.dataset.colourCustom) { state[el.dataset.colourCustom] = el.value; return render(); }
    if (!el.name || !(el.name in state)) return;
    if (el.name === 'number') el.value = el.value.replace(/\D/g, '').slice(0, 2);
    state[el.name] = el.type === 'checkbox' ? el.checked : el.value;
    render();
  });

  form.addEventListener('click', e => {
    const b = e.target.closest('[data-pattern],[data-colour],[data-preset]');
    if (!b) return;
    if (b.dataset.pattern) state.pattern = b.dataset.pattern;
    else if (b.dataset.colour) state[b.dataset.colour] = b.dataset.hex;
    else if (b.dataset.preset) { const { label, ...p } = PRESETS[+b.dataset.preset]; Object.assign(state, p); syncInputs(); }
    render();
  });

  // Logo upload (stays in memory on this device)
  const logoInput = $('input[name=logo]');
  logoInput.addEventListener('change', () => {
    const file = logoInput.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { VK.toast('Please choose an image under 5 MB'); logoInput.value = ''; return; }
    const r = new FileReader();
    r.onload = () => {
      logo = r.result;
      $('[data-logo-label]').textContent = file.name.length > 22 ? `${file.name.slice(0, 20)}…` : file.name;
      $('[data-logo-remove]').classList.remove('hidden');
      render();
    };
    r.readAsDataURL(file);
  });
  $('[data-logo-remove]').addEventListener('click', () => {
    logo = null; logoInput.value = '';
    $('[data-logo-label]').textContent = 'Upload logo';
    $('[data-logo-remove]').classList.add('hidden');
    render();
  });

  // Surprise me: random pattern + readable colour combo
  $('[data-surprise]').addEventListener('click', () => {
    const pick = a => a[Math.floor(Math.random() * a.length)];
    const base = pick(PALETTE)[1];
    const accent = pick(PALETTE.filter(([, h]) => contrast(h, base) > 2))[1];
    const text = ['#F5F7FA', '#111418', accent].sort((a, b) => contrast(b, base) - contrast(a, base))[0];
    Object.assign(state, { pattern: pick(PATTERNS)[0], base, accent, text, collar: pick(['v', 'round']), sleeves: Math.random() > 0.35 });
    syncInputs(); render();
  });

  $('[data-copy-link]').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(designURL()); VK.toast('Design link copied'); }
    catch { prompt('Copy this link:', designURL()); }
  });

  /* ---------- Download as PNG ----------
     Fonts inside an SVG drawn to canvas must be embedded, so we fetch the
     Barlow Condensed files once and inline them. Falls back to system fonts. */
  let fontCSS = null;
  const toB64 = buf => { let s = ''; const b = new Uint8Array(buf); for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode(...b.subarray(i, i + 0x8000)); return btoa(s); };
  const embeddedFonts = async () => {
    if (fontCSS !== null) return fontCSS;
    try {
      const css = await (await fetch('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,800;0,900;1,800;1,900&display=swap')).text();
      const faces = css.split('@font-face').slice(1).filter(b => b.includes('U+0000-00FF'));
      fontCSS = (await Promise.all(faces.map(async b => {
        const url = b.match(/url\((.*?)\)/)[1];
        const data = toB64(await (await fetch(url)).arrayBuffer());
        return `@font-face${b.replace(/url\(.*?\)/, `url(data:font/woff2;base64,${data})`)}`;
      }))).join('\n');
    } catch { fontCSS = ''; }
    return fontCSS;
  };
  const loadImg = src => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });

  $('[data-download]').addEventListener('click', async e => {
    const btn = e.currentTarget;
    btn.disabled = true; btn.classList.add('opacity-60');
    try {
      const W = 1600, H = 1000;
      const c = Object.assign(document.createElement('canvas'), { width: W, height: H });
      const ctx = c.getContext('2d');
      const g = ctx.createRadialGradient(W / 2, H * 0.4, 50, W / 2, H * 0.4, W * 0.7);
      g.addColorStop(0, '#1b2a3d'); g.addColorStop(1, '#07111B');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      const css = await embeddedFonts();
      const svg = fullSVG(state, `<defs><style>${css}</style></defs>`).replace(/class="[^"]*"/, `width="${W - 120}" height="${(W - 120) * 470 / 840}"`);
      const img = await loadImg(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
      ctx.drawImage(img, 60, 150);

      const brand = await loadImg('assets/img/logo-tight.webp');
      ctx.drawImage(brand, 60, 50, 263, 46);
      await document.fonts.load('italic 800 40px "Barlow Condensed"');
      ctx.fillStyle = '#24D653';
      ctx.font = 'italic 800 40px "Barlow Condensed", Impact, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(state.team ? state.team.toUpperCase() : 'CUSTOM TEAMWEAR', W - 60, 88);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 24px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${colourName(state.base)} · ${colourName(state.accent)} · ${PATTERNS.find(([k]) => k === state.pattern)[1]}  —  Designed on the VK Sports jersey designer`, W / 2, H - 40);

      const blob = await new Promise(r => c.toBlob(r, 'image/png'));
      const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `vk-jersey-${(state.team || state.name || 'design').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png` });
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      VK.toast('Design downloaded');
    } catch (err) {
      console.error('Design download failed:', err);
      VK.toast("Couldn't create the image — try again");
    } finally {
      btn.disabled = false; btn.classList.remove('opacity-60');
    }
  });

  syncInputs();
  render();
  // Webfonts may arrive after first paint; redraw so lettering uses them
  document.fonts?.ready.then(render);
})();
