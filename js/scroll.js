/* =========================================
   SCROLL LOGIC
   ========================================= */
import { debounce } from './performance.js';

export function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    const header = document.getElementById('mainHeader');
    const stickyStrip = document.getElementById('stickyStrip');
    const heroHeight = document.getElementById('hero')?.offsetHeight || 600;

    if (!progressBar || !header) return;

    const onScroll = debounce(() => {
        // Progress Bar
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';

        // Sticky Header
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Sticky Strip (Show after hero)
        if (stickyStrip) {
            if (scrollTop > heroHeight) {
                stickyStrip.classList.add('visible');
            } else {
                stickyStrip.classList.remove('visible');
            }
        }
    }, 10);

    window.addEventListener('scroll', onScroll, { passive: true });
}

export function initIntersectionAnimations() {
    const elements = document.querySelectorAll('.stagger-animate');
    
    // Apply index-based transition delays for staggering within the same section
    // Groups elements by their parent section roughly to reset stagger
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: stop observing once animated
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Calculate delay based on DOM order structurally
    elements.forEach((el, index) => {
        // Simple modulo to prevent huge delays if many elements on page
        const delayIndex = index % 5; 
        el.style.transitionDelay = `${delayIndex * 0.1}s`;
        observer.observe(el);
    });
}
