/**
 * Index page initialization module
 * Handles component loading and module initialization for the home page
 */
import { loadComponent } from '../loadComponents.js';
import { initDateTime } from './datetime.js';
import { initSwiper } from './swiper.js';
import './utils.js'; // Import utility functions

/**
 * Components to load for the index page
 * @type {Array<{id: string, path: string, priority: number}>}
 */
const indexComponents = [
    { id: 'header', path: 'components/layout/header.html', priority: 1 },
    { id: 'welcome-section', path: 'components/home-components/welcome-section.html', priority: 2 },
    { id: 'product-gallery', path: 'components/home-components/product-gallery.html', priority: 2 },
    { id: 'recent-product', path: 'components/home-components/recent-product.html', priority: 2 },
    { id: 'before-after', path: 'components/home-components/before-after.html', priority: 2 },
    { id: 'footer', path: 'components/layout/footer.html', priority: 1 }
];

/**
 * Initializes the index page
 * @async
 */
async function initIndex() {
    try {
        console.log('Inițializare pagină principală...');
        
        // Show loading indicator
        document.body.classList.add('loading');
        
        // Group components by priority
        const priorityComponents = indexComponents.filter(comp => comp.priority === 1);
        const standardComponents = indexComponents.filter(comp => comp.priority === 2);
        
        // Load priority components first (header and footer)
        if (priorityComponents.length > 0) {
            await Promise.all(
                priorityComponents.map(component => 
                    loadComponent(component.id, component.path, { fadeIn: true })
                )
            );
        }
        
        // Then load other components
        for (const component of standardComponents) {
            await loadComponent(component.id, component.path);
        }
        
        console.log('Toate componentele au fost încărcate cu succes');

        // Initialize date and time functionality
        initDateTime();

        // Initialize Swiper sliders after components are loaded
        setTimeout(() => {
            initSwiper();
            // Remove loading indicator
            document.body.classList.remove('loading');
            // Add loaded class for animations
            document.body.classList.add('page-loaded');
        }, 100);

    } catch (error) {
        console.error('Eroare la inițializarea paginii:', error);
        document.body.classList.remove('loading');
        document.body.classList.add('error-loading');
        
        // Display error message
        const errorElement = document.createElement('div');
        errorElement.className = 'page-error';
        errorElement.innerHTML = `
            <div class="error-container">
                <h2>A apărut o eroare!</h2>
                <p>Ne pare rău, dar a apărut o eroare la încărcarea paginii.</p>
                <button onclick="window.location.reload()">Reîncarcă pagina</button>
            </div>
        `;
        document.body.appendChild(errorElement);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initIndex);