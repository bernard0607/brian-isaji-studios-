document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        // Add floating label functionality
        const formGroups = form.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            const label = group.querySelector('label');
            
            if (input && label) {
                // Add active class if input has value on page load
                if (input.value.trim() !== '') {
                    group.classList.add('active');
                }
                
                // Add event listeners
                input.addEventListener('focus', () => {
                    group.classList.add('active');
                });
                
                input.addEventListener('blur', () => {
                    if (input.value.trim() === '') {
                        group.classList.remove('active');
                    }
                });
                
                // Handle input changes
                input.addEventListener('input', () => {
                    if (input.value.trim() !== '') {
                        group.classList.add('active');
                    } else {
                        group.classList.remove('active');
                    }
                });
            }
        });
        
        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const submitBtn = form.querySelector('.btn-submit');
            const btnText = submitBtn.querySelector('span');
            const btnIcon = submitBtn.querySelector('i');
            
            // Remove any existing messages
            const existingMessage = form.querySelector('.form-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            // Change button state
            submitBtn.disabled = true;
            btnText.textContent = 'Sending...';
            btnIcon.className = 'fas fa-spinner fa-spin';
            
            // Here you would typically make an AJAX call to your server
            // For demonstration, we'll simulate a successful submission
            setTimeout(() => {
                // Reset form
                form.reset();
                
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.className = 'form-message success';
                successMsg.textContent = 'Your message has been sent successfully!';
                form.appendChild(successMsg);
                
                // Reset button state
                submitBtn.disabled = false;
                btnText.textContent = 'Send Message';
                btnIcon.className = 'fas fa-paper-plane';
                
                // Remove active class from all form groups
                formGroups.forEach(group => {
                    group.classList.remove('active');
                });
                
                // Scroll to show the success message
                successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMsg.style.opacity = '0';
                    setTimeout(() => {
                        successMsg.remove();
                    }, 300);
                }, 5000);
                
            }, 1500);
        });
    }
});
