// Theme toggle
(function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  const systemMedia = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem('theme') || 'system';
  const themeOrder = ['system', 'dark', 'light'];

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateMetaTheme();
  }

  function updateMetaTheme() {
    const theme = document.documentElement.getAttribute('data-theme') || 'system';
    let isDark = theme === 'dark';
    if (theme === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', isDark ? '#05070a' : '#f8fafc');
    }
  }

  function cycleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'system';
    const nextIndex = (themeOrder.indexOf(current) + 1) % themeOrder.length;
    const next = themeOrder[nextIndex];
    applyTheme(next);
  }

  applyTheme(savedTheme);
  themeToggle.addEventListener('click', cycleTheme);

  systemMedia.addEventListener('change', () => {
    if (localStorage.getItem('theme') === 'system') {
      applyTheme('system');
    }
  });
})();

// Ambient particle network background
const canvas = document.getElementById('bg-canvas');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (canvas && !prefersReducedMotion.matches) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: -1000, y: -1000 };
  let mouseTrail = [];
  let animationId = null;
  let isVisible = true;
  const PARTICLE_COUNT = 80;
  const CONNECT_DIST = 150;
  const PARTICLE_SPEED = 0.3;
  const PARTICLE_COLOR = '0, 200, 255';

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * PARTICLE_SPEED;
      this.vy = (Math.random() - 0.5) * PARTICLE_SPEED;
      this.size = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      // Mouse interaction
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        this.vx -= (dx / dist) * force * 0.03;
        this.vy -= (dy / dist) * force * 0.03;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${PARTICLE_COLOR}, 0.7)`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECT_DIST) {
          const opacity = 1 - dist / CONNECT_DIST;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${PARTICLE_COLOR}, ${opacity * 0.25})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function drawMouseTrail() {
    if (mouseTrail.length < 2) return;
    ctx.beginPath();
    for (let i = 0; i < mouseTrail.length - 1; i++) {
      const point = mouseTrail[i];
      const next = mouseTrail[i + 1];
      ctx.strokeStyle = `rgba(${PARTICLE_COLOR}, ${point.opacity * 0.4})`;
      ctx.lineWidth = 2;
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(next.x, next.y);
    }
    ctx.stroke();
  }

  function animate() {
    if (!isVisible) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();

    mouseTrail.forEach((point, index) => { point.opacity -= 0.02; });
    mouseTrail = mouseTrail.filter(point => point.opacity > 0);
    drawMouseTrail();

    animationId = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouseTrail.push({ x: e.clientX, y: e.clientY, opacity: 1 });
    if (mouseTrail.length > 20) mouseTrail.shift();
  });

  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
    if (isVisible) {
      animate();
    } else if (animationId) {
      cancelAnimationFrame(animationId);
    }
  });

  resizeCanvas();
  animate();
}

// Navbar scroll effect
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

function updateNavbar() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  if (backToTop) {
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

// Back to top
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
  });
}

// Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function toggleMenu(forceClose = false) {
  const isOpen = mobileMenu.classList.contains('open');
  const shouldOpen = forceClose ? false : !isOpen;

  hamburger.classList.toggle('active', shouldOpen);
  mobileMenu.classList.toggle('open', shouldOpen);
  hamburger.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
  document.body.style.overflow = shouldOpen ? 'hidden' : '';

  if (shouldOpen) {
    const firstLink = mobileMenu.querySelector('.mobile-link');
    if (firstLink) firstLink.focus();
  }
}

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => toggleMenu());

  mobileLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      toggleMenu(true);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
        }, 300);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      toggleMenu(true);
      hamburger.focus();
    }
  });
}

// Smooth scroll for all anchor links
const smoothLinks = document.querySelectorAll('a[href^="#"]');
smoothLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
    }
  });
});

// Reveal animations on scroll
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// Active nav link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.3, rootMargin: '-80px 0px -60% 0px' });

sections.forEach(section => sectionObserver.observe(section));

// Hero typing effect
const typeText = document.getElementById('type-text');
if (typeText) {
  const phrases = [
    'Cisco • FortiGate • Hikvision',
    'Routing, Switching & Security',
    'IoT, Automation & AI',
    'Linux • Android • Full-Stack Dev'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeDelay = 100;

  function type() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
      typeText.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typeDelay = 40;
    } else {
      typeText.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typeDelay = 80;
    }

    if (!isDeleting && charIndex === current.length) {
      isDeleting = true;
      typeDelay = 2000;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeDelay = 500;
    }

    setTimeout(type, typeDelay);
  }

  if (!prefersReducedMotion.matches) {
    setTimeout(type, 800);
  } else {
    typeText.textContent = phrases[0];
  }
}

// Mouse glow effect
const bgGlow1 = document.querySelector('.bg-glow-1');
const bgGlow2 = document.querySelector('.bg-glow-2');

if (bgGlow1 && bgGlow2 && !prefersReducedMotion.matches) {
  let glowRaf = null;
  let glowMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  document.addEventListener('mousemove', (e) => {
    glowMouse.x = e.clientX;
    glowMouse.y = e.clientY;
  });

  function updateGlow() {
    const x = (glowMouse.x / window.innerWidth - 0.5) * 40;
    const y = (glowMouse.y / window.innerHeight - 0.5) * 40;
    bgGlow1.style.transform = `translate(${x}px, ${y}px)`;
    bgGlow2.style.transform = `translate(${-x}px, ${-y}px)`;
    glowRaf = requestAnimationFrame(updateGlow);
  }

  updateGlow();
}

// Dynamic year in footer
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// License page: fetch GitHub repo details
const repoDetails = document.getElementById('repoDetails');
if (repoDetails) {
  const repoOwner = 'VigneshVijayK';
  const repoName = 'Disable-HyperV-EVE-NG';
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}`;

  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      const stars = data.stargazers_count ?? 0;
      const forks = data.forks_count ?? 0;
      const updated = new Date(data.updated_at).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
      const language = data.language || 'PowerShell';
      const description = data.description || 'Automated script to disable Hyper-V, VBS, Device Guard, and Memory Integrity.';
      const licenseName = data.license?.spdx_id || 'All Rights Reserved';

      repoDetails.innerHTML = `
        <div class="repo-card glass">
          <div class="repo-header">
            <i class="fab fa-github" aria-hidden="true"></i>
            <div class="repo-title">
              <h3>${data.full_name || repoOwner + '/' + repoName}</h3>
              <span class="repo-updated">Updated ${updated}</span>
            </div>
          </div>
          <p class="repo-description">${description}</p>
          <div class="repo-stats">
            <span><i class="fas fa-star" aria-hidden="true"></i> ${stars}</span>
            <span><i class="fas fa-code-branch" aria-hidden="true"></i> ${forks}</span>
            <span><i class="fas fa-code" aria-hidden="true"></i> ${language}</span>
            <span><i class="fas fa-balance-scale" aria-hidden="true"></i> ${licenseName}</span>
          </div>
          <a href="${data.html_url || 'https://github.com/' + repoOwner + '/' + repoName}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary repo-link">
            <i class="fab fa-github" aria-hidden="true"></i> View Source on GitHub
          </a>
        </div>
      `;
    })
    .catch(err => {
      repoDetails.innerHTML = `
        <div class="repo-card glass">
          <div class="repo-header">
            <i class="fab fa-github" aria-hidden="true"></i>
            <div class="repo-title">
              <h3>VigneshVijayK/Disable-HyperV-EVE-NG</h3>
            </div>
          </div>
          <p class="repo-description">Automated PowerShell script to disable Hyper-V, VBS, Device Guard, and Memory Integrity for bare-metal hypervisor compatibility.</p>
          <a href="https://github.com/VigneshVijayK/Disable-HyperV-EVE-NG" target="_blank" rel="noopener noreferrer" class="btn btn-secondary repo-link">
            <i class="fab fa-github" aria-hidden="true"></i> View on GitHub
          </a>
        </div>
      `;
    });
}

// License page form iframe
const licenseForm = document.getElementById('licenseForm');
if (licenseForm) {
  licenseForm.innerHTML = '<iframe src="https://form.svhrt.com/6a4405913fd706abb302e43a" title="License purchase form"></iframe>';
}

// License page dynamic year
const licenseYear = document.getElementById('licenseYear');
if (licenseYear) {
  licenseYear.textContent = new Date().getFullYear();
}

// Payment page dynamic year
const paymentYear = document.getElementById('paymentYear');
if (paymentYear) {
  paymentYear.textContent = new Date().getFullYear();
}
