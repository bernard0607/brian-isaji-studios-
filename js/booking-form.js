document.addEventListener('DOMContentLoaded', function() {
    // Form validation and submission
    const form = document.getElementById('bookingForm');
    const successMessage = document.getElementById('bookingSuccess');
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('preferredDate').setAttribute('min', today);
    
    // Form submission handler
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Check if form is valid
        if (!form.checkValidity()) {
            event.stopPropagation();
            form.classList.add('was-validated');
            return;
        }
        
        // If form is valid, show success message
        form.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Here you would typically send the form data to a server
        // For now, we'll just log it to the console
        const formData = new FormData(form);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        console.log('Form submitted:', formObject);
        
        // Reset form for demo purposes
        // In a real application, you would redirect or show a success message
        // form.reset();
        // form.classList.remove('was-validated');
    });
    
    // Custom validation for the privacy policy checkbox
    const privacyCheckbox = document.getElementById('privacyPolicy');
    privacyCheckbox.addEventListener('change', function() {
        if (this.checked) {
            this.setCustomValidity('');
        } else {
            this.setCustomValidity('You must agree to the privacy policy to continue.');
        }
    });
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
