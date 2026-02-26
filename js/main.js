/* =========================================
   PERFORMANCE UTILITIES
   ========================================= */
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

/* =========================================
   SCROLL LOGIC
   ========================================= */
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    const header = document.getElementById('mainHeader');
    const stickyStrip = document.getElementById('stickyStrip');
    const heroHeight = document.getElementById('hero')?.offsetHeight || 600;

    if (!progressBar || !header) return;

    const onScroll = debounce(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';

        if (scrollTop > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');

        if (stickyStrip) {
            if (scrollTop > heroHeight) stickyStrip.classList.add('visible');
            else stickyStrip.classList.remove('visible');
        }
    }, 10);

    window.addEventListener('scroll', onScroll, { passive: true });
}

function initIntersectionAnimations() {
    const elements = document.querySelectorAll('.stagger-animate');
    const observerOptions = { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elements.forEach((el, index) => {
        const delayIndex = index % 5; 
        el.style.transitionDelay = `${delayIndex * 0.1}s`;
        observer.observe(el);
    });
}

/* =========================================
   HERO / NUMBERS LOGIC
   ========================================= */
function initCountUp() {
    const counters = document.querySelectorAll('.count-up');
    const speed = 2000;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = +el.getAttribute('data-target');
                let startTime = null;

                const animate = (timestamp) => {
                    if (!startTime) startTime = timestamp;
                    const progress = timestamp - startTime;
                    const percent = Math.min(progress / speed, 1);
                    const easedPercent = easeOutCubic(percent);
                    const current = Math.floor(target * easedPercent);
                    
                    el.innerText = current;

                    if (progress < speed) requestAnimationFrame(animate);
                    else el.innerText = target;
                };

                requestAnimationFrame(animate);
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

/* =========================================
   SLIDER LOGIC
   ========================================= */
function initReviewsSlider() {
    const track = document.getElementById('sliderTrack');
    const slides = Array.from(document.querySelectorAll('.slide'));
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    
    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoPlayInterval;

    function updateSlider(newIndex) {
        slides[currentIndex].classList.remove('active');
        currentIndex = newIndex;
        if (currentIndex < 0) currentIndex = totalSlides - 1;
        if (currentIndex >= totalSlides) currentIndex = 0;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
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

    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    }, { passive: true });
    
    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 50) nextSlide();
        if (touchEndX > touchStartX + 50) prevSlide();
        startAutoPlay();
    }, { passive: true });

    startAutoPlay();
}

/* =========================================
   GALLERY LIGHTBOX
   ========================================= */
function initLightbox() {
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
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function updateLightbox() {
        lightboxImg.src = images[currentIndex].src;
        lightboxCaption.textContent = images[currentIndex].caption;
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
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImg(e);
        if (e.key === 'ArrowLeft') prevImg(e);
    });
}

/* =========================================
   CONVERSION & FORMS
   ========================================= */
function initExitIntent() {
    const exitModal = document.getElementById('exitModal');
    const closeBtn = document.getElementById('closeExitModal');
    
    if (!exitModal || sessionStorage.getItem('exitShown')) return;

    const onMouseLeave = (e) => {
        if (e.clientY < 0) {
            exitModal.classList.add('active');
            exitModal.setAttribute('aria-hidden', 'false');
            sessionStorage.setItem('exitShown', 'true');
            document.removeEventListener('mouseleave', onMouseLeave);
        }
    };

    document.addEventListener('mouseleave', onMouseLeave);

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            exitModal.classList.remove('active');
            exitModal.setAttribute('aria-hidden', 'true');
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && exitModal.classList.contains('active')) {
            exitModal.classList.remove('active');
            exitModal.setAttribute('aria-hidden', 'true');
        }
    });
}

function initFormValidation() {
    const form = document.getElementById('bookingForm');
    const successMsg = document.getElementById('formSuccess');

    if (!form || !successMsg) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalBtnText = btn.innerText;
        btn.innerText = 'Отправка...';
        btn.disabled = true;

        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const comment = document.getElementById('comment').value.trim();

        const message = `📅 Yangi zapis (Alisherakaga rahmat!)\n\n👤 Name: ${name}\n📞 Phone: ${phone}\n💬 Comment: ${comment ? comment : '-'}\n\n🌐 https://travmatolog-shoxrux.uz/`;

        const botToken = '8765607354:AAERndfMUXTAoEM2TaIcQtI6DIfJvyEgGpw';
        const chatId = '529184294'; // Default Production Chat ID

        try {
            const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message
                })
            });

            if (response.ok) {
                setTimeout(() => {
                    form.style.display = 'none';
                    successMsg.classList.remove('hidden');
                    form.reset();
                }, 400); // Slight delay for UX
            } else {
                alert('Произошла ошибка при отправке. Пожалуйста, попробуйте связаться по телефону.');
                btn.innerText = originalBtnText;
                btn.disabled = false;
            }
        } catch (error) {
            console.error('Form sending error:', error);
            alert('Сетевая ошибка. Пожалуйста, попробуйте связаться по телефону.');
            btn.innerText = originalBtnText;
            btn.disabled = false;
        }
    });
}

/* =========================================
   ENTRYPOINT
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const revealLayer = document.getElementById('pageReveal');
    if (revealLayer) setTimeout(() => { revealLayer.style.opacity = '0'; }, 100);
    
    initScrollProgress();
    initIntersectionAnimations();
    initCountUp();
    initReviewsSlider();
    initLightbox();
    initExitIntent();
    initFormValidation();
});
