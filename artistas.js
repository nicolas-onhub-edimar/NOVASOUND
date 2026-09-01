const carousels = document.querySelectorAll('.artist-carousel');

carousels.forEach((carousel) => {

const grid = carousel.querySelector('.artist-grid');
const leftBtn = carousel.querySelector('.scroll-left');
const rightBtn = carousel.querySelector('.scroll-right');
const firstCard = grid.querySelector('.artist-card');

const cardWidth = firstCard.offsetWidth;
const gap = parseInt(getComputedStyle(grid).columnGap);
const scrollAmount = (cardWidth + gap) * 5;


rightBtn.addEventListener('click', () => {
    grid.scrollBy({ 
        left: scrollAmount, 
        behavior: 'smooth' 
    });
    
});

leftBtn.addEventListener('click', () => {
    grid.scrollBy({ 
        left: -scrollAmount,
        behavior: 'smooth'});
});

});