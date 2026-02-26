/* =========================================
   CONVERSION & FORMS
   ========================================= */

export function initExitIntent() {
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

export function initFormValidation() {
    const form = document.getElementById('bookingForm');
    const successMsg = document.getElementById('formSuccess');

    if (!form || !successMsg) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Mock validation/submission logic
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        btn.innerText = 'Отправка...';
        btn.disabled = true;

        setTimeout(() => {
            form.style.display = 'none';
            successMsg.classList.remove('hidden');
            
            // Optional: send to analytical system like GTM here
        }, 1200);
    });
}
