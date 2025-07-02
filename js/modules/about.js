/**
 * About page functionality
 * @module about
 */

import { loadComponent } from '../loadComponents.js';

/**
 * Manages the About page functionality
 */
class AboutManager {
    /**
     * Creates an instance of AboutManager
     */
    constructor() {
        this.aboutSection = document.querySelector('.about-text');
        this.aboutImages = document.querySelectorAll('.about-image');
        this.aboutTeam = document.querySelector('.about-team');
        this.isAnimationEnabled = window.innerWidth > 768;
        this.observerConfig = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };
    }

    /**
     * Initializes the about page
     * @async
     */
    async init() {
        try {
            console.log('Inițializare pagină despre noi...');
            
            // Show loading state
            document.body.classList.add('loading');
            
            // Load header and footer components with correct paths
            await Promise.all([
                loadComponent('header', '../components/layout/header.html'),
                loadComponent('footer', '../components/layout/footer.html')
            ]);
            
            // Setup functionality
            this.setupAnimations();
            this.setupSchemaMarkup();
            this.setupImageEnhancements();
            
            // Remove loading state
            document.body.classList.remove('loading');
            document.body.classList.add('page-loaded');
            
            console.log('Pagina despre noi inițializată cu succes');
        } catch (error) {
            console.error('Eroare la inițializarea paginii despre noi:', error);
            document.body.classList.remove('loading');
            document.body.classList.add('error-loading');
            
            // Show error message
            if (this.aboutSection) {
                this.aboutSection.innerHTML = `
                    <div class="error-message">
                        <h2>Ne pare rău!</h2>
                        <p>A apărut o eroare la încărcarea paginii. Vă rugăm să încercați din nou mai târziu.</p>
                        <button onclick="window.location.reload()">Reîncărcați pagina</button>
                    </div>
                `;
            }
        }
    }

    /**
     * Sets up animations for the about page elements
     */
    setupAnimations() {
        if (!this.isAnimationEnabled) return;
        
        // Create intersection observer for scroll-based animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    // Unobserve after animation is triggered
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerConfig);
        
        // Observe about section paragraphs
        if (this.aboutSection) {
            const paragraphs = this.aboutSection.querySelectorAll('p');
            paragraphs.forEach((p, index) => {
                p.style.transitionDelay = `${index * 0.1}s`;
                observer.observe(p);
            });
        }
        
        // Observe about images
        this.aboutImages.forEach((img, index) => {
            img.style.transitionDelay = `${index * 0.2}s`;
            observer.observe(img);
        });
        
        // Observe team members
        if (this.aboutTeam) {
            const teamMembers = this.aboutTeam.querySelectorAll('.team-member');
            teamMembers.forEach((member, index) => {
                member.style.transitionDelay = `${index * 0.15}s`;
                observer.observe(member);
            });
        }
    }

    /**
     * Sets up Schema.org markup for better SEO
     */
    setupSchemaMarkup() {
        // Create schema.org markup for the about page
        const schemaScript = document.createElement('script');
        schemaScript.type = 'application/ld+json';
        
        const schemaData = {
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            'name': 'Despre Tapiterie B&B',
            'description': 'Informații despre compania Tapiterie B&B, serviciile oferite și echipa noastră',
            'publisher': {
                '@type': 'Organization',
                'name': 'Tapiterie B&B',
                'logo': {
                    '@type': 'ImageObject',
                    'url': window.location.origin + '/assets/images/logo.png'
                }
            }
        };
        
        schemaScript.textContent = JSON.stringify(schemaData);
        document.head.appendChild(schemaScript);
    }

    /**
     * Sets up image enhancements for the about page
     */
    setupImageEnhancements() {
        // Add hover effects and lightbox functionality
        this.aboutImages.forEach(img => {
            // Add hover effect
            img.addEventListener('mouseenter', () => {
                img.style.transform = 'scale(1.05)';
            });
            
            img.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1)';
            });
            
            // Add lightbox functionality
            img.addEventListener('click', () => {
                this.openLightbox(img.src, img.alt);
            });
            
            // Add accessibility
            img.setAttribute('tabindex', '0');
            img.setAttribute('role', 'button');
            img.setAttribute('aria-label', `Vezi imaginea: ${img.alt}`);
            
            // Add keyboard support
            img.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openLightbox(img.src, img.alt);
                }
            });
        });
    }

    /**
     * Opens a lightbox with the selected image
     * @param {string} src - Source of the image
     * @param {string} alt - Alt text for the image
     */
    openLightbox(src, alt) {
        // Create lightbox if it doesn't exist
        let lightbox = document.getElementById('about-lightbox');
        
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.id = 'about-lightbox';
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <span class="close-lightbox">&times;</span>
                    <img id="lightbox-img" alt="">
                    <p id="lightbox-caption"></p>
                </div>
            `;
            document.body.appendChild(lightbox);
            
            // Add close functionality
            const closeBtn = lightbox.querySelector('.close-lightbox');
            closeBtn.addEventListener('click', () => {
                lightbox.style.display = 'none';
                document.body.classList.remove('lightbox-open');
            });
            
            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && lightbox.style.display === 'flex') {
                    lightbox.style.display = 'none';
                    document.body.classList.remove('lightbox-open');
                }
            });
            
            // Close when clicking outside the image
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    lightbox.style.display = 'none';
                    document.body.classList.remove('lightbox-open');
                }
            });
        }
        
        // Update lightbox content
        const lightboxImg = lightbox.querySelector('#lightbox-img');
        const lightboxCaption = lightbox.querySelector('#lightbox-caption');
        
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightboxCaption.textContent = alt;
        
        // Show lightbox
        lightbox.style.display = 'flex';
        document.body.classList.add('lightbox-open');
    }
}

// Initialize the about page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const aboutManager = new AboutManager();
    aboutManager.init().catch(error => {
        console.error('Eroare la inițializarea paginii despre noi:', error);
    });
});