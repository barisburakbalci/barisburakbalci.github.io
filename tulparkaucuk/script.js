// Modern JS for scroll animations and language switching

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // --- Language Switching ---
    const langButtons = document.querySelectorAll('.lang-btn');
    let currentLang = localStorage.getItem('preferredLanguage') || 'tr';
    
    function switchLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('preferredLanguage', lang);
        document.documentElement.lang = lang;
        
        // Update Active State
        langButtons.forEach(btn => {
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update Content
        const elements = document.querySelectorAll('[data-tr][data-en]');
        elements.forEach(el => {
            el.textContent = el.getAttribute(`data-${lang}`);
            // Handle placeholders if any
            if(el.placeholder) {
                el.placeholder = el.getAttribute(`data-${lang}`);
            }
        });
    }

    // Initialize Language
    switchLanguage(currentLang);

    // Event Listeners for Language
    langButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lang = e.target.dataset.lang;
            switchLanguage(lang);
        });
    });

    // --- Navigation Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            navbar.style.padding = '10px 0';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '15px 0';
        }
    });

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in, .product-category-row');
    
    // Initial state for animation elements (if not set in CSS correctly for JS takeover)
    // Actually, our CSS handles the animation definition, but we can toggle a class to trigger it
    // Let's modify the logic to add a 'visible' class
    
    /* 
       Note: The CSS currently has animation: ... forwards. 
       Ideally, we should set opacity: 0 in CSS and add a class like .animate-in 
       that contains the animation. 
       
       Let's just fix the opacity in CSS via JS for the ones we want to wait for scroll
    */
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });

    // Override the observer callback to play animation
    const playAnimationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => playAnimationObserver.observe(el));
});
