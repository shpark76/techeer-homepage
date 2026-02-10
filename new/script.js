/* ============================================
   Techeer — New Site Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Navigation scroll ---
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // --- Mobile nav toggle ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // --- Scroll animations ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

  // --- Counter animation ---
  const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 2000;
    const start = performance.now();

    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(easeOutQuart(progress) * target);
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number[data-count]').forEach(el => counterObserver.observe(el));

  // --- Hero particles ---
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    const colors = ['79,140,255', '139,92,246', '45,212,191', '248,113,113', '251,191,36', '52,211,153'];

    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      const size = Math.random() * 12 + 8;
      const color = colors[Math.floor(Math.random() * colors.length)];
      p.style.cssText = `
        position:absolute; width:${size}px; height:${size}px;
        background:rgba(${color},${Math.random() * 0.2 + 0.06});
        border-radius:50%; left:${Math.random() * 100}%; bottom:-10px;
        animation:float-up ${Math.random() * 16 + 12}s ${Math.random() * 10}s linear infinite;
        pointer-events:none;
      `;
      particlesContainer.appendChild(p);
    }

    const style = document.createElement('style');
    style.textContent = `
      @keyframes float-up {
        0% { transform: translateY(0) translateX(0); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) translateX(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 80}px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // --- Smooth scroll ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        const targetId = id.substring(1);
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - nav.offsetHeight - 20,
          behavior: 'smooth'
        });
        // Update URL hash
        if (history.pushState) {
          history.pushState(null, null, id);
        } else {
          window.location.hash = id;
        }
      }
    });
  });

  // --- Video Modal ---
  const videoModal = document.getElementById('videoModal');
  const videoModalClose = document.getElementById('videoModalClose');
  const videoModalWrapper = document.getElementById('videoModalWrapper');

  const openVideoModal = (videoId, startTime) => {
    const start = startTime ? `&start=${startTime}` : '';
    videoModalWrapper.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0${start}" title="Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
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

  // Clickable video elements
  const handleVideoClick = function(e) {
    e.preventDefault();
    e.stopPropagation();
    const el = this.closest('[data-video-id]');
    if (!el) return;
    const videoId = el.getAttribute('data-video-id');
    const startTime = el.getAttribute('data-video-start');
    if (videoId) openVideoModal(videoId, startTime);
  };

  document.querySelectorAll('.media-card--video').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', handleVideoClick);
  });

  document.querySelectorAll('.video-card[data-video-id]').forEach(card => {
    card.addEventListener('click', handleVideoClick);
  });

  // --- Contact Modal ---
  const contactModal = document.getElementById('contactModal');
  const contactModalClose = document.getElementById('contactModalClose');
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  const openContactModal = (e) => {
    if (e) e.preventDefault();
    contactModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    contactForm.style.display = '';
    formSuccess.classList.remove('active');
    // Apply i18n placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const lang = typeof currentLang !== 'undefined' ? currentLang : 'ko';
      const t = typeof translations !== 'undefined' ? translations[lang]?.[key] : null;
      if (t) el.setAttribute('placeholder', t);
    });
  };

  const closeContactModal = () => {
    contactModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  contactModalClose.addEventListener('click', closeContactModal);
  contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) closeContactModal();
  });

  // Intercept contact links
  document.querySelectorAll('a[href="mailto:techeer@techeer.net"]').forEach(btn => {
    btn.addEventListener('click', openContactModal);
  });

  document.querySelectorAll('a[href="#contact"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
      openContactModal(e);
    });
  });

  // Form submit
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const name = data.get('name');
    const email = data.get('email');
    const message = data.get('message');

    const subject = encodeURIComponent(`[Techeer Website] Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:techeer@techeer.net?subject=${subject}&body=${body}`;

    contactForm.style.display = 'none';
    formSuccess.classList.add('active');
    contactForm.reset();
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (videoModal.classList.contains('active')) closeVideoModal();
      if (contactModal.classList.contains('active')) closeContactModal();
      if (blogPopup.classList.contains('active')) closeBlogPopup();
    }
  });

  // --- Blog Feed (Medium RSS via rss2json) ---
  const blogList = document.getElementById('blogList');
  const blogPopup = document.getElementById('blogPopup');
  const blogPopupClose = document.getElementById('blogPopupClose');
  const blogPopupTitle = document.getElementById('blogPopupTitle');
  const blogPopupMeta = document.getElementById('blogPopupMeta');
  const blogPopupThumb = document.getElementById('blogPopupThumb');
  const blogPopupContent = document.getElementById('blogPopupContent');
  const blogPopupLink = document.getElementById('blogPopupLink');

  const openBlogPopup = (post) => {
    blogPopupTitle.textContent = post.title;
    blogPopupMeta.textContent = `${post.author} · ${post.date}`;
    blogPopupThumb.innerHTML = post.thumbnail ? `<img src="${post.thumbnail}" alt="${post.title}">` : '';
    blogPopupContent.innerHTML = post.description;
    blogPopupLink.href = post.link;
    blogPopup.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeBlogPopup = () => {
    blogPopup.classList.remove('active');
    document.body.style.overflow = '';
  };

  blogPopupClose.addEventListener('click', closeBlogPopup);
  blogPopup.addEventListener('click', (e) => {
    if (e.target === blogPopup) closeBlogPopup();
  });

  const fetchBlog = async () => {
    try {
      const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://blog.techeer.net/feed');
      const data = await res.json();
      if (data.status !== 'ok' || !data.items?.length) {
        const lang = typeof currentLang !== 'undefined' ? currentLang : 'ko';
        const errorMsg = lang === 'en' ? 'Unable to load blog posts.' : '블로그 포스트를 불러올 수 없습니다.';
        blogList.innerHTML = `<div class="blog-loading">${errorMsg}</div>`;
        return;
      }

      blogList.innerHTML = '';
      const posts = data.items.slice(0, 12);

      posts.forEach(item => {
        // Extract thumbnail from content
        const thumbMatch = item.content?.match(/<img[^>]+src="([^"]+)"/);
        const thumbnail = item.thumbnail || (thumbMatch ? thumbMatch[1] : '');

        // Extract text preview
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = item.description || item.content || '';
        const textPreview = tempDiv.textContent.trim().slice(0, 200) + '...';

        // Format date
        const date = new Date(item.pubDate);
        const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;

        const post = {
          title: item.title,
          author: item.author || 'Techeer',
          date: dateStr,
          thumbnail,
          description: textPreview,
          link: item.link
        };

        const el = document.createElement('div');
        el.className = 'blog-item';
        el.innerHTML = `
          ${thumbnail ? `<div class="blog-item-thumb"><img src="${thumbnail}" alt="" loading="lazy"></div>` : ''}
          <div class="blog-item-body">
            <div class="blog-item-title">${item.title}</div>
            <div class="blog-item-meta">
              <span class="blog-item-author">${post.author}</span>
              <span>·</span>
              <span class="blog-item-date">${dateStr}</span>
            </div>
          </div>
          <svg class="blog-item-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        `;
        el.addEventListener('click', () => openBlogPopup(post));
        blogList.appendChild(el);
      });
    } catch (err) {
      const lang = typeof currentLang !== 'undefined' ? currentLang : 'ko';
      const errorMsg = lang === 'en' ? 'Unable to load blog posts.' : '블로그 포스트를 불러올 수 없습니다.';
      blogList.innerHTML = `<div class="blog-loading">${errorMsg}</div>`;
    }
  };

  fetchBlog();

  // --- Active nav highlight & Deep linking ---
  const sections = document.querySelectorAll('.section, .hero');
  const navLinksArr = document.querySelectorAll('.nav-link:not(.nav-link--cta)');
  let currentHash = '';
  let isScrolling = false;

  // Update URL hash on scroll (throttled)
  let hashUpdateTimeout;
  const updateHash = (id) => {
    if (id && currentHash !== id) {
      currentHash = id;
      clearTimeout(hashUpdateTimeout);
      hashUpdateTimeout = setTimeout(() => {
        if (history.replaceState) {
          history.replaceState(null, null, `#${id}`);
        } else {
          window.location.hash = `#${id}`;
        }
      }, 150);
    }
  };

  window.addEventListener('scroll', () => {
    if (isScrolling) return;
    
    const scrollY = window.scrollY + 200;
    let activeSection = null;
    
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (id && scrollY >= top && scrollY < top + height) {
        activeSection = id;
        navLinksArr.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });

    // Update hash for deep linking
    if (activeSection) {
      updateHash(activeSection);
    } else if (window.scrollY < 100) {
      // Clear hash when at top
      if (currentHash) {
        currentHash = '';
        if (history.replaceState) {
          history.replaceState(null, null, window.location.pathname);
        }
      }
    }
  }, { passive: true });

  // Handle initial hash on page load
  const handleInitialHash = () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const targetSection = document.getElementById(hash);
      if (targetSection) {
        isScrolling = true;
        setTimeout(() => {
          const navHeight = document.getElementById('nav').offsetHeight;
          const targetTop = targetSection.getBoundingClientRect().top + window.scrollY - navHeight - 20;
          window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
          });
          setTimeout(() => {
            isScrolling = false;
          }, 1000);
        }, 100);
      }
    }
  };

  // Handle hash changes (browser back/forward)
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const targetSection = document.getElementById(hash);
      if (targetSection) {
        isScrolling = true;
        setTimeout(() => {
          const navHeight = document.getElementById('nav').offsetHeight;
          const targetTop = targetSection.getBoundingClientRect().top + window.scrollY - navHeight - 20;
          window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
          });
          setTimeout(() => {
            isScrolling = false;
          }, 1000);
        }, 100);
      }
    }
  });

  // Initialize on page load
  handleInitialHash();

  // --- Scroll to Top Button ---
  const scrollToTopBtn = document.getElementById('scrollToTop');
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  // Scroll to top on click
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});
