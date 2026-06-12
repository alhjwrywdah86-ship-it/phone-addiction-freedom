// ============ LANGUAGE ============
const html = document.documentElement;
let lang = 'ar';

function setLang(l) {
  lang = l;
  html.lang = l;
  html.dir = l === 'ar' ? 'rtl' : 'ltr';
  document.getElementById('lang-label').textContent = l === 'ar' ? 'EN' : 'AR';
  document.querySelectorAll('[data-ar]').forEach(el => {
    const val = el.getAttribute('data-' + l);
    if (!val) return;
    if (el.tagName === 'IMG') { el.src = val; return; }
    if (el.children.length === 0) el.textContent = val;
    else el.innerHTML = val;
  });
  const hi = document.getElementById('hero-img');
  if (hi) hi.src = hi.getAttribute('data-' + l);
  buildCarousel(l);
}

document.getElementById('lang-toggle').addEventListener('click', () => setLang(lang === 'ar' ? 'en' : 'ar'));

// ============ HAMBURGER ============
const ham = document.getElementById('hamburger');
const nav = document.getElementById('main-nav');
ham.addEventListener('click', () => {
  nav.classList.toggle('open');
  ham.textContent = nav.classList.contains('open') ? '✕' : '☰';
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  ham.textContent = '☰';
}));

// ============ CAROUSEL ============
const slides = {
  ar: [
    { src: 'assets/products/book-ar.jpg',      label: 'الكتاب الإلكتروني' },
    { src: 'assets/products/challenge-ar.jpg', label: 'تحدي 30 يوماً' },
    { src: 'assets/products/planner-ar.jpg',   label: 'المخطط اليومي' },
    { src: 'assets/products/quotes-ar.jpg',    label: 'حزمة الاقتباسات' },
    { src: 'assets/products/focus-ar.jpg',     label: 'نظام التركيز' },
  ],
  en: [
    { src: 'assets/products/book-en.jpg',      label: 'E-Book' },
    { src: 'assets/products/challenge-en.jpg', label: '30-Day Challenge' },
    { src: 'assets/products/planner-en.jpg',   label: 'Daily Planner' },
    { src: 'assets/products/quotes-en.jpg',    label: 'Quotes Bundle' },
    { src: 'assets/products/focus-en.jpg',     label: 'Focus Reset System' },
  ]
};

let cur = 0, timer;
const mainImg  = document.getElementById('car-img');
const dotsEl   = document.getElementById('car-dots');
const thumbsEl = document.getElementById('car-thumbs');
const prevBtn  = document.getElementById('prev-btn');
const nextBtn  = document.getElementById('next-btn');

function buildCarousel(l) {
  if (!mainImg) return;
  const imgs = slides[l] || slides.ar;
  cur = 0;
  dotsEl.innerHTML = imgs.map((_, i) =>
    `<div class="car-dot${i === 0 ? ' active' : ''}" data-i="${i}"></div>`
  ).join('');
  thumbsEl.innerHTML = imgs.map((img, i) =>
    `<img src="${img.src}" alt="${img.label}" class="car-thumb${i === 0 ? ' active' : ''}" data-i="${i}" title="${img.label}">`
  ).join('');
  dotsEl.querySelectorAll('.car-dot').forEach(d =>
    d.addEventListener('click', () => goTo(+d.dataset.i))
  );
  thumbsEl.querySelectorAll('.car-thumb').forEach(t =>
    t.addEventListener('click', () => goTo(+t.dataset.i))
  );
  goTo(0);
  startAuto();
}

function goTo(i) {
  const imgs = slides[lang] || slides.ar;
  cur = (i + imgs.length) % imgs.length;
  if (mainImg) {
    mainImg.style.opacity = '0';
    setTimeout(() => {
      mainImg.src = imgs[cur].src;
      mainImg.alt = imgs[cur].label;
      mainImg.style.opacity = '1';
    }, 150);
  }
  document.querySelectorAll('.car-dot').forEach((d, j) =>
    d.classList.toggle('active', j === cur)
  );
  document.querySelectorAll('.car-thumb').forEach((t, j) =>
    t.classList.toggle('active', j === cur)
  );
}

function startAuto() {
  clearInterval(timer);
  timer = setInterval(() => goTo(cur + 1), 3500);
}

prevBtn?.addEventListener('click', () => { goTo(cur - 1); startAuto(); });
nextBtn?.addEventListener('click', () => { goTo(cur + 1); startAuto(); });

if (mainImg) {
  let tx = 0;
  mainImg.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  mainImg.addEventListener('touchend', e => {
    const d = tx - e.changedTouches[0].clientX;
    if (Math.abs(d) > 40) { goTo(cur + (d > 0 ? 1 : -1)); startAuto(); }
  });
}

// ============ FAQ ============
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-q').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ============ REVEAL ============
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

// ============ NAVBAR SHADOW ============
window.addEventListener('scroll', () => {
  document.getElementById('navbar').style.boxShadow =
    scrollY > 20 ? '0 4px 28px rgba(0,0,0,.4)' : 'none';
});

// ============ INIT ============
buildCarousel('ar');
