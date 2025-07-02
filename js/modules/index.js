import { loadComponent } from '../loadComponents.js';

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
        for (const component of indexComponents) {
            console.log(`Loading component: ${component.id}`);
            await loadComponent(component.id, component.path);
        }
        console.log('All components loaded successfully');

        // Initialize Swiper after components are loaded
        if (typeof Swiper !== 'undefined') {
            new Swiper('.swiper-container', {
                loop: true,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
            });
        }
    } catch (error) {
        console.error('Error initializing index:', error);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initIndex);