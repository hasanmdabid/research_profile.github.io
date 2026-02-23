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

pubTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const filter = tab.getAttribute('data-filter');

    pubTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    pubCards.forEach(card => {
      if (filter === 'all' || card.getAttribute('data-type') === filter) {
        card.classList.remove('pub-hidden');
      } else {
        card.classList.add('pub-hidden');
      }
    });
  });
});

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
