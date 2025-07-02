import { loadComponent } from '../loadComponents.js';

class ContactManager {
    constructor() {
        this.mapFrame = document.querySelector('.map-box iframe');
        this.contactLinks = document.querySelectorAll('.contact-details a');
        this.socialButtons = document.querySelectorAll('.contact-social-button');
    }

    async init() {
        try {
            console.log('Initializing contact page...');
            
            // Load header and footer components
            await Promise.all([
                loadComponent('header', '../components/layout/header.html'),
                loadComponent('footer', '../components/layout/footer.html')
            ]);

            this.setupMapLoading();
            this.setupInteractions();
            
            console.log('Contact page initialized successfully');
        } catch (error) {
            console.error('Error initializing contact page:', error);
        }
    }

    setupMapLoading() {
        if (this.mapFrame) {
            this.mapFrame.addEventListener('load', () => {
                this.mapFrame.style.opacity = '1';
            });
        }
    }

    setupInteractions() {
        // Setup contact link hover effects
        this.contactLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.color = 'var(--primary-color)';
            });
            link.addEventListener('mouseleave', () => {
                link.style.color = 'inherit';
            });
        });

        // Setup social button hover effects
        this.socialButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateX(var(--spacing-xs))';
            });
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateX(0)';
            });
        });
    }
}

// Initialize contact page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const contact = new ContactManager();
    contact.init().catch(error => {
        console.error('Failed to initialize contact page:', error);
    });
});