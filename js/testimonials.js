document.addEventListener('DOMContentLoaded', function() {
    // Initialize WOW.js with callback to keep cards visible
    if (typeof WOW !== 'undefined') {
        new WOW({
            callback: function(box) {
                // Add a class to keep the element visible after animation
                if (box.classList.contains('testimonial-card')) {
                    box.classList.add('visible');
                }
            }
        }).init();
    }

    // Fallback for cards already in viewport on load
    const cards = document.querySelectorAll('.testimonial-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, {
        threshold: 0.1
    });

    cards.forEach(card => {
        observer.observe(card);
    });

    // DOM Elements for slider functionality (kept for reference, not used in grid layout)
    const slider = document.querySelector('.testimonial-slider');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    const dotsContainer = document.querySelector('.testimonial-dots');
    
    // State
    let currentIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    let autoSlideInterval;
    const cardWidth = 100; // 100% width per card
    const autoSlideDelay = 8000; // 8 seconds
    
    // Create dots
    function createDots() {
        cards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('testimonial-dot');
            if (index === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }
    
    // Update dots
    function updateDots() {
        const dots = document.querySelectorAll('.testimonial-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Update slider position
    function updateSlider() {
        slider.style.transform = `translateX(-${currentIndex * cardWidth}%)`;
        updateDots();
        
        // Update ARIA live region
        const activeCard = cards[currentIndex];
        const author = activeCard.querySelector('h4').textContent;
        const role = activeCard.querySelector('span').textContent;
        const liveRegion = document.getElementById('testimonial-live-region');
        if (liveRegion) {
            liveRegion.textContent = `Now showing testimonial from ${author}, ${role}`;
        }
    }
    
    // Go to specific slide
    function goToSlide(index) {
        currentIndex = (index + cards.length) % cards.length;
        updateSlider();
        resetAutoSlide();
    }
    
    // Next slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % cards.length;
        updateSlider();
        resetAutoSlide();
    }
    
    // Previous slide
    function prevSlide() {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateSlider();
        resetAutoSlide();
    }
    
    // Auto slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, autoSlideDelay);
    }
    
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    
    // Touch events for mobile swipe
    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
    }
    
    function handleTouchMove(e) {
        touchEndX = e.touches[0].clientX;
    }
    
    function handleTouchEnd() {
        const touchDiff = touchStartX - touchEndX;
        const swipeThreshold = 50; // Minimum distance for swipe
        
        if (Math.abs(touchDiff) > swipeThreshold) {
            if (touchDiff > 0) {
                nextSlide(); // Swipe left
            } else {
                prevSlide(); // Swipe right
            }
        }
    }
    
    // Keyboard navigation
    function handleKeyDown(e) {
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                prevSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextSlide();
                break;
            case 'Home':
                e.preventDefault();
                goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                goToSlide(cards.length - 1);
                break;
        }
    }
    
    // Initialize
    function init() {
        // Create dots
        createDots();
        
        // Set initial slide
        updateSlider();
        
        // Add event listeners
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        // Touch events
        slider.addEventListener('touchstart', handleTouchStart, { passive: true });
        slider.addEventListener('touchmove', handleTouchMove, { passive: true });
        slider.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        // Keyboard navigation
        document.addEventListener('keydown', handleKeyDown);
        
        // Auto slide
        startAutoSlide();
        
        // Pause auto slide on hover
        const container = document.querySelector('.testimonials-container');
        if (container) {
            container.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
            container.addEventListener('mouseleave', startAutoSlide);
            container.addEventListener('focusin', () => clearInterval(autoSlideInterval));
            container.addEventListener('focusout', startAutoSlide);
        }
        
        // Add ARIA live region for screen readers
        const liveRegion = document.createElement('div');
        liveRegion.id = 'testimonial-live-region';
        liveRegion.className = 'sr-only';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        document.body.appendChild(liveRegion);
    }
    
    // Initialize the slider
    init();
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateSlider();
        }, 250);
    });
    
    // Add a class to the body when JavaScript is enabled
    document.body.classList.add('js-enabled');
});

// Add a class to the html element for better CSS targeting
document.documentElement.classList.add('js-enabled');
