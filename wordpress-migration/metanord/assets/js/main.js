/**
 * MetaNord Theme Main JavaScript File
 * 
 * This file handles animations, interactions, and other JavaScript
 * functionality for the MetaNord WordPress theme.
 */

(function($) {
  'use strict';

  // Document ready function
  $(document).ready(function() {
    initMobileMenu();
    initScrollAnimations();
    initProductGallery();
    initLanguageSwitcher();
    initSmoothScroll();
  });

  /**
   * Mobile menu functionality
   */
  function initMobileMenu() {
    const menuToggle = $('.menu-toggle');
    const primaryMenuContainer = $('.primary-menu-container');

    menuToggle.on('click', function() {
      $(this).toggleClass('active');
      primaryMenuContainer.toggleClass('active');
    });

    // Close menu when clicking outside
    $(document).on('click', function(event) {
      if (!$(event.target).closest('.main-navigation').length) {
        menuToggle.removeClass('active');
        primaryMenuContainer.removeClass('active');
      }
    });

    // Handle submenus in mobile view
    $('.menu-item-has-children > a').on('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        $(this).siblings('.sub-menu').slideToggle();
        $(this).parent().toggleClass('submenu-active');
      }
    });
  }

  /**
   * Scroll animations using Intersection Observer
   */
  function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
      // If browser doesn't support IntersectionObserver, show all elements
      $('[data-animation]').css('opacity', 1);
      return;
    }

    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Get the animation data attributes
          const animationElement = entry.target;
          const animationName = animationElement.getAttribute('data-animation');
          const animationDelay = animationElement.getAttribute('data-animation-delay') || 0;
          
          // Set the animation with delay
          setTimeout(() => {
            animationElement.style.animationName = animationName;
            animationElement.style.opacity = 1;
          }, animationDelay * 1000);
          
          // Unobserve the element after animating
          animationObserver.unobserve(animationElement);
        }
      });
    }, {
      threshold: 0.15
    });

    // Observe all elements with data-animation attribute
    document.querySelectorAll('[data-animation]').forEach(element => {
      animationObserver.observe(element);
    });
  }

  /**
   * Product gallery and image zoom functionality
   */
  function initProductGallery() {
    // Only run on product pages
    if (!$('.woocommerce-product-gallery').length) return;

    // Initialize image zoom on product gallery images
    $('.woocommerce-product-gallery__image a').each(function() {
      $(this).zoom({
        url: $(this).attr('href'),
        touch: false
      });
    });

    // Handle thumbnail clicks
    $('.woocommerce-product-gallery__image').on('click', function(e) {
      e.preventDefault();
      const imageUrl = $(this).find('a').attr('href');
      $('.woocommerce-product-gallery__image:first-child img').attr('src', imageUrl);
      $('.woocommerce-product-gallery__image:first-child a').attr('href', imageUrl);
      
      // Re-initialize zoom on main image
      $('.woocommerce-product-gallery__image:first-child a').trigger('zoom.destroy').zoom({
        url: imageUrl,
        touch: false
      });
    });
  }

  /**
   * Language switcher functionality
   */
  function initLanguageSwitcher() {
    // Add active class to current language
    const currentLang = $('html').attr('lang');
    if (currentLang) {
      $(`.language-switcher a[hreflang="${currentLang}"]`).addClass('active');
    }
  }

  /**
   * Smooth scrolling for anchor links
   */
  function initSmoothScroll() {
    $('a[href*="#"]:not([href="#"])').on('click', function() {
      if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && 
          location.hostname === this.hostname) {
        let target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        
        if (target.length) {
          $('html, body').animate({
            scrollTop: target.offset().top - 80 // Adjust for header height
          }, 800);
          
          return false;
        }
      }
    });
  }

  /**
   * Handle contact form submission with AJAX
   */
  $(document).on('submit', '.contact-form', function(e) {
    // Only handle non-plugin forms
    if ($(this).closest('.wpcf7').length) return;
    
    e.preventDefault();
    
    const $form = $(this);
    const $submitBtn = $form.find('[type="submit"]');
    const $responseMessage = $form.find('.response-message');
    
    // Disable submit button and show loading state
    $submitBtn.prop('disabled', true).addClass('loading');
    
    // Send AJAX request
    $.ajax({
      type: 'POST',
      url: $form.attr('action'),
      data: $form.serialize(),
      success: function(response) {
        if (response.success) {
          $responseMessage.html('<div class="success-message">' + response.data + '</div>');
          $form[0].reset();
        } else {
          $responseMessage.html('<div class="error-message">' + response.data + '</div>');
        }
      },
      error: function() {
        $responseMessage.html('<div class="error-message">An error occurred. Please try again.</div>');
      },
      complete: function() {
        $submitBtn.prop('disabled', false).removeClass('loading');
      }
    });
  });

  /**
   * Initialize product filtering on archive pages
   */
  function initProductFiltering() {
    // Only run on product archive pages
    if (!$('.woocommerce-products-header').length) return;

    $('.product-filter-item').on('click', function(e) {
      e.preventDefault();
      const category = $(this).data('filter');
      
      if (category === 'all') {
        $('.products .product').fadeIn();
      } else {
        $('.products .product').hide();
        $(`.products .product.${category}`).fadeIn();
      }
      
      // Update active class
      $('.product-filter-item').removeClass('active');
      $(this).addClass('active');
    });
  }

  /**
   * Handle newsletter form submission
   */
  $(document).on('submit', '.newsletter-form', function(e) {
    e.preventDefault();
    
    const $form = $(this);
    const $submitBtn = $form.find('[type="submit"]');
    const $emailInput = $form.find('[type="email"]');
    const email = $emailInput.val();
    
    if (!email || !isValidEmail(email)) {
      alert('Please enter a valid email address');
      $emailInput.focus();
      return;
    }
    
    // Disable submit button and show loading state
    $submitBtn.prop('disabled', true).addClass('loading');
    
    // Send AJAX request
    $.ajax({
      type: 'POST',
      url: $form.attr('action'),
      data: $form.serialize(),
      success: function(response) {
        if (response.success) {
          alert('Thank you for subscribing to our newsletter!');
          $form[0].reset();
        } else {
          alert(response.data || 'An error occurred. Please try again.');
        }
      },
      error: function() {
        alert('An error occurred. Please try again.');
      },
      complete: function() {
        $submitBtn.prop('disabled', false).removeClass('loading');
      }
    });
  });

  /**
   * Helper function to validate email
   */
  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

})(jQuery);