// Initialize flatpickr for date picker
if (typeof flatpickr !== 'undefined') {
    flatpickr(".date-picker", {
        dateFormat: "Y-m-d",
        minDate: "today",
        disable: [
            function(date) {
                // Disable Sundays (0 = Sunday, 6 = Saturday)
                return (date.getDay() === 0);
            }
        ],
        locale: {
            firstDayOfWeek: 1 // Start week on Monday
        },
        allowInput: true,
        clickOpens: true,
        theme: "dark",
        position: "auto",
        static: true,
        monthSelectorType: 'static',
        prevArrow: '<i class="fas fa-chevron-left"></i>',
        nextArrow: '<i class="fas fa-chevron-right"></i>',
        onOpen: function(selectedDates, dateStr, instance) {
            // Add custom class when date picker is open
            instance.calendarContainer.classList.add('custom-datepicker');
        },
        onClose: function(selectedDates, dateStr, instance) {
            // Remove custom class when date picker is closed
            instance.calendarContainer.classList.remove('custom-datepicker');
            // Trigger change event for validation
            if (dateStr) {
                $(instance.input).trigger('change');
            }
        }
    });
}

(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $('.navbar').addClass('position-fixed bg-dark shadow-sm');
        } else {
            $('.navbar').removeClass('position-fixed bg-dark shadow-sm');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonials carousel
    $('.testimonial-carousel').owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        loop: true,
        nav: false,
        dots: true,
        items: 1,
        dotsData: true,
    });

    
})(jQuery);

