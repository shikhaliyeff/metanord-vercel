/**
 * MetaNord - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-navigation');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('toggled');
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !expanded);
        });
    }

    // Submenu Toggle for Mobile
    const hasChildrenItems = document.querySelectorAll('.menu-item-has-children');
    
    hasChildrenItems.forEach(item => {
        const link = item.querySelector('a');
        
        if (window.innerWidth < 992) {
            link.addEventListener('click', (e) => {
                if (!e.target.parentNode.classList.contains('submenu-open')) {
                    e.preventDefault();
                    item.classList.toggle('submenu-open');
                    const subMenu = item.querySelector('.sub-menu');
                    
                    if (subMenu.style.display === 'block') {
                        subMenu.style.display = 'none';
                    } else {
                        subMenu.style.display = 'block';
                    }
                }
            });
        }
    });

    // Back to Top Button
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Language Switcher
    const languageSelect = document.getElementById('language-select');
    
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            const language = e.target.value;
            // In a real implementation, this would redirect to a language-specific URL or set a cookie
            console.log(`Language changed to: ${language}`);
            
            // For demo purposes only
            alert(`Language would change to ${language}. In a real implementation, this would redirect to a language-specific version of the page.`);
        });
    }

    // Animated Scroll to Anchor Links
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Product Image Modals
    const productImages = document.querySelectorAll('.product-image');
    const modalContainer = document.querySelector('.modal-container');
    
    if (productImages.length > 0 && modalContainer) {
        productImages.forEach(image => {
            image.addEventListener('click', () => {
                const imgSrc = image.getAttribute('src');
                const imgAlt = image.getAttribute('alt');
                const modalImg = modalContainer.querySelector('.modal-image');
                const modalCaption = modalContainer.querySelector('.modal-caption');
                
                modalImg.setAttribute('src', imgSrc);
                modalCaption.textContent = imgAlt;
                modalContainer.classList.add('show');
            });
        });

        const closeModal = modalContainer.querySelector('.close-modal');
        
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                modalContainer.classList.remove('show');
            });
        }

        // Close modal on clicking outside
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                modalContainer.classList.remove('show');
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalContainer.classList.contains('show')) {
                modalContainer.classList.remove('show');
            }
        });
    }

    // Contact Form Validation
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            const nameField = contactForm.querySelector('#name');
            const emailField = contactForm.querySelector('#email');
            const messageField = contactForm.querySelector('#message');
            
            // Basic validation
            if (nameField && nameField.value.trim() === '') {
                showError(nameField, 'Please enter your name');
                isValid = false;
            } else if (nameField) {
                removeError(nameField);
            }
            
            if (emailField) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                
                if (emailField.value.trim() === '') {
                    showError(emailField, 'Please enter your email address');
                    isValid = false;
                } else if (!emailPattern.test(emailField.value)) {
                    showError(emailField, 'Please enter a valid email address');
                    isValid = false;
                } else {
                    removeError(emailField);
                }
            }
            
            if (messageField && messageField.value.trim() === '') {
                showError(messageField, 'Please enter your message');
                isValid = false;
            } else if (messageField) {
                removeError(messageField);
            }
            
            if (isValid) {
                // In a real implementation, this would submit the form data to a server
                // For demo purposes, just show a success message
                contactForm.innerHTML = '<div class="success-message"><h3>Thank You!</h3><p>Your message has been sent successfully. We will get back to you soon.</p></div>';
            }
        });

        function showError(field, message) {
            const formGroup = field.closest('.form-group');
            const errorElement = formGroup.querySelector('.error-message') || document.createElement('div');
            
            errorElement.className = 'error-message';
            errorElement.textContent = message;
            
            if (!formGroup.querySelector('.error-message')) {
                formGroup.appendChild(errorElement);
            }
            
            field.classList.add('error');
        }

        function removeError(field) {
            const formGroup = field.closest('.form-group');
            const errorElement = formGroup.querySelector('.error-message');
            
            if (errorElement) {
                formGroup.removeChild(errorElement);
            }
            
            field.classList.remove('error');
        }
    }

    // Filter Products in Product Page
    const productFilter = document.querySelector('.product-filter');
    
    if (productFilter) {
        const filterButtons = productFilter.querySelectorAll('.filter-button');
        const productItems = document.querySelectorAll('.product-item');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter products
                productItems.forEach(item => {
                    if (filter === 'all' || item.classList.contains(filter)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Initialize any sliders or carousels if they exist
    const sliders = document.querySelectorAll('.slider');
    
    if (sliders.length > 0) {
        // Simple manual slider implementation
        sliders.forEach(slider => {
            const slides = slider.querySelectorAll('.slide');
            const nextButton = slider.querySelector('.slider-next');
            const prevButton = slider.querySelector('.slider-prev');
            let currentIndex = 0;
            
            // Show first slide, hide others
            slides.forEach((slide, index) => {
                slide.style.display = index === 0 ? 'block' : 'none';
            });
            
            if (nextButton && prevButton) {
                nextButton.addEventListener('click', () => {
                    slides[currentIndex].style.display = 'none';
                    currentIndex = (currentIndex + 1) % slides.length;
                    slides[currentIndex].style.display = 'block';
                });
                
                prevButton.addEventListener('click', () => {
                    slides[currentIndex].style.display = 'none';
                    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                    slides[currentIndex].style.display = 'block';
                });
            }
        });
    }

    // Accordion Implementation
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    if (accordionItems.length > 0) {
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all accordion items
                accordionItems.forEach(accItem => {
                    accItem.classList.remove('active');
                });
                
                // Open the clicked item if it wasn't already open
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }
});