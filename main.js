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

// Modal / Lightbox Logic
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalCaption = document.getElementById('modal-caption');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');

function openModal(src, caption) {
  modalImg.src = src;
  modalCaption.textContent = caption;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent scroll
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

// Certification Viewers
document.querySelectorAll('.cert-card').forEach(card => {
  const btn = card.querySelector('.view-cert-btn');
  const certSrc = card.getAttribute('data-cert');
  const certTitle = card.querySelector('h4').textContent;
  
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(certSrc, certTitle);
    });
  }
});

// Gallery Viewers
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const src = item.getAttribute('data-src');
    const title = item.querySelector('h4').textContent;
    openModal(src, title);
  });
});

// ESC key to close modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
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
