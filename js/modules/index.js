import { loadComponent } from '../loadComponents.js';
import { initDateTime } from './datetime.js';
import { initSwiper } from './swiper.js';
import './utils.js'; // Import utility functions

const indexComponents = [
    { id: 'header', path: 'components/layout/header.html' },
    { id: 'welcome-section', path: 'components/home-components/welcome-section.html' },
    { id: 'product-gallery', path: 'components/home-components/product-gallery.html' },
    { id: 'recent-product', path: 'components/home-components/recent-product.html' },
    { id: 'before-after', path: 'components/home-components/before-after.html' },
    { id: 'footer', path: 'components/layout/footer.html' }
];

async function initIndex() {
    try {
        console.log('Initializing index page...');
        
        // Load all components
        for (const component of indexComponents) {
            console.log(`Loading component: ${component.id}`);
            await loadComponent(component.id, component.path);
        }
        console.log('All components loaded successfully');

        // Initialize date and time functionality
        initDateTime();

        // Initialize Swiper sliders after components are loaded
        setTimeout(() => {
            initSwiper();
        }, 100);

    } catch (error) {
        console.error('Error initializing index:', error);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initIndex);