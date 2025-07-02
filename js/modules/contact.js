/**
 * Contact page functionality
 * @module contact
 */

import { loadComponent } from '../loadComponents.js';

/**
 * Manages contact page functionality
 */
class ContactManager {
    /**
     * Creates an instance of ContactManager
     */
    constructor() {
        this.mapFrame = document.querySelector('.map-box iframe');
        this.contactLinks = document.querySelectorAll('.contact-details a');
        this.socialButtons = document.querySelectorAll('.contact-social-button');
        this.contactForm = document.querySelector('.contact-form form');
    }

    /**
     * Initializes the contact page
     * @async
     */
    async init() {
        try {
            console.log('Inițializare pagină contact...');
            document.body.classList.add('loading');
            
            // Load header and footer components
            await Promise.all([
                loadComponent('header', '../components/layout/header.html'),
                loadComponent('footer', '../components/layout/footer.html')
            ]);

            // Setup page elements
            this.setupMapLoading();
            this.setupInteractions();
            this.setupContactForm();
            this.setupSchemaMarkup();
            
            document.body.classList.remove('loading');
            document.body.classList.add('page-loaded');
            console.log('Pagină contact inițializată cu succes');
        } catch (error) {
            console.error('Eroare la inițializarea paginii de contact:', error);
            document.body.classList.remove('loading');
            document.body.classList.add('error');
            
            // Show error message
            const errorElement = document.createElement('div');
            errorElement.className = 'page-error';
            errorElement.innerHTML = `
                <div class="error-container">
                    <h2>A apărut o eroare!</h2>
                    <p>Ne pare rău, dar a apărut o eroare la încărcarea paginii de contact.</p>
                    <button onclick="window.location.reload()">Reîncarcă pagina</button>
                </div>
            `;
            document.body.appendChild(errorElement);
        }
    }

    /**
     * Sets up map loading with placeholders
     */
    setupMapLoading() {
        if (!this.mapFrame) return;
        
        // Add loading placeholder
        const mapContainer = this.mapFrame.parentElement;
        const placeholder = document.createElement('div');
        placeholder.className = 'map-loading-placeholder';
        placeholder.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Se încarcă harta...</p>
        `;
        mapContainer.appendChild(placeholder);
        
        // Hide placeholder when map loads
        this.mapFrame.addEventListener('load', () => {
            this.mapFrame.style.opacity = '1';
            placeholder.style.opacity = '0';
            setTimeout(() => {
                placeholder.remove();
            }, 300);
        });
        
        // Add error handling
        this.mapFrame.addEventListener('error', () => {
            placeholder.innerHTML = `
                <div class="map-error">
                    <p>Nu s-a putut încărca harta.</p>
                    <button onclick="window.location.reload()">Reîncarcă</button>
                </div>
            `;
        });
    }

    /**
     * Sets up contact interactions
     */
    setupInteractions() {
        // Setup contact link hover effects
        this.contactLinks.forEach(link => {
            // Add hover effects
            link.addEventListener('mouseenter', () => {
                link.style.color = 'var(--primary-color)';
                link.style.transform = 'translateX(5px)';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.color = 'inherit';
                link.style.transform = 'translateX(0)';
            });
            
            // Add focus effects for accessibility
            link.addEventListener('focus', () => {
                link.style.color = 'var(--primary-color)';
                link.style.transform = 'translateX(5px)';
                link.style.outline = '2px solid var(--primary-color)';
            });
            
            link.addEventListener('blur', () => {
                link.style.color = 'inherit';
                link.style.transform = 'translateX(0)';
                link.style.outline = 'none';
            });
        });

        // Setup social button hover effects
        this.socialButtons.forEach(button => {
            // Add hover effects
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-5px)';
                button.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = 'none';
            });
            
            // Add focus effects for accessibility
            button.addEventListener('focus', () => {
                button.style.transform = 'translateY(-5px)';
                button.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                button.style.outline = '2px solid var(--primary-color)';
            });
            
            button.addEventListener('blur', () => {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = 'none';
                button.style.outline = 'none';
            });
        });
    }

    /**
     * Sets up contact form validation and submission
     */
    setupContactForm() {
        if (!this.contactForm) return;
        
        // Add input validation
        const inputs = this.contactForm.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Add validation on blur
            input.addEventListener('blur', () => {
                this.validateInput(input);
            });
            
            // Clear validation on focus
            input.addEventListener('focus', () => {
                const errorElement = input.parentElement.querySelector('.input-error');
                if (errorElement) {
                    errorElement.remove();
                }
                input.classList.remove('invalid');
            });
        });
        
        // Form submission
        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate all inputs
            let isValid = true;
            inputs.forEach(input => {
                if (!this.validateInput(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                // Show success message (in real app, would submit form)
                const formContainer = this.contactForm.parentElement;
                this.contactForm.style.opacity = '0';
                
                setTimeout(() => {
                    this.contactForm.style.display = 'none';
                    
                    const successMessage = document.createElement('div');
                    successMessage.className = 'form-success-message';
                    successMessage.innerHTML = `
                        <h3>Mesaj trimis cu succes!</h3>
                        <p>Vă mulțumim pentru mesajul dumneavoastră. Vă vom contacta în curând.</p>
                        <button onclick="window.location.reload()">Trimite alt mesaj</button>
                    `;
                    
                    formContainer.appendChild(successMessage);
                    
                    // Animate success message
                    setTimeout(() => {
                        successMessage.style.opacity = '1';
                    }, 50);
                }, 300);
            }
        });
    }

    /**
     * Validates a form input
     * @param {HTMLInputElement|HTMLTextAreaElement} input - The input to validate
     * @returns {boolean} Whether the input is valid
     */
    validateInput(input) {
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error message
        const existingError = input.parentElement.querySelector('.input-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Check if input is empty
        if (input.required && !input.value.trim()) {
            isValid = false;
            errorMessage = 'Acest câmp este obligatoriu';
        }
        // Check email format
        else if (input.type === 'email' && input.value.trim()) {
            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailPattern.test(input.value.trim())) {
                isValid = false;
                errorMessage = 'Adresa de email invalidă';
            }
        }
        // Check phone format
        else if (input.type === 'tel' && input.value.trim()) {
            const phonePattern = /^[0-9+\s()-]{8,}$/;
            if (!phonePattern.test(input.value.trim())) {
                isValid = false;
                errorMessage = 'Număr de telefon invalid';
            }
        }
        
        // Show error if invalid
        if (!isValid) {
            const errorElement = document.createElement('div');
            errorElement.className = 'input-error';
            errorElement.textContent = errorMessage;
            input.parentElement.appendChild(errorElement);
            input.classList.add('invalid');
        } else {
            input.classList.remove('invalid');
        }
        
        return isValid;
    }

    /**
     * Sets up Schema.org markup for better SEO
     */
    setupSchemaMarkup() {
        // Create schema.org markup for the contact page
        const schemaScript = document.createElement('script');
        schemaScript.type = 'application/ld+json';
        
        const schemaData = {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            'name': 'Contact Tapiterie B&B',
            'description': 'Informații de contact pentru Tapiterie B&B',
            'url': window.location.href,
            'contactPoint': {
                '@type': 'ContactPoint',
                'telephone': '+40712345678', // Replace with actual phone
                'contactType': 'customer service',
                'availableLanguage': ['Romanian', 'English']
            }
        };
        
        schemaScript.textContent = JSON.stringify(schemaData);
        document.head.appendChild(schemaScript);
    }
}

// Initialize contact page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const contactManager = new ContactManager();
    contactManager.init().catch(error => {
        console.error('Eroare la inițializarea paginii de contact:', error);
    });
});