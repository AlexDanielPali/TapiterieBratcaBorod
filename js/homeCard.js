    // Simple card carousel: supports prev/next + thumbnails
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.card').forEach(card => {
    const images = (card.dataset.images || '').split('|').filter(Boolean);
    const imgEl = card.querySelector('.card-image');
    const thumbsContainer = card.querySelector('.thumbs');
    let idx = 0;

    // If thumbnails container exists and we have images, build thumbs
    if (thumbsContainer && images.length) {
      images.forEach((src, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.title = `Imagine ${i+1}`;
        const timg = document.createElement('img');
        timg.src = src;
        timg.alt = `miniatura ${i+1}`;
        btn.appendChild(timg);
        btn.addEventListener('click', () => {
          idx = i;
          if (imgEl) imgEl.src = images[idx];
        });
        thumbsContainer.appendChild(btn);
      });
    }

    const updateImg = () => { if (imgEl && images.length) imgEl.src = images[idx % images.length]; };

    const prev = card.querySelector('.prev');
    const next = card.querySelector('.next');

    if (prev) prev.addEventListener('click', () => {
      idx = (idx - 1 + images.length) % images.length;
      updateImg();
    });
    if (next) next.addEventListener('click', () => {
      idx = (idx + 1) % images.length;
      updateImg();
    });

    // make keyboard accessible: left/right when focused inside card
    card.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { prev && prev.click(); }
      if (e.key === 'ArrowRight') { next && next.click(); }
    });

    // initial setup
    updateImg();
  });
});