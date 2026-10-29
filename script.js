const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
$('#year').textContent = new Date().getFullYear();

const shots = (p) => `assets/screenshots/${p.slug}`;

// Home: project thumbnails + typefaces
if ($('#web-grid')) {
  const tile = (t) => `
    <a class="tile${t.logo ? ' logo-tile' : ''}" href="${t.href}" ${t.ext ? 'target="_blank" rel="noopener"' : ''}>
      <div class="shot"${t.bg ? ` style="background:${t.bg}"` : ''}><img src="${t.img}" alt="${esc(t.alt)}" loading="lazy"></div>
      <h3>${esc(t.title)}</h3>
      <span class="label">${esc(t.label)}</span>
    </a>`;
  const fill = (id, list) => { $(id).innerHTML = list.map(tile).join(''); };

  const filmHref = (f) => (FILM_VIDEOS[f.slug] ? { href: `film.html?f=${f.slug}` } : { href: `${NOVA_BASE}${f.id}`, ext: true });
  fill('#video-grid', FILMS.filter((f) => f.slug !== 'lunar-studio').map((f) => ({ ...filmHref(f), img: `assets/film/${f.slug}.webp`, alt: `${f.title} thumbnail`, title: f.title, label: f.kind })));
  fill('#web-grid', PROJECTS.filter((p) => !p.group).map((p) => ({ href: `project.html?p=${p.slug}`, img: `${shots(p)}/thumb.png`, alt: `${p.title} homepage`, title: p.title, label: p.kind })));

  fill('#marketing-grid', PROJECTS.filter((p) => p.group === 'marketing').map((p) => ({ href: `project.html?p=${p.slug}`, img: `${shots(p)}/thumb.png`, alt: `${p.title} case study`, title: p.title, label: 'Case study' })));

  fill('#app-grid', PROJECTS.filter((p) => p.group === 'app').map((p) => ({ href: `project.html?p=${p.slug}`, img: `${shots(p)}/thumb.png`, alt: `${p.title} app`, title: p.title, label: 'iOS app' })));

  const lunar = FILMS.find((f) => f.slug === 'lunar-studio');
  fill('#design-grid', [
    ...PROJECTS.filter((p) => p.logo).map((p) => ({ href: `project.html?p=${p.slug}`, img: p.logo.src, bg: p.logo.bg, logo: true, alt: `${p.title} logo`, title: p.title, label: 'Logo' })),
    { href: `${NOVA_BASE}${lunar.id}`, ext: true, img: 'assets/film/lunar-studio.webp', alt: 'Lunar Studio logo', title: lunar.title, label: 'Logo design' },
  ]);

  $('#type-grid').innerHTML = TYPEFACES.map((t) => `
    <a href="https://moonbear.shop/products/${t.handle}" target="_blank" rel="noopener">
      <div class="shot"><img src="${TYPEFACE_CDN}${t.img}" alt="${esc(t.name)} specimen" loading="lazy"></div>
      <h3>${esc(t.name)} ↗</h3>
      ${t.note ? `<p>${esc(t.note)}</p>` : ''}
    </a>`).join('');
}

// Project page
if ($('#project')) {
  const i = Math.max(0, PROJECTS.findIndex((x) => x.slug === new URLSearchParams(location.search).get('p')));
  const p = PROJECTS[i], prev = PROJECTS[(i + PROJECTS.length - 1) % PROJECTS.length], next = PROJECTS[(i + 1) % PROJECTS.length];
  document.title = `${p.title} — Derek Yancey Jr.`;
  const gallery = Array.from({ length: p.sections }, (_, k) => {
    const n = String(k + 1).padStart(2, '0');
    return `<figure><img src="${shots(p)}/section-${n}.${p.ext || 'png'}" alt="${esc(p.title)} screen ${n}" loading="lazy"><figcaption>${n} / ${String(p.sections).padStart(2, '0')}</figcaption></figure>`;
  }).join('');
  $('#project').innerHTML = `
    <div class="p-head">
      <a class="back" href="index.html#${p.group || 'web'}">← All ${p.group || 'web'}</a>
      <h1>${esc(p.title)}</h1>
      <span class="label">${esc(p.kind)}</span>
    </div>
    <div class="hero-shot"><img src="${shots(p)}/thumb.png" alt="${esc(p.title)} homepage"></div>
    <dl class="facts">
      ${p.meta ? p.meta.map(([k, v, h]) => `<div><dt>${esc(k)}</dt><dd>${h ? `<a href="${h}" target="_blank" rel="noopener">${esc(v)}</a>` : esc(v)}</dd></div>`).join('') : `<div><dt>Live site</dt><dd>${p.url ? `<a href="${p.url}" target="_blank" rel="noopener">${esc(p.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''))} ↗</a>` : 'No longer live'}</dd></div>
      <div><dt>${p.fullPage === false ? 'Screens' : 'Full page'}</dt><dd>${p.fullPage === false ? `${p.sections} screenshots` : `<a href="${shots(p)}/full-page.png" target="_blank">Open full-page PNG ↗</a>`}</dd></div>`}
    </dl>
    <section class="writeup">
      <div>${p.writeup.map((t) => `<p>${esc(t)}</p>`).join('')}</div>
      <div><h2>What I did</h2><ul class="list">${p.did.map((d) => `<li>${esc(d)}</li>`).join('')}</ul></div>
    </section>
    <section class="gallery${p.phones ? ' phones' : ''}">${gallery}</section>
    ${p.logo ? `<section class="logo-sec"><div class="logo-box" style="background:${p.logo.bg}"><img src="${p.logo.src}" alt="${esc(p.title)} logo"></div><div><h2>The logo</h2><p>${esc(p.logo.blurb)}</p><a class="back" href="${p.logo.src}" download>Download logo ↓</a></div></section>` : ''}
    ${p.brand ? `<section class="brand"><h2>Brand imagery</h2><div class="brand-grid">${p.brand.map((b) => `<figure${b.wide ? ' class="wide"' : ''}><img src="${b.src}" alt="${esc(b.alt)}" loading="lazy"></figure>`).join('')}</div></section>` : ''}
    ${p.marks ? `<section class="marks"><h2>Product marks</h2><div class="marks-grid">${p.marks.map((m) => `<figure><img src="${m.src}" alt="${esc(m.label)}"><figcaption>${esc(m.label)}</figcaption></figure>`).join('')}</div><p class="note">Created by the team I led.</p></section>` : ''}
    <div class="next"><a href="project.html?p=${prev.slug}">← ${esc(prev.title)}</a><a href="project.html?p=${next.slug}">${esc(next.title)} →</a></div>`;
}

// Film page: HLS players (stream loads only when Play is clicked)
if ($('#film-page')) {
  const i = Math.max(0, FILMS.findIndex((x) => x.slug === new URLSearchParams(location.search).get('f')));
  const f = FILMS[i], prev = FILMS[(i + FILMS.length - 1) % FILMS.length], next = FILMS[(i + 1) % FILMS.length];
  const vids = FILM_VIDEOS[f.slug] || [];
  document.title = `${f.title} — Derek Yancey Jr.`;
  const poster = `assets/film/${f.slug}.webp`;
  const player = (v, k) => `<div class="player${k ? ' alt' : ''}" data-src="${HLS_BASE}${v}.m3u8"><img src="${poster}" alt="" ${k ? 'hidden' : ''}><button type="button" aria-label="Play video">▶ Play${vids.length > 1 ? ` ${String(k + 1).padStart(2, '0')}` : ''}</button></div>`;
  $('#film-page').innerHTML = `
    <div class="p-head">
      <a class="back" href="index.html#video">← All video</a>
      <h1>${esc(f.title)}</h1>
      <span class="label">${esc(f.kind)}</span>
    </div>
    ${vids.length ? `<div class="players">${vids.map(player).join('')}</div>` : ''}
    <dl class="facts">
      <div><dt>Type</dt><dd>${esc(f.kind)}</dd></div>
      <div><dt>Also on</dt><dd><a href="${NOVA_BASE}${f.id}" target="_blank" rel="noopener">NOVA ↗</a></dd></div>
    </dl>
    <div class="next"><a href="film.html?f=${prev.slug}">← ${esc(prev.title)}</a><a href="film.html?f=${next.slug}">${esc(next.title)} →</a></div>`;
  document.querySelectorAll('.player').forEach((box) => {
    box.querySelector('button').addEventListener('click', () => {
      const v = document.createElement('video');
      v.controls = true; v.playsInline = true; v.autoplay = true;
      box.replaceChildren(v); box.classList.add('live');
      const src = box.dataset.src;
      if (window.Hls && Hls.isSupported()) { const h = new Hls(); h.loadSource(src); h.attachMedia(v); }
      else v.src = src;
    });
  });
}
