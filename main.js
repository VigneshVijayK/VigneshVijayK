// Ambient particle network background
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: -1000, y: -1000 };
let mouseTrail = [];
const PARTICLE_COUNT = 80;
const CONNECT_DIST = 150;
const PARTICLE_SPEED = 0.3;
const PARTICLE_COLOR = '0, 200, 255';
const ACCENT_COLOR = '112, 0, 255';

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

document.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouseTrail.push({ x: mouse.x, y: mouse.y, life: 1 });
  if (mouseTrail.length > 12) mouseTrail.shift();
});
document.addEventListener('mouseleave', () => {
  mouse.x = -1000;
  mouse.y = -1000;
});
document.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  mouse.x = touch.clientX;
  mouse.y = touch.clientY;
  mouseTrail.push({ x: mouse.x, y: mouse.y, life: 1 });
  if (mouseTrail.length > 8) mouseTrail.shift();
}, { passive: true });
document.addEventListener('touchend', () => {
  mouse.x = -1000;
  mouse.y = -1000;
});

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * PARTICLE_SPEED;
    this.vy = (Math.random() - 0.5) * PARTICLE_SPEED;
    this.radius = Math.random() * 1.8 + 0.8;
    this.pulse = Math.random() * Math.PI * 2;
    this.pulseSpeed = Math.random() * 0.02 + 0.01;
    this.isAccent = Math.random() < 0.25;
    this.baseAlpha = this.isAccent ? 0.6 : 0.35;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.pulse += this.pulseSpeed;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    if (mouse.x > -500 && mouse.y > -500) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 250) {
        const force = (250 - dist) / 250 * 0.15;
        this.vx += dx / dist * force * 0.02;
        this.vy += dy / dist * force * 0.02;
        this.vx *= 0.98;
        this.vy *= 0.98;
      }
    }
  }
  draw() {
    const pulseRadius = this.radius + Math.sin(this.pulse) * 0.5;
    const color = this.isAccent ? ACCENT_COLOR : PARTICLE_COLOR;
    let alpha = this.baseAlpha;
    if (mouse.x > -500 && mouse.y > -500) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) alpha = Math.min(1, alpha + (1 - dist / 200) * 0.5);
    }
    ctx.beginPath();
    ctx.arc(this.x, this.y, pulseRadius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${color}, ${alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle());
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONNECT_DIST) {
        const alpha = (1 - dist / CONNECT_DIST) * 0.25;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(${PARTICLE_COLOR}, ${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
  if (mouse.x > -500 && mouse.y > -500) {
    for (const p of particles) {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONNECT_DIST * 1.4) {
        const alpha = (1 - dist / (CONNECT_DIST * 1.4)) * 0.6;
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(${ACCENT_COLOR}, ${alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    }
    const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 80);
    grad.addColorStop(0, 'rgba(0, 212, 255, 0.12)');
    grad.addColorStop(0.5, 'rgba(112, 0, 255, 0.06)');
    grad.addColorStop(1, 'rgba(0, 212, 255, 0)');
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 80, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }
  for (let t = 0; t < mouseTrail.length; t++) {
    const trail = mouseTrail[t];
    trail.life -= 0.08;
    if (trail.life > 0) {
      const grad = ctx.createRadialGradient(trail.x, trail.y, 0, trail.x, trail.y, 40);
      grad.addColorStop(0, `rgba(0, 212, 255, ${trail.life * 0.08})`);
      grad.addColorStop(1, 'rgba(0, 212, 255, 0)');
      ctx.beginPath();
      ctx.arc(trail.x, trail.y, 40, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }
  mouseTrail = mouseTrail.filter(t => t.life > 0);
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Reveal-on-scroll logic using Intersection Observer
const observerOptions = {
  threshold: 0.15
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal').forEach((el) => {
  observer.observe(el);
});

// Navbar background change on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});



// Mouse glow effect
const glow1 = document.querySelector('.bg-glow-1');
const glow2 = document.querySelector('.bg-glow-2');

document.addEventListener('mousemove', (e) => {
  const x = e.clientX;
  const y = e.clientY;
  glow1.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px)`;
  glow2.style.transform = `translate(${-x * 0.05}px, -${y * 0.05}px)`;
});
