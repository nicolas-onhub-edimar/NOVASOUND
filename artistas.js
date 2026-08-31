const carousels = document.querySelectorAll('.artist-carousel');

carousels.forEach((carousel) => {

const grid = document.querySelector('.artist-grid');
const leftBtn = document.querySelector('.scroll-left');
const rightBtn = document.querySelector('.scroll-right');
const firstCard = grid.querySelector('.artist-card');

const cardWidth = firstCard.offsetWidth;
const gap = parseInt(getComputedStyle(grid).columnGap);
const scrollAmount = (cardWidth + gap) * 5;


rightBtn.addEventListener('click', () => {
    grid.scrollBy({ left: scrollAmount, behavior: 'smooth' });

    });

leftBtn.addEventListener('click', () => {
    grid.scrollBy({ left: -scrollAmount, behavior: 'smooth'});
});

});