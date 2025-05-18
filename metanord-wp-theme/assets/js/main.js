/**
 * File main.js.
 *
 * Handles all custom JavaScript functionality for the theme.
 */
(function($) {
    'use strict';

    // When the document is fully loaded
    $(document).ready(function() {
        
        // Initialize animations on scroll
        initScrollAnimations();
        
        // Initialize smooth scrolling for anchor links
        initSmoothScroll();
        
        // Initialize sticky header
        initStickyHeader();
        
        // FAQ accordion functionality
        initFaqAccordion();
        
        // Mobile menu enhancements
        enhanceMobileMenu();
        
        // Add active class to current menu item
        highlightCurrentMenuItem();
        
        // Back to top button
        initBackToTop();
    });

    /**
     * Initialize animations that trigger on scroll
     */
    function initScrollAnimations() {
        // Add .animated class to elements with .fade-in, .fade-in-up, etc. classes when they enter the viewport
        const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right');
        
        if (animatedElements.length) {
            // Initial check on page load
            checkElementsInViewport();
            
            // Check elements on scroll
            window.addEventListener('scroll', checkElementsInViewport);
            
            function checkElementsInViewport() {
                animatedElements.forEach(function(element) {
                    if (isElementInViewport(element) && !element.classList.contains('animated')) {
                        element.classList.add('animated');
                    }
                });
            }
            
            function isElementInViewport(el) {
                const rect = el.getBoundingClientRect();
                return (
                    rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
                    rect.bottom >= 0
                );
            }
        }
    }

    /**
     * Initialize smooth scrolling for anchor links
     */
    function initSmoothScroll() {
        // Smooth scroll for anchor links
        $('a[href*="#"]:not([href="#"]):not([href^="#tab-"]):not([href^="#accordion-"])').on('click', function() {
            if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
                let target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html, body').animate({
                        scrollTop: target.offset().top - 100
                    }, 800);
                    return false;
                }
            }
        });
    }

    /**
     * Initialize sticky header functionality
     */
    function initStickyHeader() {
        // Add sticky class to header on scroll
        const header = document.querySelector('.site-header');
        
        if (header) {
            const topBar = header.querySelector('.top-bar');
            const topBarHeight = topBar ? topBar.offsetHeight : 0;
            const headerHeight = header.offsetHeight;
            
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > topBarHeight) {
                    header.classList.add('sticky');
                    document.body.style.paddingTop = headerHeight + 'px';
                } else {
                    header.classList.remove('sticky');
                    document.body.style.paddingTop = 0;
                }
            });
        }
    }

    /**
     * Initialize FAQ accordion functionality
     */
    function initFaqAccordion() {
        $('.faq-question').on('click', function() {
            const $this = $(this);
            const $parent = $this.parent();
            
            if ($parent.hasClass('active')) {
                $parent.removeClass('active');
                $this.next().slideUp(300);
            } else {
                $('.faq-item.active .faq-question').next().slideUp(300);
                $('.faq-item.active').removeClass('active');
                $parent.addClass('active');
                $this.next().slideDown(300);
            }
        });
    }

    /**
     * Enhance mobile menu functionality
     */
    function enhanceMobileMenu() {
        // Add submenu toggle buttons for mobile navigation
        $('.menu-item-has-children > a').append('<span class="submenu-toggle"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>');
        
        // Toggle submenu on mobile
        $('.submenu-toggle').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).closest('li').toggleClass('submenu-open');
            $(this).closest('li').children('.sub-menu').slideToggle(200);
        });
    }

    /**
     * Highlight current menu item in navigation
     */
    function highlightCurrentMenuItem() {
        // Add .current-menu-item class to appropriate menu item based on current page
        const currentUrl = window.location.href;
        
        $('a').each(function() {
            const linkUrl = $(this).attr('href');
            if (currentUrl === linkUrl) {
                $(this).closest('li').addClass('current-menu-item');
            }
        });
    }

    /**
     * Initialize back to top button functionality
     */
    function initBackToTop() {
        // Add back to top button if it doesn't exist
        if (!$('.back-to-top').length) {
            $('body').append('<a href="#" class="back-to-top" aria-label="' + metanordScreenReaderText.backToTop + '"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg></a>');
        }
        
        const $backToTop = $('.back-to-top');
        
        // Show/hide back to top button based on scroll position
        $(window).on('scroll', function() {
            if ($(this).scrollTop() > 400) {
                $backToTop.addClass('visible');
            } else {
                $backToTop.removeClass('visible');
            }
        });
        
        // Smooth scroll to top when button is clicked
        $backToTop.on('click', function(e) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: 0
            }, 800);
        });
    }

})(jQuery);