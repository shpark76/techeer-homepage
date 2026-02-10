/* ============================================
   Techeer — Interactive Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Navigation scroll effect ---
  const nav = document.getElementById('nav');
  let lastScrollY = 0;

  const handleNavScroll = () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // --- Mobile navigation toggle ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // --- Scroll animations with Intersection Observer ---
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  animateElements.forEach(el => observer.observe(el));

  // --- Counter animation ---
  const counters = document.querySelectorAll('.stat-number[data-count]');

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 2000;
    const startTime = performance.now();

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const current = Math.round(easedProgress * target);

      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  // --- Floating particles in hero ---
  const particlesContainer = document.getElementById('particles');

  const particleColors = [
    '108, 92, 231',   // indigo
    '84, 160, 255',   // sky
    '0, 206, 201',    // teal
    '255, 107, 107',  // coral
    '240, 165, 0',    // amber
    '46, 213, 115',   // emerald
  ];

  const createParticle = () => {
    const particle = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const duration = Math.random() * 18 + 12;
    const delay = Math.random() * 12;
    const color = particleColors[Math.floor(Math.random() * particleColors.length)];

    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: rgba(${color}, ${Math.random() * 0.25 + 0.08});
      border-radius: 50%;
      left: ${x}%;
      bottom: -10px;
      animation: float-up ${duration}s ${delay}s linear infinite;
      pointer-events: none;
    `;

    particlesContainer.appendChild(particle);
  };

  // Create particles — fewer for subtlety
  for (let i = 0; i < 20; i++) {
    createParticle();
  }

  // Add float-up animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float-up {
      0% {
        transform: translateY(0) translateX(0);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translateY(-100vh) translateX(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 100}px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // --- Card hover glow effect ---
  const cards = document.querySelectorAll('.about-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navHeight = nav.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Video Popup Modal ---
  const videoModal = document.getElementById('videoModal');
  const videoModalClose = document.getElementById('videoModalClose');
  const videoModalWrapper = document.getElementById('videoModalWrapper');

  const openVideoModal = (videoId, startTime) => {
    const startParam = startTime ? `&start=${startTime}` : '';
    videoModalWrapper.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1${startParam}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeVideoModal = () => {
    videoModal.classList.remove('active');
    videoModalWrapper.innerHTML = '';
    document.body.style.overflow = '';
  };

  videoModalClose.addEventListener('click', closeVideoModal);
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) closeVideoModal();
  });

  // --- YouTube Click-to-Play ---
  const handleVideoClick = function(e) {
    e.preventDefault();
    e.stopPropagation();
    const el = this.closest('[data-video-id]');
    if (!el) return;
    const videoId = el.getAttribute('data-video-id');
    const startTime = el.getAttribute('data-video-start');
    if (videoId) openVideoModal(videoId, startTime);
  };

  // Media card YouTube videos open in popup
  document.querySelectorAll('.media-card--video').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', handleVideoClick);
  });

  // Lazy-loaded YouTube thumbnails
  document.querySelectorAll('.youtube-lazy').forEach(wrapper => {
    wrapper.addEventListener('click', handleVideoClick);
  });

  // Also attach to play buttons directly (safety fallback)
  document.querySelectorAll('.youtube-play-btn').forEach(btn => {
    btn.addEventListener('click', handleVideoClick);
  });

  document.querySelectorAll('.play-icon').forEach(icon => {
    icon.addEventListener('click', handleVideoClick);
  });

  // --- Contact Modal ---
  const contactModal = document.getElementById('contactModal');
  const modalClose = document.getElementById('modalClose');
  const contactForm = document.getElementById('contactForm');
  const modalSuccess = document.getElementById('modalSuccess');

  const openContactModal = (e) => {
    if (e) e.preventDefault();
    contactModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Reset form state
    contactForm.style.display = '';
    modalSuccess.classList.remove('active');
    // Apply i18n placeholders
    applyPlaceholders();
  };

  const closeContactModal = () => {
    contactModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Apply translated placeholders
  const applyPlaceholders = () => {
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const lang = typeof currentLang !== 'undefined' ? currentLang : 'ko';
      const t = typeof translations !== 'undefined' ? translations[lang]?.[key] : null;
      if (t) el.setAttribute('placeholder', t);
    });
  };

  modalClose.addEventListener('click', closeContactModal);
  contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) closeContactModal();
  });

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (videoModal.classList.contains('active')) closeVideoModal();
      if (contactModal.classList.contains('active')) closeContactModal();
      if (lightbox.classList.contains('active')) closeLightbox();
    }
  });

  // Intercept all contact/mailto buttons
  document.querySelectorAll('a[href="mailto:techeer@techeer.net"]').forEach(btn => {
    btn.addEventListener('click', openContactModal);
  });

  // Also intercept the nav contact link and hero CTA
  document.querySelectorAll('a[href="#contact"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      // Close mobile nav if open
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
      openContactModal(e);
    });
  });

  // Form submission
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone') || 'Not provided';
    const message = formData.get('message');

    // Build mailto link as fallback and also show success
    const subject = encodeURIComponent(`[Techeer Website] Contact from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:techeer@techeer.net?subject=${subject}&body=${body}`;

    // Show success state
    contactForm.style.display = 'none';
    modalSuccess.classList.add('active');

    // Reset form
    contactForm.reset();
  });

  // --- Image Lightbox ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let lightboxImages = [];
  let lightboxIndex = 0;

  const openLightbox = (images, index) => {
    lightboxImages = images;
    lightboxIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  const updateLightboxImage = () => {
    lightboxImg.src = lightboxImages[lightboxIndex];
    lightboxCounter.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
    lightboxPrev.style.display = lightboxImages.length > 1 ? '' : 'none';
    lightboxNext.style.display = lightboxImages.length > 1 ? '' : 'none';
  };

  const lightboxGoNext = () => {
    lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
    updateLightboxImage();
  };

  const lightboxGoPrev = () => {
    lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    updateLightboxImage();
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', lightboxGoNext);
  lightboxPrev.addEventListener('click', lightboxGoPrev);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox-content')) {
      closeLightbox();
    }
  });

  // Swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) lightboxGoNext();
      else lightboxGoPrev();
    }
  }, { passive: true });

  // Arrow key navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowRight') lightboxGoNext();
    if (e.key === 'ArrowLeft') lightboxGoPrev();
  });

  // Make gallery images clickable
  const setupGallery = (containerSelector) => {
    document.querySelectorAll(containerSelector).forEach(container => {
      const imgs = container.querySelectorAll('img');
      const srcs = Array.from(imgs).map(img => img.src);
      imgs.forEach((img, i) => {
        img.addEventListener('click', () => openLightbox(srcs, i));
      });
    });
  };

  setupGallery('.event-card-photos');
  setupGallery('.goods-grid');

  // --- Testimonial expand/collapse ---
  const getToggleText = (expanded) => {
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'ko';
    const t = typeof translations !== 'undefined' ? translations[lang] : null;
    if (expanded) return t?.['testimonials.less'] || '접기';
    return t?.['testimonials.more'] || '더 보기';
  };

  document.querySelectorAll('.testimonial-toggle').forEach(btn => {
    const text = btn.previousElementSibling;
    // Hide toggle if text doesn't overflow
    if (text && text.scrollHeight <= 200) {
      btn.style.display = 'none';
    }
    btn.addEventListener('click', () => {
      const isExpanded = text.classList.toggle('expanded');
      btn.textContent = getToggleText(isExpanded);
    });
  });

  // Make recruitment poster clickable in lightbox
  document.querySelectorAll('.recruitment-poster img').forEach(img => {
    img.addEventListener('click', () => openLightbox([img.src], 0));
  });

  // Make Instagram preview image clickable in lightbox
  document.querySelectorAll('.social-instagram-preview img').forEach(img => {
    img.addEventListener('click', () => openLightbox([img.src], 0));
  });

  // --- Active nav link highlighting ---
  const sections = document.querySelectorAll('.section, .hero');
  const navLinksArr = document.querySelectorAll('.nav-link:not(.nav-link--cta)');

  const updateActiveLink = () => {
    const scrollY = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinksArr.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveLink, { passive: true });
});
