document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const bookingForm = document.getElementById('bookingForm');
    const submitButton = bookingForm?.querySelector('button[type="submit"]');
    const submitText = submitButton?.querySelector('.submit-text');
    const bookingSuccess = document.getElementById('bookingSuccess');
    const bookAnotherBtn = document.getElementById('bookAnother');
    
    // Set minimum date to today for date input
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const minDate = yyyy + '-' + mm + '-' + dd;
    const dateInput = document.getElementById('preferredDate');
    if (dateInput) dateInput.min = minDate;
    
    // Form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                // Show loading state
                if (submitButton && submitText) {
                    submitButton.disabled = true;
                    submitText.textContent = 'Sending...';
                    const spinner = submitButton.querySelector('.spinner-border');
                    if (spinner) spinner.classList.remove('d-none');
                }
                
                try {
                    // Prepare form data
                    const formData = new FormData(bookingForm);
                    
                    // Add timestamp
                    formData.append('_date', new Date().toISOString());
                    
                    // Send form data to FormSubmit
                    const response = await fetch(bookingForm.action, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        // Show success message with animation
                        bookingForm.style.opacity = '0';
                        bookingForm.style.transition = 'opacity 0.5s ease';
                        
                        setTimeout(() => {
                            bookingForm.style.display = 'none';
                            if (bookingSuccess) {
                                bookingSuccess.style.display = 'block';
                                bookingSuccess.style.opacity = '0';
                                bookingSuccess.style.transition = 'opacity 0.5s ease';
                                
                                // Force reflow to enable transition
                                bookingSuccess.offsetHeight;
                                bookingSuccess.style.opacity = '1';
                                
                                // Scroll to success message
                                bookingSuccess.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'center'
                                });
                            }
                        }, 500);
                        
                        // Reset form
                        bookingForm.reset();
                        bookingForm.classList.remove('was-validated');
                    } else {
                        throw new Error('Form submission failed');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    showError('There was a problem submitting your booking. Please try again or contact us directly.');
                } finally {
                    // Reset button state
                    if (submitButton && submitText) {
                        submitButton.disabled = false;
                        submitText.textContent = 'Submit Booking';
                        const spinner = submitButton.querySelector('.spinner-border');
                        if (spinner) spinner.classList.add('d-none');
                    }
                }
            }
        });
    }
    
    // Show error message
    function showError(message) {
        // Remove any existing error messages
        const existingError = document.querySelector('.alert.alert-danger');
        if (existingError) {
            existingError.remove();
        }
        
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger mt-3';
        errorDiv.role = 'alert';
        errorDiv.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-exclamation-circle me-2"></i>
                <div>${message}</div>
            </div>
        `;
        
        // Insert error message before the form
        bookingForm.parentNode.insertBefore(errorDiv, bookingForm);
        
        // Scroll to error message
        errorDiv.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        
        // Remove error message after 5 seconds
        setTimeout(() => {
            errorDiv.style.transition = 'opacity 0.5s ease';
            errorDiv.style.opacity = '0';
            setTimeout(() => errorDiv.remove(), 500);
        }, 5000);
    }
    
    // Book another session button
    if (bookAnotherBtn) {
        bookAnotherBtn.addEventListener('click', function() {
            // Hide success message with animation
            if (bookingSuccess) {
                bookingSuccess.style.opacity = '0';
                bookingSuccess.style.transition = 'opacity 0.3s ease';
                
                setTimeout(() => {
                    bookingSuccess.style.display = 'none';
                    
                    // Show form with animation
                    bookingForm.style.display = 'block';
                    bookingForm.style.opacity = '0';
                    bookingForm.offsetHeight; // Force reflow
                    bookingForm.style.opacity = '1';
                    
                    // Scroll to form
                    bookingForm.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 300);
            }
            
            // Reset form
            bookingForm.reset();
            
            // Reset validation
            const invalidFields = bookingForm.querySelectorAll('.is-invalid');
            invalidFields.forEach(field => field.classList.remove('is-invalid'));
        });
    }
    
    // Validate entire form
    function validateForm() {
        if (!bookingForm) return false;
        
        let isValid = true;
        const requiredFields = bookingForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value || !field.value.trim()) {
                isValid = false;
                field.classList.add('is-invalid');
                // Add was-validated class to show validation feedback
                const formGroup = field.closest('.form-group');
                if (formGroup) formGroup.classList.add('was-validated');
            } else {
                field.classList.remove('is-invalid');
                
                // Additional validation for specific fields
                if (field.type === 'email' && !isValidEmail(field.value)) {
                    isValid = false;
                    field.classList.add('is-invalid');
                } else if (field.type === 'tel' && !isValidPhone(field.value)) {
                    isValid = false;
                    field.classList.add('is-invalid');
                }
            }
        });
        
        // Scroll to first invalid field if any
        if (!isValid) {
            const firstInvalid = bookingForm.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        }
        
        return isValid;
    }
    
    // Email validation
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Phone validation
    function isValidPhone(phone) {
        const re = /^[+]?[\s\d-]{10,}$/;
        return re.test(phone);
    }
    
    // Real-time validation on input
    if (bookingForm) {
        bookingForm.addEventListener('input', function(e) {
            const target = e.target;
            if (target.hasAttribute('required')) {
                if (target.value.trim() === '') {
                    target.classList.add('is-invalid');
                } else {
                    target.classList.remove('is-invalid');
                    
                    // Additional validation for specific fields
                    if (target.type === 'email' && !isValidEmail(target.value)) {
                        target.classList.add('is-invalid');
                    } else if (target.type === 'tel' && !isValidPhone(target.value)) {
                        target.classList.add('is-invalid');
                    }
                }
            }
        });
    }
                        showStep(currentStep);
                        updateProgress();
                        bookingForm.style.display = 'block';
                        if (successMessage) {
                            successMessage.style.display = 'none';
                        }
                    }, 5000);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('There was an error submitting your request. Please try again or contact us directly.');
            } finally {
                // Reset submit button
                if (submitButton && submitText && spinner) {
                    submitButton.classList.remove('loading');
                    submitButton.disabled = false;
                    submitText.textContent = 'Submit Booking';
                    spinner.classList.add('d-none');
                }
            }
        }
    });

    // Show the current step
    function showStep(step) {
        formSteps.forEach((formStep, index) => {
            if (index + 1 === step) {
                formStep.style.display = 'block';
                formStep.style.animation = 'fadeIn 0.5s ease forwards';
            } else {
                formStep.style.display = 'none';
            }
        });
    }

    // Update progress indicator
    function updateProgress() {
        progressSteps.forEach((step, index) => {
            if (index + 1 < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (index + 1 === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }

    // Validate current step
    function validateStep(step) {
        let isValid = true;
        const currentFormStep = document.querySelector(`.form-step[data-step="${step}"]`);
        
        if (!currentFormStep) return true;

        const requiredFields = currentFormStep.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
                
                // Additional validation for email
                if (field.type === 'email' && !isValidEmail(field.value)) {
                    field.classList.add('is-invalid');
                    isValid = false;
                }
                
                // Additional validation for phone
                if (field.type === 'tel' && !isValidPhone(field.value)) {
                    field.classList.add('is-invalid');
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    // Email validation
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Phone validation
    function isValidPhone(phone) {
        const re = /^\+?[\d\s\-\(\)]{10,}$/;
        return re.test(phone);
    }

    // Add input event listeners for real-time validation
    bookingForm.addEventListener('input', function(e) {
        const target = e.target;
        if (target.hasAttribute('required')) {
            if (target.value.trim()) {
                target.classList.remove('is-invalid');
            } else {
                target.classList.add('is-invalid');
            }
            
            // Additional validation for email
            if (target.type === 'email' && target.value.trim()) {
                if (isValidEmail(target.value)) {
                    target.classList.remove('is-invalid');
                } else {
                    target.classList.add('is-invalid');
                }
            }
            
            // Additional validation for phone
            if (target.type === 'tel' && target.value.trim()) {
                if (isValidPhone(target.value)) {
                    target.classList.remove('is-invalid');
                } else {
                    target.classList.add('is-invalid');
                }
            }
        }
    });

    // Animate form elements when they become visible
    function animateFormElements() {
        const formGroups = document.querySelectorAll('.form-step.active .form-group');
        formGroups.forEach((group, index) => {
            group.style.opacity = '0';
            group.style.transform = 'translateY(20px)';
            group.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                group.style.opacity = '1';
                group.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Initialize animations for first step
    animateFormElements();

    // Add animation for select elements
    const selectElements = document.querySelectorAll('select');
    selectElements.forEach(select => {
        select.addEventListener('change', function() {
            if (this.value) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    });

    // Add animation for date input
    const dateInput = document.getElementById('preferredDate');
    if (dateInput) {
        dateInput.addEventListener('change', function() {
            if (this.value) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    }
});

                if (sessionTypeInput) {
                    sessionTypeInput.value = this.getAttribute('data-value');
                }
                
                // Close dropdown
                dropdownToggle.setAttribute('aria-expanded', 'false');
                dropdownMenu.classList.remove('show');
                
                // Add visual feedback
                dropdownToggle.classList.add('option-selected');
                setTimeout(() => dropdownToggle.classList.remove('option-selected'), 300);
            });
        });

        // Keyboard navigation
        dropdownToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });

        // Close dropdown when pressing Escape
        dropdownMenu?.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                dropdownToggle.setAttribute('aria-expanded', 'false');
                this.classList.remove('show');
                dropdownToggle.focus();
            }
        });
    }

    // Form validation and submission
    const form = document.getElementById('bookingForm');
    const successMessage = document.getElementById('bookingSuccess');
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('preferredDate');
    if (dateInput) {
        dateInput.setAttribute('min', today);
    }
    
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
