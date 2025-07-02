import { loadComponent } from '../loadComponents.js'; // Fixed import path

class AboutManager {
    constructor() {
        this.aboutSection = document.querySelector('.about-text');
    }

    async init() {
        try {
            console.log('Initializing about page...');
            // Load header and footer components with correct paths
            await Promise.all([
                loadComponent('header', '../components/layout/header.html'),
                loadComponent('footer', '../components/layout/footer.html')
            ]);

            this.setupAnimations();
            console.log('About page initialized successfully');
        } catch (error) {
            console.error('Error initializing about page:', error);
        }
    }

    // ...rest of the existing code...
}

// Initialize the about page
document.addEventListener('DOMContentLoaded', () => {
    const aboutManager = new AboutManager();
    aboutManager.init().catch(error => {
        console.error('Failed to initialize about page:', error);
    });
});