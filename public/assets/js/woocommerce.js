/**
 * File woocommerce.js.
 *
 * WooCommerce specific scripts for enhancing the shopping experience.
 */
(function($) {
    'use strict';

    // When the document is fully loaded
    $(document).ready(function() {
        
        // Enhanced cart dropdown functionality
        enhanceCartDropdown();
        
        // Quantity input functionality
        enhanceQuantityButtons();
        
        // Product gallery enhancements
        enhanceProductGallery();
        
        // Enhanced mobile product filtering
        enhanceMobileProductFilter();
        
        // Add input labels to forms
        enhanceCheckoutForms();
    });

    /**
     * Enhance cart dropdown functionality
     */
    function enhanceCartDropdown() {
        // Show/hide the cart dropdown on hover/click
        const $cartIcon = $('.site-header-cart');
        
        if ($cartIcon.length) {
            // On larger screens, show the dropdown on hover
            if (window.innerWidth > 768) {
                $cartIcon.hover(
                    function() {
                        $(this).addClass('active');
                        $(this).find('.cart-dropdown').fadeIn(300);
                    },
                    function() {
                        $(this).removeClass('active');
                        $(this).find('.cart-dropdown').fadeOut(300);
                    }
                );
            } else {
                // On smaller screens, toggle the dropdown on click
                $cartIcon.on('click', function(e) {
                    e.stopPropagation();
                    $(this).toggleClass('active');
                    $(this).find('.cart-dropdown').fadeToggle(300);
                });
                
                // Close dropdown when clicking elsewhere
                $(document).on('click', function(e) {
                    if (!$(e.target).closest('.site-header-cart').length) {
                        $('.site-header-cart').removeClass('active');
                        $('.cart-dropdown').fadeOut(300);
                    }
                });
            }
        }
    }

    /**
     * Enhance quantity input with plus/minus buttons
     */
    function enhanceQuantityButtons() {
        // Add plus/minus buttons to quantity inputs
        $('.quantity').each(function() {
            const $this = $(this);
            const $input = $this.find('input[type="number"]');
            
            if (!$this.find('.quantity-button').length) {
                $this.prepend('<span class="quantity-button quantity-down">-</span>');
                $this.append('<span class="quantity-button quantity-up">+</span>');
                
                // Handle clicks on the buttons
                $this.find('.quantity-button').on('click', function() {
                    const $button = $(this);
                    const oldValue = parseFloat($input.val());
                    let newVal;
                    
                    if ($button.hasClass('quantity-up')) {
                        newVal = oldValue + 1;
                    } else {
                        // Don't allow decrementing below 1
                        newVal = (oldValue > 1) ? oldValue - 1 : 1;
                    }
                    
                    $input.val(newVal);
                    $input.trigger('change');
                });
            }
        });
    }

    /**
     * Enhance product gallery with additional features
     */
    function enhanceProductGallery() {
        // Only run on single product pages with a gallery
        if ($('.woocommerce-product-gallery').length) {
            // Add fullscreen button to product gallery
            const $gallery = $('.woocommerce-product-gallery');
            
            if (!$gallery.find('.fullscreen-button').length) {
                $gallery.append('<button class="fullscreen-button" aria-label="View fullscreen"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg></button>');
                
                // Handle fullscreen button click
                $gallery.find('.fullscreen-button').on('click', function() {
                    const $featuredImg = $gallery.find('.woocommerce-product-gallery__image:first a');
                    if ($featuredImg.length) {
                        $featuredImg.trigger('click');
                    }
                });
            }
        }
    }

    /**
     * Enhance mobile product filtering for WooCommerce
     */
    function enhanceMobileProductFilter() {
        // Add a filter toggle button for mobile
        if ($('.woocommerce-shop').length && $('.widget-area').length) {
            if (!$('.filter-toggle-button').length) {
                $('.woocommerce-products-header').append('<button class="filter-toggle-button">Filter <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg></button>');
                
                // Toggle filter sidebar
                $('.filter-toggle-button').on('click', function() {
                    $('.widget-area').toggleClass('filter-visible');
                    $('body').toggleClass('filter-active');
                });
                
                // Add an overlay and close button
                $('body').append('<div class="filter-overlay"></div>');
                $('.widget-area').prepend('<button class="filter-close-button"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>');
                
                // Close filter when overlay or close button is clicked
                $('.filter-overlay, .filter-close-button').on('click', function() {
                    $('.widget-area').removeClass('filter-visible');
                    $('body').removeClass('filter-active');
                });
            }
        }
    }

    /**
     * Add floating labels to checkout forms
     */
    function enhanceCheckoutForms() {
        // Add floating label support to checkout fields
        $('.woocommerce-checkout .form-row, .woocommerce-account .form-row, .woocommerce-cart .form-row').each(function() {
            const $this = $(this);
            const $input = $this.find('input, textarea, select');
            const $label = $this.find('label');
            
            if ($input.length && $label.length) {
                // Add focused class when field is focused
                $input.on('focus', function() {
                    $this.addClass('focused');
                }).on('blur', function() {
                    if (!$(this).val()) {
                        $this.removeClass('focused');
                    }
                });
                
                // Check if field already has value on page load
                if ($input.val()) {
                    $this.addClass('focused');
                }
            }
        });
    }

})(jQuery);