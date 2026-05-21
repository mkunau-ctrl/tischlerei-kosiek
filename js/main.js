// Tischlerei Kosiek — minimal Vanilla JS
(function () {
  'use strict';

  // ---- Scroll-Progress-Balken ----
  const progressBar = document.querySelector('.scroll-progress__bar');
  if (progressBar) {
    const updateProgress = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
      progressBar.style.width = Math.min(Math.max(pct, 0), 100) + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }

  // ---- Reveal on scroll (per-section animation) ----
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => obs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // ---- Card-Slider (Pfeile + Snap) ----
  document.querySelectorAll('.card-slider').forEach((slider) => {
    const viewport = slider.querySelector('.card-slider__viewport');
    const prev = slider.querySelector('.card-slider__btn--prev');
    const next = slider.querySelector('.card-slider__btn--next');
    const firstCard = slider.querySelector('.card-slider__card');
    if (!viewport || !prev || !next || !firstCard) return;

    const step = () => {
      const cardW = firstCard.getBoundingClientRect().width;
      const trackGap = parseInt(getComputedStyle(slider).getPropertyValue('--cs-gap')) || 24;
      return cardW + trackGap;
    };

    const updateBtns = () => {
      const max = viewport.scrollWidth - viewport.clientWidth - 1;
      prev.disabled = viewport.scrollLeft <= 1;
      next.disabled = viewport.scrollLeft >= max;
    };

    prev.addEventListener('click', () => viewport.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => viewport.scrollBy({ left:  step(), behavior: 'smooth' }));
    viewport.addEventListener('scroll', updateBtns, { passive: true });
    window.addEventListener('resize', updateBtns);
    updateBtns();
  });

  // ---- Mobile Menu ----
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
    nav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') nav.classList.remove('open');
    });
  }

  // ---- Galerie-Filter ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.category;
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        galleryItems.forEach((item) => {
          const show = cat === 'all' || item.dataset.category === cat;
          item.classList.toggle('hidden', !show);
        });
      });
    });
  }

  // ---- Lightbox ----
  const lightbox = document.querySelector('.lightbox');
  if (lightbox && galleryItems.length) {
    const lbImg = lightbox.querySelector('img');
    const close = lightbox.querySelector('.lb-close');
    const prev = lightbox.querySelector('.lb-prev');
    const next = lightbox.querySelector('.lb-next');
    let visibleItems = [];
    let currentIndex = 0;

    const updateVisible = () => {
      visibleItems = Array.from(galleryItems).filter(
        (i) => !i.classList.contains('hidden')
      );
    };

    const showAt = (idx) => {
      updateVisible();
      if (!visibleItems.length) return;
      currentIndex = (idx + visibleItems.length) % visibleItems.length;
      const src = visibleItems[currentIndex].querySelector('img').src;
      lbImg.src = src;
    };

    galleryItems.forEach((item) => {
      item.addEventListener('click', () => {
        updateVisible();
        const idx = visibleItems.indexOf(item);
        if (idx === -1) return;
        currentIndex = idx;
        lbImg.src = item.querySelector('img').src;
        lightbox.classList.add('open');
      });
    });

    close.addEventListener('click', () => lightbox.classList.remove('open'));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('open');
    });
    prev.addEventListener('click', () => showAt(currentIndex - 1));
    next.addEventListener('click', () => showAt(currentIndex + 1));
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') lightbox.classList.remove('open');
      if (e.key === 'ArrowLeft') showAt(currentIndex - 1);
      if (e.key === 'ArrowRight') showAt(currentIndex + 1);
    });
  }
})();
