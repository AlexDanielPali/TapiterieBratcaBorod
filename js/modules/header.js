class HeaderManager {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navbar = document.querySelector('.navbar');
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => this.toggleMenu());

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.navbar.contains(e.target) && !this.hamburger.contains(e.target)) {
                    this.closeMenu();
                }
            });

            // Close menu when resizing to desktop view
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    this.closeMenu();
                }
            });
        }
    }

    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navbar.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navbar.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HeaderManager();
});