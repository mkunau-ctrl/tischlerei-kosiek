// Tischlerei Kosiek — minimal Vanilla JS
(function () {
  'use strict';

  // ---- Hero-Slideshow (cross-fade + Ken Burns) ----
  const heroSlides = document.querySelectorAll('.hero-slide');
  if (heroSlides.length > 1) {
    let activeIdx = 0;
    setInterval(() => {
      heroSlides[activeIdx].classList.remove('active');
      activeIdx = (activeIdx + 1) % heroSlides.length;
      heroSlides[activeIdx].classList.add('active');
    }, 6000);
  }

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
