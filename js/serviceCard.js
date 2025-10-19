// Accessibility: allow left/right arrow to swap before/after images inside focused card
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.service-card').forEach(card => {
        const beforeAfter = card.querySelectorAll('.before-after img');
        if (!beforeAfter.length) return;
        let showIndex = 0; // 0 -> show both (side-by-side); keep for future toggles

        // clicking on the card toggles a subtle highlight
        card.addEventListener('click', () => card.classList.toggle('active'));

        // keyboard: left/right to cycle images for cases where we might implement single-image view
        card.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                // For now just toggle highlight for visibility
                card.classList.toggle('active');
            }
        });
    });
});