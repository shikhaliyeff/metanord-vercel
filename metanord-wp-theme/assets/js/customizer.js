/**
 * File customizer.js.
 *
 * Theme Customizer enhancements for a better user experience.
 *
 * Contains handlers to make Theme Customizer preview reload changes asynchronously.
 */

(function($) {
	// Site title and description.
	wp.customize('blogname', function(value) {
		value.bind(function(to) {
			$('.site-title a').text(to);
		});
	});
	
	wp.customize('blogdescription', function(value) {
		value.bind(function(to) {
			$('.site-description').text(to);
		});
	});

	// Header text color.
	wp.customize('header_textcolor', function(value) {
		value.bind(function(to) {
			if ('blank' === to) {
				$('.site-title, .site-description').css({
					clip: 'rect(1px, 1px, 1px, 1px)',
					position: 'absolute',
				});
			} else {
				$('.site-title, .site-description').css({
					clip: 'auto',
					position: 'relative',
				});
				$('.site-title a, .site-description').css({
					color: to,
				});
			}
		});
	});
	
	// Hero Section Settings
	wp.customize('metanord_hero_title', function(value) {
		value.bind(function(to) {
			$('#hero h1').html(function(i, html) {
				// Keep the highlight span intact
				var highlight = $(this).find('.hero-highlight');
				return to + ' <span class="hero-highlight">' + highlight.text() + '</span>';
			});
		});
	});
	
	wp.customize('metanord_hero_title_highlight', function(value) {
		value.bind(function(to) {
			$('#hero h1 .hero-highlight').text(to);
		});
	});
	
	wp.customize('metanord_hero_subtitle', function(value) {
		value.bind(function(to) {
			$('#hero .hero-subtitle').text(to);
		});
	});
	
	wp.customize('metanord_hero_tagline', function(value) {
		value.bind(function(to) {
			$('#hero .hero-tagline').text(to);
		});
	});
	
	// Contact Information Settings
	wp.customize('metanord_company_address', function(value) {
		value.bind(function(to) {
			$('.contact-address span').text(to);
		});
	});
	
	wp.customize('metanord_company_phone', function(value) {
		value.bind(function(to) {
			$('.contact-phone a').text(to);
			$('.contact-phone a').attr('href', 'tel:' + to.replace(/\s+/g, ''));
		});
	});
	
	wp.customize('metanord_company_email', function(value) {
		value.bind(function(to) {
			$('.contact-email a').text(to);
			$('.contact-email a').attr('href', 'mailto:' + to);
		});
	});
	
	wp.customize('metanord_company_website', function(value) {
		value.bind(function(to) {
			$('.contact-website a').text(to);
			$('.contact-website a').attr('href', 'https://' + to);
		});
	});
	
	wp.customize('metanord_registry_code', function(value) {
		value.bind(function(to) {
			$('.registry-info p strong').next().text(to);
		});
	});
	
	// Footer Settings
	wp.customize('metanord_copyright_text', function(value) {
		value.bind(function(to) {
			$('.copyright').html(to);
		});
	});
	
})(jQuery);