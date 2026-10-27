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

// ================================
//   CONTACT US — highlight today's office hours
// ================================
document.addEventListener('DOMContentLoaded', () => {
  const rows = document.querySelectorAll('.officeHoursTable tr');
  if (!rows.length) return;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Asia/Singapore' });
  rows.forEach(row => {
    if (row.cells[0].textContent.trim() === today) row.classList.add('is-today');
  });
});

// ================================
//   CONTACT US — horizontal gallery
// ================================
window.addEventListener('load', () => {
  const track = document.querySelector('.timeline_H');
  if (!track) return;

  // people who prefer less motion can scroll the gallery themselves
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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
