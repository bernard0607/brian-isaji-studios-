/**
 * Modern Footer Script
 * Handles back-to-top button, smooth scrolling, and newsletter functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year
    const yearElement = document.querySelector('.current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Back to Top Button
    const backToTopBtn = document.querySelector('.back-to-top');
    
    // Show/hide back to top button with fade effect
    function toggleBackToTop() {
        if (!backToTopBtn) return;
        
        if (window.scrollY > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
            backToTopBtn.style.transform = 'translateY(0)';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
            backToTopBtn.style.transform = 'translateY(20px)';
        }
    }
    
    // Initialize back to top button if it exists
    if (backToTopBtn) {
        // Initial check
        toggleBackToTop();
        
        // Add scroll event listener with throttling
        let isScrolling;
        window.addEventListener('scroll', function() {
            window.clearTimeout(isScrolling);
            isScrolling = setTimeout(toggleBackToTop, 50);
        }, { passive: true });
        
        // Smooth scroll to top with easing
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Enhanced smooth scroll for anchor links with offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's a different kind of anchor or external link
            if (targetId === '#' || 
                targetId === '#!' || 
                this.getAttribute('target') === '_blank' ||
                this.classList.contains('no-smooth-scroll')) {
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {toggle: false});
                    bsCollapse.hide();
                }
                
                // Calculate header height for proper scrolling
                const header = document.querySelector('.navbar');
                const headerHeight = header ? header.offsetHeight : 0;
                const extraOffset = 20; // Additional offset in pixels
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - extraOffset;
                
                // Smooth scroll with easing
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    location.hash = targetId;
                }
            }
        });
    });
    
    // Enhanced Newsletter Form Submission with AJAX
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const privacyCheck = this.querySelector('#privacyCheck');
            const email = emailInput.value.trim();
            const messageElement = document.getElementById('newsletterMessage');
            
            // Reset previous states
            emailInput.classList.remove('is-invalid');
            
            // Validation
            let isValid = true;
            
            // Email validation
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                emailInput.classList.add('is-invalid');
                showNewsletterMessage('Please enter a valid email address', 'danger');
                isValid = false;
            }
            
            // Privacy policy check
            if (privacyCheck && !privacyCheck.checked) {
                showNewsletterMessage('Please accept the privacy policy', 'danger');
                isValid = false;
            }
            
            if (!isValid) return;
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Subscribing...';
            
            try {
                // Simulate API call - replace with actual API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Here you would typically make an actual API call
                // const response = await fetch('/api/subscribe', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({ email })
                // });
                // const data = await response.json();
                
                // For demo purposes, we'll assume success
                showNewsletterMessage('Thank you for subscribing! You\'ll hear from us soon.', 'success');
                this.reset();
                
                // Log to console (for demo)
                console.log('New subscriber:', email);
                
            } catch (error) {
                console.error('Subscription error:', error);
                showNewsletterMessage('Something went wrong. Please try again later.', 'danger');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
            }
        });
    }
    
    // Show newsletter message with animation
    function showNewsletterMessage(message, type = 'info') {
        const messageElement = document.getElementById('newsletterMessage');
        if (!messageElement) return;
        
        // Set message and styles based on type
        messageElement.textContent = message;
        messageElement.className = ''; // Reset classes
        messageElement.classList.add('alert', `alert-${type}`, 'mt-3', 'fade', 'show');
        messageElement.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageElement.classList.remove('show');
            messageElement.classList.add('fade');
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 150);
        }, 5000);
    }
    
    // Add hover effects for social icons
    const socialIcons = document.querySelectorAll('.footer-social a');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.transition = 'all 0.3s ease';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add animation to footer elements on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.footer-section [class*="animate__"]');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate__animated');
            }
        });
    };
    
    // Run once on page load
    animateOnScroll();
    
    // Run on scroll with throttling
    let isAnimating;
    window.addEventListener('scroll', function() {
        clearTimeout(isAnimating);
        isAnimating = setTimeout(animateOnScroll, 50);
    }, { passive: true });
});
