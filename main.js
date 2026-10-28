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
//   PAGE TRANSITION — a brief branded screen between pages of this site
// ================================
(() => {
  const root = document.documentElement;
  const samePage = path => path.replace(/index\.html$/, '');

  // arriving from another page: lift the curtain once this page has painted
  if (root.classList.contains('is-arriving')) {
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('is-arriving')));
  }

  document.addEventListener('click', e => {
    if (prefersLessMotion || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const link = e.target.closest('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return; // other websites, email and phone links
    if (samePage(url.pathname) === samePage(location.pathname) && url.hash) return; // a jump within this page

    e.preventDefault();
    try { sessionStorage.setItem('nativity-transition', '1'); } catch (err) { }
    root.classList.add('is-leaving');
    setTimeout(() => { location.href = url.href; }, 320);
  });

  // pages restored by the browser's back button shouldn't stay covered
  window.addEventListener('pageshow', e => {
    if (e.persisted) root.classList.remove('is-leaving', 'is-arriving');
  });
})();

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
//   CONTACT US — horizontal gallery
// ================================
window.addEventListener('load', () => {
  const track = document.querySelector('.timeline_H');
  if (!track) return;

  // people who prefer less motion can scroll the gallery themselves
  if (prefersLessMotion) return;

  const viewport = track.parentElement;
  const imgs = track.querySelectorAll('img');
  const half = imgs.length / 2;

  let pos = 0;
  let paused = false;
  const speed = 0.5; // px per frame, increase to go faster

  viewport.addEventListener('mouseenter', () => { paused = true; });
  viewport.addEventListener('mouseleave', () => { paused = false; });

  function scroll() {
    // width of the first set of images (including spacing)
    const loopWidth = imgs[half].offsetLeft - imgs[0].offsetLeft;

    if (!paused) pos += speed;

    // reset once we've scrolled exactly one full set
    if (pos >= loopWidth) pos -= loopWidth;

    track.style.transform = `translateX(-${pos}px)`;
    requestAnimationFrame(scroll);
  }

  requestAnimationFrame(scroll);
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
    image: 'image/church_2.jpg',
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
    image: 'image/church_2.jpg',
    description: 'The Legion of Mary is an apostolic organisation of Catholic laity who serve the Church through prayer and active works of mercy.',
    contact: CONTACT_SECRETARIAT
  },
  {
    title: 'Legion of Mary (Mandarin)',
    image: 'image/church_3.png',
    description: '圣母军是天主教平信徒的宗徒组织，通过祈祷和慈善工作服务教会。',
    contact: CONTACT_SECRETARIAT
  },
  {
    title: 'Christian Meditation',
    image: 'image/Christian Mediation with Our Lady of Silence.jpg',
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
  { title: 'Neocatechumenal Way', image: 'image/church_3.png', description: 'The Neocatechumenal Way is a post-baptismal catechetical journey that helps Catholics rediscover and live their baptismal faith more deeply.', contact: CONTACT_SECRETARIAT },
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
    <img class="card-thumb" src="${item.image}" alt="${item.title}" loading="lazy">
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
});

// ================================
//   GENTLE REVEAL — content further down fades up as it scrolls into view
//   (kept last so it also picks up the ministry cards built above)
// ================================
const REVEAL_SELECTOR = [
  '.section-title', '.mass-group', '.mass-row', '.info-card', '.verse', '.split-media', '.holy-list li',
  '.directoryItem', '.priest', '.quote-band blockquote', '.quote-media', '.feature > .container > *',
  '.ministry-card', '.proj-card', '.give-card', '.ministryContact .container > *', '.about-text',
].join(', ');

document.addEventListener('DOMContentLoaded', () => {
  if (prefersLessMotion || !('IntersectionObserver' in window)) return;

  let heardBack = false;
  const observer = new IntersectionObserver(entries => {
    heardBack = true;
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('is-visible');
      observer.unobserve(el);

      // hand the element back to its normal styles (hover effects etc.) once it has settled
      setTimeout(() => {
        el.classList.remove('reveal', 'is-visible');
        el.style.removeProperty('--reveal-delay');
      }, 1200);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

  document.querySelectorAll(REVEAL_SELECTOR).forEach(el => {
    // anything already on screen stays as it is; only content further down animates
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    // neighbours in the same row arrive one after another
    const siblings = [...el.parentElement.children].filter(child => child.matches(REVEAL_SELECTOR));
    el.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(el), 4) * 80}ms`);

    el.classList.add('reveal');
    observer.observe(el);
  });

  // safety net: if the observer never reports back, show everything rather than leave it hidden
  setTimeout(() => {
    if (heardBack) return;
    observer.disconnect();
    document.querySelectorAll('.reveal').forEach(el => el.classList.remove('reveal'));
  }, 3000);
});
