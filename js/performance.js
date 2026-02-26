/* =========================================
   PERFORMANCE UTILITIES
   ========================================= */

// Basic debounce
export function debounce(func, wait = 20, immediate = true) {
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

// Ease out cubic
export function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}
