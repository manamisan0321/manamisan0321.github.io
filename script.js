// Utility Functions
function throttle(func, wait) {
    let last = 0;
    return function(...args) {
      const now = Date.now();
      if (now - last >= wait) {
        func.apply(this, args);
        last = now;
      }
    };
  }
  
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
  
  function select(selector, parent = document) {
    return parent.querySelector(selector);
  }
  
  function selectAll(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  }
  
  function getOffsetTop(element) {
    let offset = 0;
    while (element) {
      offset += element.offsetTop;
      element = element.offsetParent;
    }
    return offset;
  }
  
  // Navigation & Mobile Menu
  class Nav {
    constructor() {
      this.header = select('#header');
      this.toggleBtn = select('.nav-toggle');
      this.navList = select('.nav ul');
      this.links = selectAll('.nav-link');
      this.init();
    }
    init() {
      this.toggleBtn.addEventListener('click', () => this.toggleMenu());
      this.links.forEach(link => link.addEventListener('click', e => this.onLinkClick(e)));
    }
    toggleMenu() {
      const active = this.toggleBtn.classList.toggle('active');
      this.navList.style.right = active ? '0' : '-100%';
      document.body.classList.toggle('no-scroll', active);
    }
    onLinkClick(e) {
      e.preventDefault();
      const targetId = e.currentTarget.getAttribute('href');
      const target = select(targetId);
      const offset = this.header.offsetHeight;
      if (target) {
        window.scrollTo({ top: getOffsetTop(target) - offset, behavior: 'smooth' });
      }
      this.toggleBtn.classList.remove('active');
      this.navList.style.right = '-100%';
      document.body.classList.remove('no-scroll');
    }
  }
  
  // Smooth Scroll for Anchors
  class SmoothScroll {
    constructor() {
      this.header = select('#header');
      this.links = selectAll('a[href^="#"]');
      this.init();
    }
    init() {
      this.links.forEach(link => link.addEventListener('click', e => this.handleClick(e)));
      if (window.location.hash) {
        this.scrollToHash(window.location.hash);
      }
    }
    handleClick(e) {
      const href = e.currentTarget.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        this.scrollToHash(href);
      }
    }
    scrollToHash(hash) {
      const target = select(hash);
      if (target) {
        const offset = this.header.offsetHeight;
        window.scrollTo({ top: getOffsetTop(target) - offset, behavior: 'smooth' });
      }
    }
  }
  
  // Scroll Spy to Highlight Active Section
  class ScrollSpy {
    constructor() {
      this.header = select('#header');
      this.sections = selectAll('section[id]');
      this.links = selectAll('.nav-link');
      this.onScroll = throttle(this.highlight.bind(this), 100);
      this.init();
    }
    init() {
      window.addEventListener('scroll', this.onScroll);
    }
    highlight() {
      const scrollPos = window.scrollY + this.header.offsetHeight + 5;
      this.sections.forEach(sec => {
        const top = sec.offsetTop;
        const bottom = top + sec.offsetHeight;
        if (scrollPos >= top && scrollPos < bottom) {
          this.links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${sec.id}`));
        }
      });
    }
  }
  
  // Reveal Animations on Scroll
  class RevealOnScroll {
    constructor() {
      this.elements = selectAll('.fade-in, .slide-up, .slide-in');
      this.observer = null;
      this.init();
    }
    init() {
      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver(this.callback.bind(this), { threshold: 0.1 });
        this.elements.forEach(el => {
          if (el.dataset.delay) el.style.animationDelay = `${el.dataset.delay}ms`;
          this.observer.observe(el);
        });
      } else {
        this.fallback();
      }
    }
    callback(entries, obs) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }
    fallback() {
      this.elements.forEach(el => el.classList.add('visible'));
    }
  }
  
  // Lazy Load Images
  class LazyLoader {
    constructor() {
      this.images = selectAll('img[data-src]');
      this.init();
    }
    init() {
      if ('IntersectionObserver' in window) {
        const lazyObs = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              obs.unobserve(img);
            }
          });
        }, { rootMargin: '0px 0px 50px 0px', threshold: 0.01 });
        this.images.forEach(img => lazyObs.observe(img));
      } else {
        this.images.forEach(img => {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        });
      }
    }
  }
  
  // Back To Top Button
  class BackToTop {
    constructor() {
      this.button = select('#backToTop');
      this.offset = 600;
      this.onScroll = throttle(this.toggleVisibility.bind(this), 100);
      this.init();
    }
    init() {
      window.addEventListener('scroll', this.onScroll);
      this.button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
    toggleVisibility() {
      const show = window.scrollY > this.offset;
      this.button.classList.toggle('show', show);
    }
  }
  // Modal Overlay Functionality
class Modal {
    constructor() {
      this.overlay = select('#modalOverlay');
      this.modal = select('.modal');
      this.closeBtn = select('.modal-close');
      this.init();
    }
    init() {
      selectAll('[data-open-modal]').forEach(btn =>
        btn.addEventListener('click', () => this.open())
      );
      this.closeBtn.addEventListener('click', () => this.close());
      this.overlay.addEventListener('click', e => {
        if (e.target === this.overlay) this.close();
      });
    }
    open() {
      this.overlay.classList.remove('hidden');
      document.body.classList.add('no-scroll');
    }
    close() {
      this.overlay.classList.add('hidden');
      document.body.classList.remove('no-scroll');
    }
  }
  
  // Cookie Consent
  class CookieConsent {
    constructor() {
      this.banner = select('#cookieConsent');
      this.acceptBtn = select('#acceptCookies');
      this.storageKey = 'cookieConsent';
      this.init();
    }
    init() {
      if (!localStorage.getItem(this.storageKey)) {
        setTimeout(() => this.show(), 1000);
      }
      this.acceptBtn.addEventListener('click', () => this.accept());
    }
    show() {
      this.banner.classList.add('show');
    }
    accept() {
      localStorage.setItem(this.storageKey, 'true');
      this.banner.classList.remove('show');
    }
  }
  
  // Preloader
  class Preloader {
    constructor() {
      this.preloader = select('#preloader');
      this.init();
    }
    init() {
      window.addEventListener('load', () => {
        this.hide();
      });
    }
    hide() {
      this.preloader.classList.add('hidden');
      document.body.classList.remove('no-scroll');
    }
  }
  
  // Theme Toggle (Light / Dark)
  class ThemeToggle {
    constructor() {
      this.toggle = select('#themeToggle');
      this.storageKey = 'themePreference';
      this.init();
    }
    init() {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) document.documentElement.setAttribute('data-theme', saved);
      this.toggle.addEventListener('click', () => this.switch());
    }
    switch() {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(this.storageKey, next);
    }
  }
  
  // In-Viewport Utility
  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  
  // Service Worker Registration
  class ServiceWorkerRegistry {
    constructor() {
      this.init();
    }
    init() {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => console.log('SW registered:', reg.scope))
          .catch(err => console.error('SW registration failed:', err));
      }
    }
  }
  
  // Analytics Stub
  class Analytics {
    constructor() {
      this.init();
    }
    init() {
      this.trackPage();
      document.addEventListener('click', e => this.trackClick(e));
    }
    trackPage() {
      console.log('Tracking pageview:', window.location.pathname);
    }
    trackClick(e) {
      const target = e.target.closest('a, button');
      if (target) console.log('Click event on:', target.tagName, target.textContent.trim());
    }
  }
  
  // CustomEvent Polyfill
  (function() {
    if (typeof window.CustomEvent === 'function') return;
    function _CustomEvent(event, params) {
      params = params || { bubbles: false, cancelable: false, detail: null };
      const evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    }
    _CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = _CustomEvent;
  })();
  
  // Initialize All Functionality
  (function() {
    document.addEventListener('DOMContentLoaded', () => {
      new Nav();
      new SmoothScroll();
      new ScrollSpy();
      new RevealOnScroll();
      new LazyLoader();
      new BackToTop();
      new Modal();
      new CookieConsent();
      new Preloader();
      new ThemeToggle();
      new ServiceWorkerRegistry();
      new Analytics();
    });
  })();
  // Contact Form Validation & Submission
class FormHandler {
    constructor(formSelector) {
      this.form = select(formSelector);
      this.nameInput = select('#name', this.form);
      this.emailInput = select('#email', this.form);
      this.messageInput = select('#message', this.form);
      this.submitBtn = select('button[type="submit"]', this.form);
      this.endpoint = this.form.getAttribute('action');
      this.init();
    }
    init() {
      this.form.addEventListener('submit', e => this.handleSubmit(e));
      [this.nameInput, this.emailInput, this.messageInput].forEach(input => {
        input.addEventListener('input', () => this.validateField(input));
      });
    }
    validateField(field) {
      const isValid = field.checkValidity();
      field.classList.toggle('invalid', !isValid);
      return isValid;
    }
    async handleSubmit(e) {
      e.preventDefault();
      const isNameValid = this.validateField(this.nameInput);
      const isEmailValid = this.validateField(this.emailInput);
      const isMsgValid = this.validateField(this.messageInput);
      if (!isNameValid || !isEmailValid || !isMsgValid) return;
      this.submitBtn.disabled = true;
      this.submitBtn.textContent = 'Sending...';
      try {
        const formData = new FormData(this.form);
        const response = await fetch(this.endpoint, { method: 'POST', body: formData });
        if (response.ok) {
          this.showSuccess();
        } else {
          this.showError();
        }
      } catch (err) {
        this.showError();
      } finally {
        this.submitBtn.disabled = false;
        this.submitBtn.textContent = 'Send Message';
      }
    }
    showSuccess() {
      alert('Message sent successfully!');
      this.form.reset();
    }
    showError() {
      alert('Oops! Something went wrong. Please try again.');
    }
  }
  
  // GSAP Scroll Animations (Optional)
  function initGsapAnimations() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.utils.toArray('.work-item').forEach(item => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
          },
          y: 50,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
        });
      });
    }
  }
  
  // Filterable Portfolio
  class PortfolioFilter {
    constructor(buttonSelector, itemSelector) {
      this.buttons = selectAll(buttonSelector);
      this.items = selectAll(itemSelector);
      this.init();
    }
    init() {
      this.buttons.forEach(btn => btn.addEventListener('click', e => this.filter(e)));
    }
    filter(e) {
      const category = e.currentTarget.getAttribute('data-filter');
      this.items.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
      this.buttons.forEach(b => b.classList.toggle('active', b === e.currentTarget));
    }
  }
  
  // Dark Mode Toggle Icon Update
  class DarkModeIcon {
    constructor(toggleSelector, iconSelector) {
      this.toggle = select(toggleSelector);
      this.icon = select(iconSelector);
      this.init();
    }
    init() {
      this.updateIcon();
      this.toggle.addEventListener('click', () => this.updateIcon());
    }
    updateIcon() {
      const theme = document.documentElement.getAttribute('data-theme') || 'light';
      this.icon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
  }
  
  // Offline Fallback for Navigation
  window.addEventListener('offline', () => {
    const offlineBanner = document.createElement('div');
    offlineBanner.id = 'offlineBanner';
    offlineBanner.textContent = 'You are offline. Some features may not be available.';
    offlineBanner.className = 'slide-down';
    document.body.prepend(offlineBanner);
  });
  window.addEventListener('online', () => {
    const banner = select('#offlineBanner');
    if (banner) banner.remove();
  });
  
  // SVG Icon Inlining
  function inlineSvgIcons() {
    selectAll('img.inline-svg').forEach(img => {
      const imgURL = img.src;
      fetch(imgURL)
        .then(resp => resp.text())
        .then(svgText => {
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
          const svgEl = svgDoc.querySelector('svg');
          if (img.id) svgEl.id = img.id;
          if (img.className) svgEl.classList = img.classList;
          img.replaceWith(svgEl);
        });
    });
  }
  
  // Initialize Extras on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    new FormHandler('.contact-form');
    initGsapAnimations();
    new PortfolioFilter('.filter-btn', '.work-item');
    new DarkModeIcon('#themeToggle', '#themeIcon');
    inlineSvgIcons();
  });
  