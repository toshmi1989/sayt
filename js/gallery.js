/* =========================================
   GALLERY LIGHTBOX
   ========================================= */

export function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
    const lightboxCaption = lightbox ? lightbox.querySelector('.lightbox-caption') : null;
    const closeBtn = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    const prevBtn = lightbox ? lightbox.querySelector('.lightbox-nav.prev') : null;
    const nextBtn = lightbox ? lightbox.querySelector('.lightbox-nav.next') : null;

    if (!lightbox || !lightboxImg) return;

    let currentIndex = 0;
    const images = Array.from(galleryItems).map(item => ({
        src: item.querySelector('img').src,
        caption: item.dataset.caption || ''
    }));

    function openLightbox(index) {
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // prevent bg scroll
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function updateLightbox() {
        lightboxImg.src = images[currentIndex].src;
        lightboxCaption.textContent = images[currentIndex].caption;
        
        // Preload next image
        if (currentIndex + 1 < images.length) {
            const img = new Image();
            img.src = images[currentIndex + 1].src;
        }
    }

    function nextImg(e) { e.stopPropagation(); currentIndex = (currentIndex + 1) % images.length; updateLightbox(); }
    function prevImg(e) { e.stopPropagation(); currentIndex = (currentIndex - 1 + images.length) % images.length; updateLightbox(); }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', nextImg);
    prevBtn.addEventListener('click', prevImg);
    
    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImg(e);
        if (e.key === 'ArrowLeft') prevImg(e);
    });
}
