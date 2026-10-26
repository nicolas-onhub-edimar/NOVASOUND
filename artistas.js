document.querySelectorAll('.artist-carousel').forEach((carousel) => {
    const grid = carousel.querySelector('.artist-grid');

    const scroll = (direction) => {
        const card = grid.querySelector('.artist-card');
        if (!card) return;

        const gap = Number.parseFloat(getComputedStyle(grid).columnGap) || 0;
        grid.scrollBy({
            left: direction * (card.getBoundingClientRect().width + gap) * 2,
            behavior: 'smooth',
        });
    };

    carousel.querySelector('.scroll-right')?.addEventListener('click', () => scroll(1));
    carousel.querySelector('.scroll-left')?.addEventListener('click', () => scroll(-1));
});
