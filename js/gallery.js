document.addEventListener('DOMContentLoaded', () => {
  const chips = document.querySelectorAll('.chip');
  const cards = document.querySelectorAll('.gallery-card');
  const menuToggle = document.querySelector('.menu-toggle');
  const filterChips = document.querySelector('.filter-chips');

  // --- Activate a tab and filter cards ---
  function activateTab(filter) {
    // update chip states
    chips.forEach(c => {
      c.classList.remove('active');
      c.setAttribute('aria-selected', 'false');
    });
    const targetChip = document.querySelector(`.chip[data-filter="${filter}"]`);
    if (targetChip) {
      targetChip.classList.add('active');
      targetChip.setAttribute('aria-selected', 'true');
    }

    // filter cards
    cards.forEach(card => {
      if (filter === 'all') {
        card.style.display = '';
      } else {
        const cats = (card.dataset.cats || '').split(/\s+/);
        card.style.display = cats.includes(filter) ? '' : 'none';
      }
    });
  }

  // --- Apply URL param/hash on load ---
  const params = new URLSearchParams(window.location.search);
  const tabParam = params.get('tab') || window.location.hash.substring(1);
  if (tabParam) {
    activateTab(tabParam);
  } else {
    // default to "all"
    activateTab('all');
  }

  // --- Click handlers for tabs ---
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const filter = chip.dataset.filter;
      activateTab(filter);
      // update URL hash so reload keeps same tab
      history.replaceState(null, '', `#${filter}`);
      // close menu on mobile
      filterChips.classList.remove('open');
    });
  });

  // --- Hamburger toggle ---
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      filterChips.classList.toggle('open');
    });
  }

  // --- Lightbox setup ---
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');

  let currentImages = [];
  let currentIndex = 0;

  function openLightbox(images, index = 0) {
    if (!lb || !lbImg) return;
    currentImages = images;
    currentIndex = index;
    lbImg.src = currentImages[currentIndex];
    lb.classList.add('active');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lbClose) lbClose.focus();
  }

  function closeLightbox() {
    if (!lb || !lbImg) return;
    lb.classList.remove('active');
    lb.setAttribute('aria-hidden', 'true');
    lbImg.src = '';
    document.body.style.overflow = '';
  }

  function showNext(n) {
    if (!lbImg || !currentImages.length) return;
    currentIndex = (currentIndex + n + currentImages.length) % currentImages.length;
    lbImg.src = currentImages[currentIndex];
  }

  // --- Wire lightbox events if elements exist ---
  if (lb && lbImg) {
    cards.forEach(card => card.addEventListener('click', () => {
      const ba = card.querySelectorAll('.before-after img');
      const single = card.querySelector('.gallery-media img');
      if (ba.length) {
        const imgs = Array.from(ba).map(i => i.src);
        openLightbox(imgs, 0);
      } else if (single) {
        openLightbox([single.src], 0);
      }
    }));

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev) lbPrev.addEventListener('click', () => showNext(-1));
    if (lbNext) lbNext.addEventListener('click', () => showNext(1));

    lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showNext(-1);
      if (e.key === 'ArrowRight') showNext(1);
    });
  }
});
