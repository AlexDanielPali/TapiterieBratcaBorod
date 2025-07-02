/**
 * Header functionality
 * @module header
 */

/**
 * Manages the website header functionality
 */
class HeaderManager {
    /**
     * Creates an instance of HeaderManager
     */
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navbar = document.querySelector('.navbar');
        this.navLinks = document.querySelectorAll('.navbar a');
        this.header = document.querySelector('header');
        this.logo = document.querySelector('.logo img');
        this.lastScrollY = window.scrollY;
        this.ticking = false;
        
        this.setupEventListeners();
        this.detectActivePage();
    }

    /**
     * Sets up event listeners for the header
     */
    setupEventListeners() {
        if (this.hamburger) {
            // Add ARIA attributes for accessibility
            this.hamburger.setAttribute('aria-label', 'Meniu');
            this.hamburger.setAttribute('aria-expanded', 'false');
            this.hamburger.setAttribute('aria-controls', 'navbar');
            this.hamburger.setAttribute('tabindex', '0');
            
            // Handle hamburger click
            this.hamburger.addEventListener('click', () => this.toggleMenu());
            
            // Handle keyboard navigation
            this.hamburger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleMenu();
                }
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (this.navbar && this.hamburger && 
                    !this.navbar.contains(e.target) && 
                    !this.hamburger.contains(e.target)) {
                    this.closeMenu();
                }
            });

            // Close menu when pressing escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMenu();
                }
            });

            // Close menu when resizing to desktop view (with debounce)
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    if (window.innerWidth > 768) {
                        this.closeMenu();
                    }
                }, 250);
            });
            
            // Handle scroll events for header animations
            window.addEventListener('scroll', () => {
                this.lastScrollY = window.scrollY;
                
                if (!this.ticking) {
                    window.requestAnimationFrame(() => {
                        this.handleScrollAnimation();
                        this.ticking = false;
                    });
                    
                    this.ticking = true;
                }
            });
        }
        
        // Add hover animations to nav links
        this.navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-2px)';
                link.style.color = 'var(--primary-color)';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateY(0)';
                link.style.color = '';
            });
        });
    }

    /**
     * Toggles the mobile menu
     */
    toggleMenu() {
        const isExpanded = this.hamburger.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    /**
     * Opens the mobile menu
     */
    openMenu() {
        this.hamburger.classList.add('active');
        this.navbar.classList.add('active');
        document.body.classList.add('menu-open');
        this.hamburger.setAttribute('aria-expanded', 'true');
        
        // Animate menu items
        const menuItems = this.navbar.querySelectorAll('li');
        menuItems.forEach((item, index) => {
            item.style.animation = `fadeInRight 0.3s ease forwards ${index * 0.1}s`;
            item.style.opacity = '1';
        });
        
        // Set focus trap
        setTimeout(() => {
            const firstItem = this.navbar.querySelector('a');
            if (firstItem) firstItem.focus();
        }, 100);
    }

    /**
     * Closes the mobile menu
     */
    closeMenu() {
        if (!this.hamburger || !this.navbar) return;
        
        this.hamburger.classList.remove('active');
        this.navbar.classList.remove('active');
        document.body.classList.remove('menu-open');
        this.hamburger.setAttribute('aria-expanded', 'false');
        
        // Remove animations
        const menuItems = this.navbar.querySelectorAll('li');
        menuItems.forEach(item => {
            item.style.animation = '';
        });
    }

    /**
     * Detects and highlights the active page in the navigation
     */
    detectActivePage() {
        const currentPath = window.location.pathname;
        const filename = currentPath.split('/').pop();
        
        this.navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            
            if (linkPath === filename || 
                (filename === '' && linkPath === 'index.html') ||
                (linkPath === '/' && filename === '') ||
                (linkPath === 'index.html' && filename === '')) {
                
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    /**
     * Handles scroll animations for the header
     */
    handleScrollAnimation() {
        if (!this.header) return;
        
        if (this.lastScrollY > 100) {
            // Scrolled down - shrink header
            this.header.classList.add('scrolled');
            if (this.logo) {
                this.logo.style.maxHeight = '40px';
            }
        } else {
            // At top - normal header
            this.header.classList.remove('scrolled');
            if (this.logo) {
                this.logo.style.maxHeight = '';
            }
        }
    }
}

/**
 * Initializes search functionality
 */
function initSearch() {
    const searchIcon = document.querySelector('.search-icon');
    const searchInput = document.querySelector('.search-input');
    
    if (!searchIcon || !searchInput) return;
    
    searchIcon.addEventListener('click', () => {
        searchInput.classList.toggle('active');
        
        if (searchInput.classList.contains('active')) {
            searchInput.focus();
        }
    });
    
    // Close search when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchIcon.contains(e.target) && !searchInput.contains(e.target)) {
            searchInput.classList.remove('active');
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HeaderManager();
    initSearch();
});