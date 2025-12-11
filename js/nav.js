document.addEventListener('DOMContentLoaded', function() {
    // Navigation Elements
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navItems = document.querySelectorAll('.nav-item');
    const body = document.body;

    // Add scroll event for header
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Update active nav link based on scroll position
        const scrollPosition = window.scrollY + 100;
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Mobile menu toggle
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navbarCollapse.classList.toggle('show');
        body.style.overflow = body.style.overflow === 'hidden' ? '' : 'hidden';
    }

    // Close mobile menu when clicking a nav link
    function closeMenu() {
        hamburger.classList.remove('active');
        navbarCollapse.classList.remove('show');
        body.style.overflow = '';
    }

    // Smooth scrolling for anchor links
    function smoothScroll(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Initialize navigation
    function initNavigation() {
        // Set initial header state
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        }
        
        // Set initial active link
        const currentSection = document.querySelector('section:first-of-type');
        if (currentSection) {
            const currentId = currentSection.getAttribute('id');
            navLinks.forEach(link => {
                if (link.getAttribute('href') === `#${currentId}`) {
                    link.classList.add('active');
                }
            });
        }
        
        // Add animation delay to mobile menu items
        navItems.forEach((item, index) => {
            item.style.setProperty('--i', index);
        });
    }

    // Event Listeners
    window.addEventListener('scroll', handleScroll);
    hamburger.addEventListener('click', toggleMenu);
    
    // Add click event to all nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            smoothScroll.call(this, e);
            closeMenu();
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        const isClickInside = header.contains(e.target);
        if (!isClickInside && navbarCollapse.classList.contains('show')) {
            closeMenu();
        }
    });

    // Initialize navigation
    initNavigation();

    // Add touch event for better mobile experience
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        // If swiped left and menu is open, close it
        if (touchEndX < touchStartX && navbarCollapse.classList.contains('show')) {
            closeMenu();
        }
    }
});
