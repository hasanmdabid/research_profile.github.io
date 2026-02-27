/* ===================================
   Theme Toggle (Dark / Light Mode)
   =================================== */
const themeToggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function setTheme(dark) {
  if (dark) {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  setTheme(savedTheme === 'dark');
} else {
  setTheme(prefersDark.matches);
}

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.hasAttribute('data-theme');
  setTheme(!isDark);
});

/* ===================================
   Mobile Navigation
   =================================== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ===================================
   Active Nav Highlighting on Scroll
   =================================== */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links li a[href^="#"]');

function updateActiveNav() {
  const scrollY = window.scrollY + 80;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navItems.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (active) active.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

/* ===================================
   Scroll-to-Top Button
   =================================== */
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===================================
   Publication Tabs Filter
   =================================== */
const pubTabs = document.querySelectorAll('.pub-tab');
const pubCards = document.querySelectorAll('.pub-card');

function applyPubFilter(filter) {
  pubCards.forEach(card => {
    if (filter === 'all' || card.getAttribute('data-type') === filter) {
      card.classList.remove('pub-hidden');
    } else {
      card.classList.add('pub-hidden');
    }
  });
}

pubTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const filter = tab.getAttribute('data-filter');
    pubTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    applyPubFilter(filter);
  });
});

// Apply default filter on page load (first tab = Journal Articles)
const defaultTab = document.querySelector('.pub-tab.active');
if (defaultTab) applyPubFilter(defaultTab.getAttribute('data-filter'));

/* ===================================
   Fade-In Animation on Scroll
   =================================== */
const fadeElements = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

fadeElements.forEach(el => observer.observe(el));

/* ===================================
   Staggered animation for pub cards
   =================================== */
document.querySelectorAll('.pub-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 40}ms`;
});

/* ===================================
   Scroll Progress Bar
   =================================== */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}, { passive: true });

/* ===================================
   Cycling Typewriter on Subtitle
   =================================== */
const subtitleEl = document.querySelector('.hero-content h2');
if (subtitleEl) {
  const phrases = [
    'Data Scientist & PhD Candidate',
    'AI & Deep Learning Researcher',
    'Medical Wearable Computing Expert',
    'Generative AI Enthusiast',
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function typeLoop() {
    const current = phrases[phraseIdx];
    subtitleEl.textContent = deleting
      ? current.substring(0, charIdx--)
      : current.substring(0, ++charIdx);

    if (!deleting && charIdx === current.length) {
      deleting = true;
      setTimeout(typeLoop, 2200);
    } else if (deleting && charIdx < 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      charIdx = 0;
      setTimeout(typeLoop, 400);
    } else {
      setTimeout(typeLoop, deleting ? 28 : 55);
    }
  }
  setTimeout(typeLoop, 900);
}

/* ===================================
   Animated Stat Counters
   =================================== */
function animateCounter(el) {
  const raw = el.textContent.trim();
  const hasSuffix = raw.endsWith('+');
  const target = parseInt(raw);
  if (isNaN(target)) return;
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(eased * target) + (hasSuffix ? '+' : '');
    if (t < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));

/* ===================================
   Timeline Item Staggered Slide-in
   =================================== */
const tlObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('tl-visible');
      tlObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.timeline-item').forEach((item, i) => {
  item.style.transitionDelay = `${i * 80}ms`;
  tlObserver.observe(item);
});
