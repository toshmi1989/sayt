/* =========================================
   SLIDER LOGIC
   ========================================= */

export function initReviewsSlider() {
    const track = document.getElementById('sliderTrack');
    const slides = Array.from(document.querySelectorAll('.slide'));
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    
    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoPlayInterval;

    function updateSlider(newIndex) {
        // Blur out current
        slides[currentIndex].classList.remove('active');
        
        currentIndex = newIndex;
        if (currentIndex < 0) currentIndex = totalSlides - 1;
        if (currentIndex >= totalSlides) currentIndex = 0;
        
        // Move track
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Fade in new
        slides[currentIndex].classList.add('active');
    }

    function nextSlide() { updateSlider(currentIndex + 1); }
    function prevSlide() { updateSlider(currentIndex - 1); }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(nextSlide, 6000);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
    }

    if(nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoPlay(); });
    if(prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoPlay(); });

    // Touch Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    }, { passive: true });
    
    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoPlay();
    }, { passive: true });

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) nextSlide();
        if (touchEndX > touchStartX + 50) prevSlide();
    }

    startAutoPlay();
}
