// ================================
//   NAVIGATION — menu button on smaller screens
// ================================
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  if (!header || !toggle) return;

  function setOpen(open) {
    header.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  header.querySelectorAll('.site-nav a').forEach(link => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && header.classList.contains('nav-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener('click', e => {
    if (!header.contains(e.target)) setOpen(false);
  });

  window.matchMedia('(min-width: 1200px)').addEventListener('change', e => {
    if (e.matches) setOpen(false);
  });
});

const prefersLessMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ================================
//   HEADER SHADOW & BACK TO TOP
// ================================
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');

  const toTop = document.createElement('button');
  toTop.type = 'button';
  toTop.className = 'to-top';
  toTop.setAttribute('aria-label', 'Back to top');
  toTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersLessMotion ? 'auto' : 'smooth' });
  });
  document.body.appendChild(toTop);

  // thin line under the header showing how far down the page you are
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  if (header) header.appendChild(progress);

  function onScroll() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.setProperty('--progress', scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0);
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
    toTop.classList.toggle('is-shown', window.scrollY > window.innerHeight * 1.2);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
});

// ================================
//   PAGE TRANSITION — a brief branded screen between pages of this site.
//   On the way out, and when a page is refreshed, the church sketch draws itself: light pencil
//   lines first, then the ink. logo/sketch-order.png holds the order the sketch's pixels are drawn
//   in (darker = sooner).
// ================================
(() => {
  const root = document.documentElement;
  const samePage = path => path.replace(/index\.html$/, '');
  const DRAW_MS = 800; // how long the sketch takes to draw
  let sketch = null; // set once the drawing is ready
  let preparing = null;

  // arriving from another page: lift the curtain once this page has painted
  if (root.classList.contains('is-arriving')) {
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('is-arriving')));
  }

  // get the drawing ready (until then the plain logo is shown); done once per page
  function prepareSketch() {
    preparing = preparing || buildSketch();
    return preparing;
  }

  function buildSketch() {
    const load = src => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
    return Promise.all([load('logo/nativityChurchLogo.png'), load('logo/sketch-order.png')]).then(([logoImg, orderImg]) => {
      const w = logoImg.naturalWidth;
      const h = logoImg.naturalHeight;
      const read = img => {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const x = c.getContext('2d');
        x.drawImage(img, 0, 0, w, h);
        return x.getImageData(0, 0, w, h).data;
      };
      const logo = read(logoImg);
      const order = read(orderImg);

      // group the sketch's pixels by drawing step (0 to 254; 255 is empty paper)
      const starts = new Uint32Array(257);
      for (let i = 0; i < w * h; i++) starts[order[i * 4] + 1]++;
      for (let s = 0; s < 256; s++) starts[s + 1] += starts[s];
      const next = starts.slice(0, 255);
      const px = new Uint32Array(starts[255]);
      for (let i = 0; i < w * h; i++) {
        const s = order[i * 4];
        if (s < 255) px[next[s]++] = i;
      }

      const curtain = document.createElement('div');
      curtain.className = 'sketch-curtain';
      curtain.setAttribute('aria-hidden', 'true');
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      curtain.appendChild(canvas);
      document.body.appendChild(curtain);
      const ctx = canvas.getContext('2d');
      sketch = { curtain, ctx, out: ctx.createImageData(w, h), logo, px, starts };
    });
  }

  // pencil sweeps over the first 70% of the time, the ink follows over the last 70%;
  // onDone runs once the sketch is finished (without it, the finished sketch breathes gently)
  function drawSketch(onDone) {
    const { curtain, ctx, out, logo, px, starts } = sketch;
    const d = out.data;
    d.fill(0);
    curtain.classList.remove('is-drawn');
    let pencil = 0;
    let ink = 0;
    const reveal = (from, to, strength) => {
      for (let k = starts[from]; k < starts[to]; k++) {
        const i = px[k] * 4;
        d[i] = logo[i];
        d[i + 1] = logo[i + 1];
        d[i + 2] = logo[i + 2];
        d[i + 3] = logo[i + 3] * strength;
      }
    };
    const t0 = performance.now();
    const frame = now => {
      const t = Math.min((now - t0) / DRAW_MS, 1);
      const p = Math.round(Math.min(t / .7, 1) * 255);
      const k = Math.round(Math.min(Math.max((t - .3) / .7, 0), 1) * 255);
      if (p > pencil) { reveal(pencil, p, .45); pencil = p; }
      if (k > ink) { reveal(ink, k, 1); ink = k; }
      ctx.putImageData(out, 0, 0);
      if (t < 1) requestAnimationFrame(frame);
      else if (onDone) onDone();
      else curtain.classList.add('is-drawn'); // a slow network: the finished sketch breathes gently
    };
    requestAnimationFrame(frame);
  }

  // refreshing the page: the curtain is already up (set in the page's head); draw the sketch,
  // then lift it. If the drawing can't be made, lift it straight away.
  if (root.classList.contains('is-reloading')) {
    const lift = () => root.classList.remove('is-reloading');
    prepareSketch().then(() => drawSketch(() => setTimeout(lift, 150)), lift);
  }

  // start fetching the next page while the sketch draws
  const prefetch = href => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  };

  if (!prefersLessMotion) {
    window.addEventListener('load', () => (window.requestIdleCallback || setTimeout)(() => prepareSketch().catch(() => { })));
  }

  document.addEventListener('click', e => {
    if (prefersLessMotion || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const link = e.target.closest('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return; // other websites, email and phone links
    if (samePage(url.pathname) === samePage(location.pathname) && url.hash) return; // a jump within this page

    e.preventDefault();
    if (root.classList.contains('is-leaving')) return; // already on the way
    try { sessionStorage.setItem('nativity-transition', '1'); } catch (err) { }
    prefetch(url.href);
    if (sketch) {
      root.classList.add('is-leaving', 'is-sketching');
      drawSketch();
      setTimeout(() => { location.href = url.href; }, DRAW_MS + 80);
    } else {
      root.classList.add('is-leaving');
      setTimeout(() => { location.href = url.href; }, 320);
    }
  });

  // pages restored by the browser's back button shouldn't stay covered
  window.addEventListener('pageshow', e => {
    if (e.persisted) root.classList.remove('is-leaving', 'is-arriving', 'is-sketching', 'is-reloading');
  });
})();

// ================================
//   HOME HERO — the doorway arch opens into a full background photo as you scroll
// ================================
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero--portal');
  if (!hero || prefersLessMotion) return; // without motion the still arch view stays

  const stage = hero.querySelector('.hero-stage');
  const grid = hero.querySelector('.hero-grid');
  const frame = hero.querySelector('.hero-portal-frame');
  const text = hero.querySelector('.hero-text');
  const bg = hero.querySelector('.hero-bg');
  const photo = bg.querySelector('img');
  const header = document.querySelector('.site-header');

  // the doorway behind the statue in parish-front.jpg (1080 × 1920): outer edge of the stone moulding,
  // from its point down to the foot of the photo; the arch springs 252 px below the point (top of the columns)
  const IMG = { w: 1080, h: 1920 };
  const DOOR = { x: 383, y: 1295, w: 333, h: 625 };
  const SPRING = 252 / 625;
  const STATUE = { x: 538, y: 1560 }; // kept in view once the photo fills the screen

  // one side of an equilateral (Gothic) arch: u across the width (0 → .5), v up the arch (0 → 1)
  const ARC = Array.from({ length: 18 }, (_, i) => {
    const angle = Math.PI - (i / 17) * (Math.PI / 3);
    return { u: 1 + Math.cos(angle), v: Math.sin(angle) / Math.sin(Math.PI / 3) };
  });

  const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => t * t * (3 - 2 * t);

  let start = null;
  let textBox = null;
  let ticking = false;

  function measure() {
    // the header's real height, for the sticky stage only (never fed back into the header itself)
    hero.style.setProperty('--header-live', `${header ? header.offsetHeight : 84}px`);
    // where the arch frame sits inside the stage (offsets ignore the opening animation's movement)
    start = {
      x: grid.offsetLeft + frame.offsetLeft,
      y: grid.offsetTop + frame.offsetTop,
      w: frame.offsetWidth,
      h: frame.offsetHeight,
    };
    textBox = {
      x: grid.offsetLeft + text.offsetLeft,
      y: grid.offsetTop + text.offsetTop,
      w: text.offsetWidth,
      h: text.offsetHeight,
    };
  }

  function archPolygon(x, y, w, h, archH) {
    const pts = [[x, y + h], [x, y + archH]];
    ARC.forEach(({ u, v }) => pts.push([x + u * w, y + archH * (1 - v)]));
    [...ARC].reverse().forEach(({ u, v }) => pts.push([x + (1 - u) * w, y + archH * (1 - v)]));
    pts.push([x + w, y + archH], [x + w, y + h]);
    return `polygon(${pts.map(([px, py]) => `${px.toFixed(1)}px ${py.toFixed(1)}px`).join(', ')})`;
  }

  function update() {
    ticking = false;
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    const distance = hero.offsetHeight - H;
    const headerH = header ? header.offsetHeight : 0;
    const t = ease(clamp((headerH - hero.getBoundingClientRect().top) / distance, 0, 1));

    // frame: from the doorway arch to the whole stage, the point flattening as it grows
    const x = lerp(start.x, 0, t);
    const y = lerp(start.y, 0, t);
    const w = lerp(start.w, W, t);
    const h = lerp(start.h, H, t);
    bg.style.clipPath = archPolygon(x, y, w, h, start.h * SPRING * (1 - t));

    // photo: the doorway fills the arch at first, then the whole church fills the screen
    const s0 = start.w / DOOR.w;
    const s1 = Math.max(W / IMG.w, H / IMG.h);
    const s = s0 * Math.pow(s1 / s0, t);
    const tx0 = start.x - DOOR.x * s0;
    const ty0 = start.y - DOOR.y * s0;
    const tx1 = clamp(W / 2 - STATUE.x * s1, W - IMG.w * s1, 0);
    const ty1 = clamp(H * .55 - STATUE.y * s1, H - IMG.h * s1, 0);
    // move the statue smoothly between its start and end positions while the scale changes
    const fx = lerp(tx0 + STATUE.x * s0, tx1 + STATUE.x * s1, t);
    const fy = lerp(ty0 + STATUE.y * s0, ty1 + STATUE.y * s1, t);
    photo.style.transform = `translate3d(${(fx - STATUE.x * s).toFixed(1)}px, ${(fy - STATUE.y * s).toFixed(1)}px, 0) scale(${s.toFixed(4)})`;

    // once the photo covers the whole heading and buttons: dim it and turn the text light
    // (switching earlier would leave part of the light text on the pale page)
    const behindText = x <= textBox.x + 2 && x + w >= textBox.x + textBox.w - 2 &&
      y <= textBox.y + 2 && y + h >= textBox.y + textBox.h - 2;
    bg.style.setProperty('--shade', behindText ? Math.max(t, .6).toFixed(3) : '0');
    hero.classList.toggle('is-open', behindText);
    // while the photo is only partly under the text, the text gets a soft pale backing so it reads on both
    const touching = x < textBox.x + textBox.w && x + w > textBox.x && y < textBox.y + textBox.h && y + h > textBox.y;
    hero.classList.toggle('is-crossing', touching && !behindText);
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  hero.classList.add('portal-ready');
  measure();
  update();

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', () => { measure(); update(); });

  // re-measure whenever the layout settles or shifts (fonts arriving, header height, screen size)
  if ('ResizeObserver' in window) {
    const watcher = new ResizeObserver(() => { measure(); update(); });
    [stage, grid, frame, text, header].forEach(el => { if (el) watcher.observe(el); });
  }
  if (document.fonts) document.fonts.ready.then(() => { measure(); update(); });
});

// ================================
//   SACRAMENTS — the two quote bands (St Peter of Alcantara, Acts 2:42)
//   appear one letter at a time
// ================================
document.addEventListener('DOMContentLoaded', () => {
  const quotes = document.querySelectorAll('.quote-band .quote-text');
  if (!quotes.length || prefersLessMotion || !('IntersectionObserver' in window)) return;

  const STEP = 34; // ms between letters
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  // whole letters, so Tamil vowel signs and Chinese characters are never split apart
  const letters = text => ('Segmenter' in Intl
    ? [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text)].map(s => s.segment)
    : Array.from(text));

  function type(quote) {
    const cite = quote.parentElement.querySelector('.quote-cite');
    const text = quote.textContent.replace(/\s+/g, ' ').trim();
    const parts = letters(text);
    // screen readers get the sentence once; the animated letters are for the eye only
    quote.innerHTML = `<span class="sr-only">${esc(text)}</span><span class="type-chars" aria-hidden="true">${
      parts.map((c, i) => `<span style="--d:${i}">${esc(c)}</span>`).join('')}</span>`;
    if (cite) {
      cite.style.setProperty('--after', `${parts.length * STEP}ms`);
      cite.classList.remove('is-typed');
      void cite.offsetWidth; // restart the fade if the language changes
      cite.classList.add('is-typed');
    }
    quote.dataset.typed = 'true';
  }

  // each quote starts once it's on screen; until then it stays as plain, readable text
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      type(entry.target);
    });
  }, { threshold: 0.5 });
  quotes.forEach(q => observer.observe(q));

  // switching language puts back the plain sentence; type the new one out again
  document.addEventListener('nativity:language', () => {
    quotes.forEach(q => { if (q.dataset.typed) type(q); });
  });
});

// ================================
//   TODAY — highlight today's Mass and office hours
// ================================
document.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Asia/Singapore' });
  const isWeekday = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(today);

  // home page: Mass timings
  document.querySelectorAll('.mass-row').forEach(row => {
    const day = row.querySelector('h4').textContent.trim();
    if (day === today || (isWeekday && day === 'Monday - Friday')) row.classList.add('is-today');
  });

  // contact us: office hours
  document.querySelectorAll('.officeHoursTable tr').forEach(row => {
    if (row.cells[0].textContent.trim() === today) row.classList.add('is-today');
  });
});

// ================================
//   PARALLAX — full-bleed photos drift slightly as you scroll (larger screens only)
// ================================
document.addEventListener('DOMContentLoaded', () => {
  const photos = document.querySelectorAll('[data-parallax]');
  if (!photos.length || prefersLessMotion) return;

  const largeScreen = window.matchMedia('(min-width: 861px)');
  let ticking = false;

  function update() {
    ticking = false;
    photos.forEach(img => {
      if (!largeScreen.matches) {
        img.style.transform = '';
        return;
      }
      const box = img.parentElement.getBoundingClientRect();
      if (box.bottom < 0 || box.top > window.innerHeight) return;

      // -1 when the photo enters at the bottom, 1 when it leaves at the top
      const progress = (window.innerHeight / 2 - (box.top + box.height / 2)) / (window.innerHeight / 2 + box.height / 2);
      img.style.transform = `translate3d(0, ${(progress * 28).toFixed(1)}px, 0) scale(1.1)`;
    });
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
});

// ================================
//   CONTACT US — inverted perspective carousel
//   The photos line the inside of a ring and you stand inside it: the photo straight ahead is furthest
//   away, the ones at the sides curve towards you. It turns slowly, pauses under the mouse, and can be
//   dragged or swiped round. People who prefer less motion get a still ring they can drag.
// ================================
document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.querySelector('.gallery');
  const scene = gallery && gallery.querySelector('.scrollable-Horizontal');
  const ring = scene && scene.querySelector('.timeline_H');
  if (!ring) return;

  const all = [...ring.querySelectorAll('img')];
  const speed = 4; // degrees per second, increase to turn faster

  let panels = all;
  let step = 0;
  let radius = 0;
  let panelW = 0;
  let angle = 0; // how far the ring has turned, in degrees
  let hovering = false;
  let inView = false;
  let drag = null;
  let last = 0;
  let frame = 0;

  function size() {
    const W = scene.clientWidth;
    // small screens show one of each photo (the copies are only there to fill the wide ring)
    const compact = W < 700;
    gallery.classList.toggle('is-compact', compact);
    panels = compact ? all.filter(img => !img.hasAttribute('aria-hidden')) : all;
    step = 360 / panels.length;

    radius = Math.min(W * .48, 720);
    panelW = 2 * radius * Math.tan(Math.PI / panels.length) - (compact ? 12 : 14);
    const panelH = panelW * 1.3;
    // seen from a third of the way out from the middle: you stand inside the ring
    gallery.style.setProperty('--ring-p', `${radius.toFixed(1)}px`);
    gallery.style.setProperty('--ring-z', `${(radius * 2 / 3).toFixed(1)}px`);
    gallery.style.setProperty('--panel-w', `${panelW.toFixed(1)}px`);
    gallery.style.setProperty('--panel-h', `${panelH.toFixed(1)}px`);
    gallery.style.setProperty('--ring-h', `${(panelH * 1.3).toFixed(1)}px`);
  }

  function place() {
    panels.forEach((img, i) => {
      // this photo's angle from straight ahead, between -180 and 180
      const a = ((i * step + angle) % 360 + 540) % 360 - 180;
      img.style.transform = `rotateY(${a.toFixed(2)}deg) translateZ(${(-radius).toFixed(1)}px)`;
      // photos swinging round past the sides (towards and behind you) fade away
      const fade = Math.min(Math.max((88 - Math.abs(a)) / 18, 0), 1);
      img.style.opacity = fade.toFixed(3);
      img.style.visibility = fade > 0 ? 'visible' : 'hidden';
    });
  }

  function tick(now) {
    frame = 0;
    const dt = last ? Math.min(now - last, 64) / 1000 : 0;
    last = now;
    if (!hovering && !drag) angle += speed * dt;
    place();
    if (inView) frame = requestAnimationFrame(tick);
  }

  function start() {
    if (frame || prefersLessMotion) return;
    last = 0;
    frame = requestAnimationFrame(tick);
  }

  gallery.classList.add('is-ring');
  size();
  place();

  // only turn while the gallery is on screen
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) start();
  }).observe(scene);

  scene.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hovering = true; });
  scene.addEventListener('pointerleave', () => { hovering = false; });

  // drag or swipe sideways to turn the ring (up-and-down swipes still scroll the page)
  scene.addEventListener('pointerdown', e => {
    drag = { x: e.clientX, angle };
    scene.setPointerCapture(e.pointerId);
    scene.classList.add('is-dragging');
  });
  scene.addEventListener('pointermove', e => {
    if (!drag) return;
    angle = drag.angle - (e.clientX - drag.x) * (step / panelW);
    place();
  });
  const release = () => {
    drag = null;
    scene.classList.remove('is-dragging');
  };
  scene.addEventListener('pointerup', release);
  scene.addEventListener('pointercancel', release);

  window.addEventListener('resize', () => {
    size();
    all.forEach(img => { img.style.transform = ''; });
    place();
  });
});

//////////////////
//    MINISTRY
//////////////////

// ================================
//   MINISTRY DATA
// ================================

const CONTACT_SECRETARIAT = 'mailto:cnbvm.secretariat@catholic.org.sg';
const CONTACT_PASTORAL = 'mailto:pastoraloffice.cnbvm@catholic.org.sg';

const LITURGY_MINISTRIES = [
  {
    title: 'Altar Servers',
    image: 'image/Altar Servers.jpg',
    description: 'Altar servers assist the priest during Mass and other liturgical celebrations, serving at the altar with reverence and devotion.',
    contact: CONTACT_SECRETARIAT
  },
  {
    title: 'Teochew Choir',
    image: 'image/Teochew Choir.jpeg',
    description: 'The Teochew Choir leads the congregation in worship through sacred music, enriching the liturgical experience at Mass.',
    contact: CONTACT_SECRETARIAT
  },
  {
    title: 'St. Thomas Aquinas Choir',
    image: 'image/St. Thomas Aquinas Choir.jpeg',
    description: 'The St. Thomas Aquinas Choir leads the congregation in worship through sacred music, enriching the liturgical experience at Mass.',
    contact: CONTACT_SECRETARIAT
  },
  {
    title: "St. Hilary's Choir",
    image: 'image/St. Hilary Choir.jpeg',
    description: "St. Hilary's Choir leads the congregation in worship through sacred music, enriching the liturgical experience at Mass.",
    contact: CONTACT_SECRETARIAT
  },
  {
    title: 'St. Gabriel Choir',
    image: 'image/St. Gabriel Choir.jpeg',
    description: 'The St. Gabriel Choir leads the congregation in worship through sacred music, enriching the liturgical experience at Mass.',
    contact: CONTACT_SECRETARIAT
  },
  {
    title: 'Holy Spirit Choir',
    image: 'image/Holy Spirit Choir.jpeg',
    description: 'The Holy Spirit Choir leads the congregation in worship through sacred music, enriching the liturgical experience at Mass.',
    contact: CONTACT_SECRETARIAT
  },
  {
    title: 'Extraordinary Ministers of Holy Communion',
    image: 'image/church_3.png',
    description: 'EMHCs assist in the distribution of Holy Communion during Mass and may also bring the Eucharist to the homebound and hospitalised.',
    contact: CONTACT_SECRETARIAT
  },
  {
    title: 'Wardens',
    image: 'image/Wardens_page-0001.jpg',
    description: 'Wardens maintain order and assist parishioners during Mass, ensuring a safe and welcoming environment for all.',
    contact: CONTACT_SECRETARIAT
  },
  {
    title: 'Lectors',
    image: 'image/English Lectors.jpeg',
    description: 'Lectors proclaim the Word of God at Mass, reading from Scripture with clarity and reverence to the assembled community.',
    contact: CONTACT_SECRETARIAT
  },
  {
    title: 'Decor Team',
    image: 'image/church_3.png',
    description: 'The Decor Team beautifies the church for liturgical seasons and special occasions, creating an environment that reflects the sacred.',
    contact: CONTACT_SECRETARIAT
  },
  {
    title: 'AV Team',
    image: 'image/church_2.jpg',
    description: 'The AV Team manages audio and visual systems during Masses and parish events, ensuring clear communication for all.',
    contact: CONTACT_SECRETARIAT
  },
];

const PRAYER_MINISTRIES = [
  {
    title: 'Intercessory Prayer Group',
    image: 'image/church_1.jpg',
    description: 'The Intercessory Prayer Group gathers to pray on behalf of the parish community, lifting up intentions and needs before God.',
    contact: CONTACT_SECRETARIAT
  },
  {
    title: 'Legion of Mary (English)',
    image: 'image/Legion of Mary Queen Assumed into Heaven praesidium.jpeg',
    description: 'The Legion of Mary is an apostolic organisation of Catholic laity who serve the Church through prayer and active works of mercy.',
    contact: CONTACT_SECRETARIAT
  },
  {
    title: 'Legion of Mary (Mandarin)',
    image: 'image/Legion of Mary Queen Of Apostles praesidium.jpeg',
    description: '圣母军是天主教平信徒的宗徒组织，通过祈祷和慈善工作服务教会。',
    contact: CONTACT_SECRETARIAT
  },
  {
    title: 'Christian Meditation',
    image: 'image/Christian Meditation.jpeg',
    description: 'Christian Meditation offers a contemplative practice of silent prayer, deepening one\'s relationship with God through stillness.',
    contact: CONTACT_SECRETARIAT
  },
];

const PASTORAL_MINISTRIES = [
  {
    title: 'Funeral Ministry',
    image: 'image/church_2.jpg',
    description: 'The Funeral Ministry accompanies families through the loss of a loved one, providing pastoral support and assistance with funeral rites.',
    contact: CONTACT_PASTORAL
  },
  {// completed no updated contact
    title: 'St Elizabeth Ann Seton Bereavement Ministry',
    image: 'image/St Elizabeth Ann Seton Bereavement Ministry.jpg',
    description: 'Walking alongside grieving families with compassionate hearts and faithful support, bringing comfort, prayer and the hope of Christ.',
    contact: CONTACT_PASTORAL
  },
  {
    title: 'Ministry for the Sick',
    image: 'image/annoiting-of-the-sick.jpg',
    description: 'This ministry brings the presence of Christ to those who are ill, visiting the sick and homebound and offering prayer and comfort.',
    contact: CONTACT_PASTORAL
  },
  {
    title: 'Society of St Vincent de Paul (SSVP)',
    image: 'image/church_3.png',
    description: 'The SSVP serves those in need through direct, person-to-person charitable works, living out the Gospel call to love our neighbour.',
    contact: CONTACT_PASTORAL
  },
  {//updated photos only no description
    title: 'Care for Creation',
    image: 'image/Care for Creation.jpeg',
    description: 'Care for Creation promotes environmental stewardship within the parish, responding to the Church\'s call to care for our common home.',
    contact: CONTACT_PASTORAL
  },
];

const FAITH_MINISTRIES = [
  { title: 'Catechesis', image: 'image/cat_class.jpeg', description: 'Catechesis provides faith formation for children and youth, guiding them through the teachings of the Church on their journey of discipleship.', contact: CONTACT_SECRETARIAT },
  { title: 'RCIA (English)', 
    image: 'image/RCIA English Picture 1.jpg', 
    description: 'RCIA is a journey together in faith for adults who wish to discover more about God and the Catholic faith, and for those considering becoming Catholic. Through Scripture, prayer, sharing and fellowship, we journey together to know Jesus Christ more deeply and experience the love of God in our lives.', 
    contact: CONTACT_SECRETARIAT },
  { title: 'RCIA (Mandarin)', image: 'image/RCIA (Mandarin).jpeg', description: '慕道班欢迎有意了解或加入天主教信仰的人士，在团体中共同踏上信仰旅程。', contact: CONTACT_SECRETARIAT },
  { title: 'Adult Faith Formation', image: 'image/Adults Faith Formation.jpeg', description: 'Adult Faith Formation offers ongoing opportunities for Catholics to deepen their understanding of the faith through talks, courses, and retreats.', contact: CONTACT_SECRETARIAT },
  { title: 'Chinese Bible Group', image: 'image/Chinese Bible Group.jpeg', description: '中文圣经小组定期聚会，共同研读圣经，在团体中加深对天主圣言的认识与热爱。', contact: CONTACT_SECRETARIAT },
];

const COMMUNITY_MINISTRIES = [
  { title: 'Nativity Family Life Ministry', 
    image: 'image/Nativity Family Life.jpg', 
    description: 'A ministry that strengthens marriages and family life through Christian formation and family empowering events.', 
    contact: CONTACT_SECRETARIAT 
  },
  { title: 'Couples for Christ', 
    image: 'image/Couples For Christ Nativity Aug2026 Landscape.jpg', 
    description: 'Couples for Christ is a movement that helps married couples grow in their faith and build Christ-centred families and communities.',
     contact: CONTACT_SECRETARIAT 
    },
  { title: 'Neocatechumenal Way', image: 'image/Neocatechumenal Way.jpeg', description: 'The Neocatechumenal Way is a post-baptismal catechetical journey that helps Catholics rediscover and live their baptismal faith more deeply.', contact: CONTACT_SECRETARIAT },
  { title: 'Neighbourhood Christian Community (NCC)', image: 'image/church_1.jpg', description: 'NCCs are small faith communities that gather in homes and neighbourhoods, building relationships and supporting one another in daily Christian living.', contact: CONTACT_SECRETARIAT },
  { title: 'Chinese & Teochew Group', image: 'image/church_3.png', description: '华语及潮州堂区团体定期举办活动，凝聚华语堂区成员，在信仰与文化中共融。', contact: CONTACT_SECRETARIAT },
];

const MINISTRY_GROUPS = {
  liturgy: LITURGY_MINISTRIES,
  prayer: PRAYER_MINISTRIES,
  pastoral: PASTORAL_MINISTRIES,
  faith: FAITH_MINISTRIES,
  community: COMMUNITY_MINISTRIES,
};

function buildCard(item) {
  const card = document.createElement('article');
  card.className = 'proj-card';

  card.innerHTML = `
    <div class="card-media"><img class="card-thumb" src="${item.image}" alt="${item.title}" loading="lazy"></div>
    <div class="card-body">
      <h3 class="card-title">${item.title}</h3>
      <p class="card-desc">${item.description}</p>
      <a class="card-link" href="${item.contact}">Get Involved →</a>
    </div>
  `;

  return card;
}

// ================================
//   INIT — fill every ministry list on the page
// ================================
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-ministries]').forEach(list => {
    const items = MINISTRY_GROUPS[list.dataset.ministries] || [];
    items.forEach(item => list.appendChild(buildCard(item)));
  });

  // links like ministry.html#faith-formation: the cards above the target were only just added,
  // so jump to the section again now that the page has its full height
  const target = location.hash && document.querySelector('[data-ministries]') && document.getElementById(location.hash.slice(1));
  if (target) target.scrollIntoView({ behavior: 'instant' });
});

// ================================
//   LANGUAGE — start last, so the ministry cards above are translated too (see i18n.js)
// ================================
document.addEventListener('DOMContentLoaded', () => {
  if (window.NativityI18n) NativityI18n.start();
  else document.documentElement.classList.remove('i18n-pending');
});
