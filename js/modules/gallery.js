import { loadComponent } from '../loadComponents.js';
import { galleryConfig } from '../config/galleryConfig.js';

class GalleryManager {
    constructor() {
        this.init();
    }

    getCurrentCategory() {
        // Get filename without extension
        const pathname = window.location.pathname;
        const filename = pathname.split('/').pop().replace('.html', '');
        return filename;
    }

    async init() {
        try {
            console.log('Initializing gallery...');
            
            // Load header and footer
            await Promise.all([
                loadComponent('header', '../components/layout/header.html'),
                loadComponent('footer', '../components/layout/footer.html')
            ]);

            // Load gallery images
            const category = this.getCurrentCategory();
            const galleryElement = document.getElementById('category-gallery');
            
            if (galleryElement && galleryConfig[category]) {
                this.loadImages(galleryConfig[category].images, galleryElement);
                console.log(`Loaded images for category: ${category}`);
            } else {
                console.error(`No config found for category: ${category}`);
            }
        } catch (error) {
            console.error('Gallery initialization error:', error);
        }
    }

    loadImages(images, container) {
        const fragment = document.createDocumentFragment();

        images.forEach(image => {
            const wrapper = document.createElement('div');
            wrapper.className = 'gallery-image-wrapper';

            const img = document.createElement('img');
            img.src = image.src;
            img.alt = image.alt;
            img.loading = 'lazy';
            img.className = 'gallery-image';

            wrapper.appendChild(img);
            fragment.appendChild(wrapper);
        });

        container.appendChild(fragment);
    }
}

// Initialize gallery
document.addEventListener('DOMContentLoaded', () => {
    new GalleryManager();
});