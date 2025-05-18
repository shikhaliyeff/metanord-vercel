/**
 * MetaNord Static HTML - Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize mobile menu
  initMobileMenu();
  
  // Initialize scroll animations
  initScrollAnimations();
  
  // Initialize smooth scrolling for anchor links
  initSmoothScroll();
  
  // Initialize contact form validation
  initContactForm();
});

/**
 * Mobile menu functionality
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('mobile-active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!event.target.closest('.mobile-menu-toggle') && !event.target.closest('.nav-menu')) {
        navMenu.classList.remove('mobile-active');
      }
    });
  }
}

/**
 * Scroll animations using Intersection Observer
 */
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) {
    // If browser doesn't support IntersectionObserver, show all elements
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up');
    animatedElements.forEach(el => {
      el.style.opacity = 1;
    });
    return;
  }
  
  const fadeInElements = document.querySelectorAll('.fade-in');
  const fadeInUpElements = document.querySelectorAll('.fade-in-up');
  
  const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        fadeInObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  const fadeInUpObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        fadeInUpObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  fadeInElements.forEach(el => {
    el.style.opacity = 0;
    fadeInObserver.observe(el);
  });
  
  fadeInUpElements.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(20px)';
    fadeInUpObserver.observe(el);
  });
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Contact form validation
 */
function initContactForm() {
  const contactForm = document.querySelector('.contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      const formElements = contactForm.elements;
      
      // Basic validation
      for (let i = 0; i < formElements.length; i++) {
        const element = formElements[i];
        
        if (element.hasAttribute('required') && element.value.trim() === '') {
          isValid = false;
          element.classList.add('error');
          
          // Add error message if it doesn't exist
          let errorMessage = element.parentNode.querySelector('.error-message');
          if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.style.color = '#e54b13';
            errorMessage.style.fontSize = '0.875rem';
            errorMessage.style.marginTop = '0.25rem';
            errorMessage.textContent = 'This field is required.';
            element.parentNode.appendChild(errorMessage);
          }
        } else if (element.type === 'email' && element.value.trim() !== '') {
          // Email validation
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(element.value.trim())) {
            isValid = false;
            element.classList.add('error');
            
            // Add error message
            let errorMessage = element.parentNode.querySelector('.error-message');
            if (!errorMessage) {
              errorMessage = document.createElement('div');
              errorMessage.className = 'error-message';
              errorMessage.style.color = '#e54b13';
              errorMessage.style.fontSize = '0.875rem';
              errorMessage.style.marginTop = '0.25rem';
              errorMessage.textContent = 'Please enter a valid email address.';
              element.parentNode.appendChild(errorMessage);
            } else {
              errorMessage.textContent = 'Please enter a valid email address.';
            }
          }
        }
      }
      
      // Remove error class on focus
      const inputs = contactForm.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('focus', function() {
          this.classList.remove('error');
          const errorMessage = this.parentNode.querySelector('.error-message');
          if (errorMessage) {
            errorMessage.remove();
          }
        });
      });
      
      // If form is valid, show success message (in a real scenario, we would submit to server)
      if (isValid) {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.style.backgroundColor = 'rgba(0, 102, 179, 0.1)';
        successMessage.style.color = '#0066b3';
        successMessage.style.padding = '1rem';
        successMessage.style.borderRadius = '0.25rem';
        successMessage.style.marginTop = '1rem';
        successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
        
        const submitButton = contactForm.querySelector('[type="submit"]');
        contactForm.insertBefore(successMessage, submitButton.nextSibling);
        
        // Clear form
        contactForm.reset();
        
        // Remove success message after 5 seconds
        setTimeout(() => {
          successMessage.remove();
        }, 5000);
      }
    });
  }
}

/**
 * Language switcher functionality
 * 
 * Note: In a real scenario, this would redirect to localized pages or
 * change the language via a backend/CMS. For this static HTML,
 * we're just toggling the active class.
 */
function switchLanguage(lang) {
  const languageOptions = document.querySelectorAll('.language-option');
  
  languageOptions.forEach(option => {
    option.classList.remove('active');
    if (option.getAttribute('data-lang') === lang) {
      option.classList.add('active');
    }
  });
  
  // In a real scenario, we would load translated content here
  console.log(`Language switched to: ${lang}`);
}