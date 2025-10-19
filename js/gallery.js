document.addEventListener('DOMContentLoaded', () => {
    const chips = document.querySelectorAll('.chip');
    const cards = Array.from(document.querySelectorAll('.gallery-card'));
    const grid = document.getElementById('galleryGrid');

    chips.forEach(chip => chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const filter = chip.dataset.filter;
        cards.forEach(card => {
            if (filter === 'all') { card.style.display = ''; return; }
            const cats = (card.dataset.cats||'').split(/\s+/);
            card.style.display = cats.includes(filter) ? '' : 'none';
        });
    }));

    // Lightbox
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lbImg');
    const lbClose = document.getElementById('lbClose');
    const lbPrev = document.getElementById('lbPrev');
    const lbNext = document.getElementById('lbNext');
    let currentImages = [];
    let currentIndex = 0;

    function openLightbox(images, index){
        currentImages = images; currentIndex = index||0;
        lbImg.src = currentImages[currentIndex];
        lb.classList.add('active'); lb.setAttribute('aria-hidden','false');
    }
    function closeLightbox(){ lb.classList.remove('active'); lb.setAttribute('aria-hidden','true'); lbImg.src=''; }
    function showNext(n){ currentIndex = (currentIndex + n + currentImages.length) % currentImages.length; lbImg.src = currentImages[currentIndex]; }

    // Open when clicking a card: choose images inside (.before-after img) or single img
    cards.forEach(card => card.addEventListener('click', () => {
        const ba = card.querySelectorAll('.before-after img');
        const single = card.querySelector('.gallery-media img');
        if (ba.length){ const imgs = Array.from(ba).map(i=>i.src); openLightbox(imgs, 0); }
        else if (single){ openLightbox([single.src],0); }
    }));

    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', ()=>showNext(-1));
    lbNext.addEventListener('click', ()=>showNext(1));
    lb.addEventListener('click', (e)=>{ if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', (e)=>{
        if (!lb.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showNext(-1);
        if (e.key === 'ArrowRight') showNext(1);
    });
});