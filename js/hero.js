/* =========================================
   HERO / NUMBERS LOGIC
   ========================================= */
import { easeOutCubic } from './performance.js';

export function initCountUp() {
    const counters = document.querySelectorAll('.count-up');
    const speed = 2000; // Total duration in ms

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

                    if (progress < speed) {
                        requestAnimationFrame(animate);
                    } else {
                        el.innerText = target;
                    }
                };

                requestAnimationFrame(animate);
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}
