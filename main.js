
// for the horizontal gallery
window.addEventListener('load', () => {
  if (!window.location.pathname.includes('clergy.html')) return;
  const track = document.querySelector('.timeline_H');
  const imgs = track.querySelectorAll('img');
  const half = imgs.length / 2;  // 8

  let pos = 0;
  const speed = 1; // px per frame, increase to go faster

  function scroll() {
    pos += speed;

    // Measure the exact width of the first set of images
    let firstHalfWidth = 0;
    for (let i = 0; i < half; i++) {
      firstHalfWidth += imgs[i].getBoundingClientRect().width;
    }

    // Reset once we've scrolled exactly one full set
    if (pos >= firstHalfWidth) {
      pos = 0;
    }

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



const VISIBLE_COLLAPSED = 4;
const GAP = 1;

function buildCard(item) {
  const card = document.createElement("div");
  card.className = "proj-card";

  card.innerHTML = `
    <img class="card-thumb" src="${item.image}" alt="${item.title}">
    <div class="card-body">
      <p class="card-title">${item.title}</p>

      <div class="card-detail">
        <p class="card-desc">${item.description}</p>
        <a class="card-link" href="${item.contact}">
          Get Involved →
        </a>
      </div>
    </div>
  `;

  card.addEventListener("click", e => {
    if (e.target.classList.contains("card-link")) return;

    if (card.classList.contains("open")) {
      card.classList.remove("open");
      return;
    }

    closeAllIn(card.closest(".carousel-track"));
    card.classList.add("open");
  });

  return card;
}

function closeAllIn(track) {
  track.querySelectorAll(".proj-card.open")
    .forEach(card => card.classList.remove("open"));
}


function initCarousel(items, trackId, viewportId, prevBtnId, nextBtnId) {

  const DURATION = 420;

  const track = document.getElementById(trackId);
  const viewport = document.getElementById(viewportId);

  if (!track || !viewport) return;

  // Find buttons
  let prevBtn;
  let nextBtn;

  if (prevBtnId && nextBtnId) {
    // Used by ministry.html (2 carousels)
    prevBtn = document.getElementById(prevBtnId);
    nextBtn = document.getElementById(nextBtnId);
  }
  else {
    // Used by Pastoral/Faith/Community pages
    const wrapper = viewport.closest(".carousel-wrapper");
    prevBtn = wrapper.querySelector("#prevBtn");
    nextBtn = wrapper.querySelector("#nextBtn");
  }

  const N = items.length;
  const CLONE_COUNT = Math.min(VISIBLE_COLLAPSED + 1, N);

  let pos = CLONE_COUNT;
  let isAnimating = false;
  let realCards = [];

  function cardWidth() {
    const gapPx = GAP * window.innerWidth / 100;
    return (realCards[0]?.offsetWidth || 220) + gapPx;
  }

  function jumpTo(index) {
    track.style.transition = "none";
    track.style.transform = `translateX(-${index * cardWidth()}px)`;
    pos = index;
  }

  function slideTo(index) {

    if (isAnimating) return;

    isAnimating = true;

    closeAllIn(track);

    track.style.transition =
      `transform ${DURATION}ms cubic-bezier(0.4,0,0.2,1)`;

    track.style.transform =
      `translateX(-${index * cardWidth()}px)`;

    pos = index;

    setTimeout(() => {

      if (pos < CLONE_COUNT)
        jumpTo(pos + N);

      else if (pos >= CLONE_COUNT + N)
        jumpTo(pos - N);

      isAnimating = false;

    }, DURATION + 10);
  }

  // Front clones
  for (let i = N - CLONE_COUNT; i < N; i++) {

    const clone = buildCard(items[i]);
    clone.classList.add("clone");
    track.appendChild(clone);

  }

  // Real cards
  realCards = items.map(item => {

    const card = buildCard(item);

    track.appendChild(card);

    return card;

  });

  // Back clones
  for (let i = 0; i < CLONE_COUNT; i++) {

    const clone = buildCard(items[i]);
    clone.classList.add("clone");

    track.appendChild(clone);

  }

  jumpTo(CLONE_COUNT);

  prevBtn.addEventListener("click", () => slideTo(pos - 1));
  nextBtn.addEventListener("click", () => slideTo(pos + 1));

  let touchX = 0;

  viewport.addEventListener("touchstart", e => {
    touchX = e.touches[0].clientX;
  }, { passive: true });

  viewport.addEventListener("touchend", e => {

    const dx = touchX - e.changedTouches[0].clientX;

    if (Math.abs(dx) > 50)
      slideTo(dx > 0 ? pos + 1 : pos - 1);

  }, { passive: true });

  window.addEventListener("resize", () => jumpTo(pos));
}

// ================================
//   INIT — detect which page we're on
// ================================

document.addEventListener("DOMContentLoaded", () => {

    // ministry.html (2 carousels)

    if (document.getElementById("carouselTrack1") &&
        document.getElementById("carouselTrack2")) {

        initCarousel(
            LITURGY_MINISTRIES,
            "carouselTrack1",
            "carouselViewport1",
            "prevBtn1",
            "nextBtn1"
        );

        initCarousel(
            PRAYER_MINISTRIES,
            "carouselTrack2",
            "carouselViewport2",
            "prevBtn",
            "nextBtn"
        );

        return;
    }

    // All other ministry pages (1 carousel)

    if (!document.getElementById("carouselTrack")) return;

    const path = window.location.pathname;

    if (path.includes("ministry-pastoral")) {

        initCarousel(
            PASTORAL_MINISTRIES,
            "carouselTrack",
            "carouselViewport"
        );

    }

    else if (path.includes("ministry-faith")) {

        initCarousel(
            FAITH_MINISTRIES,
            "carouselTrack",
            "carouselViewport"
        );

    }

    else if (path.includes("ministry-community")) {

        initCarousel(
            COMMUNITY_MINISTRIES,
            "carouselTrack",
            "carouselViewport"
        );

    }

});