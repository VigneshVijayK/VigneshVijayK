// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scroll for navigation links with mobile optimization
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight - 10;
            
            // Use smooth scroll with better mobile support
            if ('scrollBehavior' in document.documentElement.style) {
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            } else {
                // Fallback for older browsers
                window.scrollTo(0, targetPosition);
            }
            
            // Close mobile menu if open
            if (window.innerWidth <= 968) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
    });
});

// Enhanced Navbar scroll effect with glassmorphism
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.85)';
        navbar.style.boxShadow = '0 1px 20px rgba(0, 0, 0, 0.15)';
        navbar.style.backdropFilter = 'blur(30px) saturate(180%)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.7)';
        navbar.style.boxShadow = '0 1px 20px rgba(0, 0, 0, 0.1)';
        navbar.style.backdropFilter = 'blur(20px) saturate(180%)';
    }
    
    lastScroll = currentScroll;
}, { passive: true });

// Active navigation link highlighting
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 200;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Enhanced Intersection Observer for smooth fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                entry.target.classList.add('animated');
            }, index * 50); // Stagger animation
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

// Observe all sections and cards with enhanced animations
const animatedElements = document.querySelectorAll('.section, .skill-category, .project-card, .education-card, .cert-item, .timeline-content, .section-title');
animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px) scale(0.98)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
});

// Hero section entrance animation
window.addEventListener('load', () => {
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    const heroButtons = document.querySelector('.hero-buttons');
    const heroContact = document.querySelector('.hero-contact');
    
    if (heroContent) {
        heroContent.style.animation = 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both';
    }
    if (heroImage) {
        heroImage.style.animation = 'scaleIn 1s cubic-bezier(0.4, 0, 0.2, 1) 0s both';
    }
    if (heroButtons) {
        heroButtons.style.animation = 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.6s both';
    }
    if (heroContact) {
        heroContact.style.animation = 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s both';
    }
});

// Enhanced stagger effect to skill tags with smooth animations
const skillCategories = document.querySelectorAll('.skill-category');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const tags = entry.target.querySelectorAll('.skill-tag');
            tags.forEach((tag, tagIndex) => {
                setTimeout(() => {
                    tag.style.opacity = '1';
                    tag.style.transform = 'translateY(0) scale(1)';
                }, tagIndex * 30);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

skillCategories.forEach(category => {
    const tags = category.querySelectorAll('.skill-tag');
    tags.forEach(tag => {
        tag.style.opacity = '0';
        tag.style.transform = 'translateY(10px) scale(0.95)';
        tag.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    skillObserver.observe(category);
});

// Typing effect for hero name (optional enhancement)
const heroName = document.querySelector('.hero-name');
if (heroName) {
    const text = heroName.textContent;
    heroName.textContent = '';
    let index = 0;
    
    function typeWriter() {
        if (index < text.length) {
            heroName.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, 50);
        }
    }
    
    // Uncomment to enable typing effect
    // setTimeout(typeWriter, 500);
}

// Smooth parallax effect to hero section
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero && scrolled < window.innerHeight) {
                hero.style.transform = `translateY(${scrolled * 0.3}px)`;
                hero.style.opacity = `${1 - scrolled / window.innerHeight * 0.5}`;
            }
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// Add smooth hover effects to interactive elements
document.querySelectorAll('.btn, .contact-item, .contact-card, .skill-tag').forEach(el => {
    el.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// Enhanced smooth scroll with offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add ripple effect to buttons on click
document.querySelectorAll('.btn, .contact-item, .contact-card').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple effect dynamically
const style = document.createElement('style');
style.textContent = `
    .btn, .contact-item, .contact-card {
        position: relative;
        overflow: hidden;
    }
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Scroll indicator click handler
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = aboutSection.offsetTop - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
}

// Smooth cursor effects on interactive elements
document.querySelectorAll('a, button, .btn, .contact-item, .contact-card').forEach(el => {
    el.style.cursor = 'pointer';
});

// ===== Infrastructure Gallery Filtering =====
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.classList.remove('hidden');
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.classList.add('hidden');
                }, 300);
            }
        });
    });
});

// ===== Image Modal/Lightbox Functionality =====
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const modalClose = document.querySelector('.modal-close');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');

let currentImageIndex = 0;
let allImages = [];

// Get all gallery images
function initializeGallery() {
    allImages = [];
    
    // Infrastructure gallery images
    document.querySelectorAll('.gallery-image').forEach((img, index) => {
        if (img.src && !img.src.includes('placeholder')) {
            allImages.push({
                src: img.src,
                alt: img.alt || 'Gallery Image',
                caption: img.closest('.gallery-item')?.querySelector('.gallery-overlay h4')?.textContent || ''
            });
        }
    });
    
    // Certificate images
    document.querySelectorAll('.certificate-image').forEach((img, index) => {
        if (img.src && !img.src.includes('placeholder')) {
            allImages.push({
                src: img.src,
                alt: img.alt || 'Certificate',
                caption: img.closest('.certificate-card')?.querySelector('.certificate-info h4')?.textContent || ''
            });
        }
    });
}

// Open modal with image
function openModal(index) {
    if (allImages.length === 0) initializeGallery();
    if (allImages.length === 0) return;
    
    currentImageIndex = index;
    modalImage.src = allImages[currentImageIndex].src;
    modalCaption.textContent = allImages[currentImageIndex].caption || allImages[currentImageIndex].alt;
    
    // Check if it's a certificate image (A4 format)
    const isCertificate = allImages[currentImageIndex].src.includes('certificates');
    if (isCertificate) {
        modalImage.classList.add('certificate-format');
    } else {
        modalImage.classList.remove('certificate-format');
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Update navigation buttons
    updateModalNav();
}

// Close modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Update modal navigation buttons
function updateModalNav() {
    if (allImages.length <= 1) {
        modalPrev.style.display = 'none';
        modalNext.style.display = 'none';
    } else {
        modalPrev.style.display = 'flex';
        modalNext.style.display = 'flex';
    }
}

// Navigate to previous image
function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
    modalImage.src = allImages[currentImageIndex].src;
    modalCaption.textContent = allImages[currentImageIndex].caption || allImages[currentImageIndex].alt;
    
    // Check if it's a certificate image (A4 format)
    const isCertificate = allImages[currentImageIndex].src.includes('certificates');
    if (isCertificate) {
        modalImage.classList.add('certificate-format');
    } else {
        modalImage.classList.remove('certificate-format');
    }
    
    updateModalNav();
}

// Navigate to next image
function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % allImages.length;
    modalImage.src = allImages[currentImageIndex].src;
    modalCaption.textContent = allImages[currentImageIndex].caption || allImages[currentImageIndex].alt;
    
    // Check if it's a certificate image (A4 format)
    const isCertificate = allImages[currentImageIndex].src.includes('certificates');
    if (isCertificate) {
        modalImage.classList.add('certificate-format');
    } else {
        modalImage.classList.remove('certificate-format');
    }
    
    updateModalNav();
}

// Add click event listeners to gallery images
document.addEventListener('DOMContentLoaded', () => {
    initializeGallery();
    
    // Infrastructure gallery images
    document.querySelectorAll('.gallery-image-wrapper').forEach((wrapper, index) => {
        wrapper.addEventListener('click', () => {
            const img = wrapper.querySelector('.gallery-image');
            const imageIndex = Array.from(document.querySelectorAll('.gallery-image')).indexOf(img);
            if (imageIndex !== -1) {
                openModal(imageIndex);
            }
        });
    });
    
    // Certificate images
    document.querySelectorAll('.certificate-image-wrapper, .view-cert-btn').forEach((element, index) => {
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            const img = element.closest('.certificate-image-wrapper')?.querySelector('.certificate-image');
            if (img) {
                const galleryImages = Array.from(document.querySelectorAll('.gallery-image'));
                const certImages = Array.from(document.querySelectorAll('.certificate-image'));
                const imageIndex = galleryImages.length + certImages.indexOf(img);
                openModal(imageIndex);
            }
        });
    });
});

// Modal close events
if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!modal || !modal.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
        closeModal();
    } else if (e.key === 'ArrowLeft') {
        showPrevImage();
    } else if (e.key === 'ArrowRight') {
        showNextImage();
    }
});

// Touch swipe gestures for modal on mobile
let touchStartX = 0;
let touchEndX = 0;

if (modal) {
    modal.addEventListener('touchstart', (e) => {
        if (!modal.classList.contains('active')) return;
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    modal.addEventListener('touchend', (e) => {
        if (!modal.classList.contains('active')) return;
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    const swipeThreshold = 50; // Minimum swipe distance in pixels
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next image
            showNextImage();
        } else {
            // Swipe right - previous image
            showPrevImage();
        }
    }
}

// Prevent zoom on double tap for iOS
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });

// Modal navigation buttons
if (modalPrev) {
    modalPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrevImage();
    });
}

if (modalNext) {
    modalNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextImage();
    });
}

// Handle image errors - show placeholder
document.querySelectorAll('.gallery-image, .certificate-image').forEach(img => {
    img.addEventListener('error', function() {
        this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="16"%3EImage Not Found%3C/text%3E%3C/svg%3E';
        this.alt = 'Image placeholder - Please add your image';
    });
});

// Console message
console.log('%c👋 Welcome to Vignesh Vijay K\'s Portfolio!', 'color: #2563eb; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with passion, Apple-style glassmorphism, and buttery-smooth animations.', 'color: #10b981; font-size: 14px;');

