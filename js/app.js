/**
 * Main application entry point
 * This file serves as a central initialization point for all app modules
 * @module app
 */

import { loadComponent, clearComponentCache } from './loadComponents.js';
import { initSwiper } from './modules/swiper.js';
import { initHeader } from './modules/header.js';
import './modules/utils.js';

// Only import debug in development mode
const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
if (isDevelopment) {
    import('./debugTest.js').then(debug => {
        window.debugTools = debug;
        console.log('Debug tools loaded. Access via window.debugTools');
    });
}

/**
 * Components for the main page
 * @type {Array<{id: string, path: string, priority: number}>}
 */
const mainComponents = [
    { id: 'header', path: 'components/layout/header.html', priority: 1 },
    { id: 'welcome-section', path: 'components/home-components/welcome-section.html', priority: 2 },
    { id: 'product-gallery', path: 'components/home-components/product-gallery.html', priority: 2 },
    { id: 'recent-product', path: 'components/home-components/recent-product.html', priority: 2 },
    { id: 'before-after', path: 'components/home-components/before-after.html', priority: 2 },
    { id: 'footer', path: 'components/layout/footer.html', priority: 1 }
];

/**
 * Initialize application
 * @async
 */
async function initApp() {
    console.log('Tapiterie B&B - Inițializare aplicație...');
    console.time('Timp inițializare aplicație');
    
    try {
        // Show loading state
        document.body.classList.add('app-loading');
        
        // Group components by priority
        const priorityComponents = mainComponents.filter(comp => comp.priority === 1);
        const standardComponents = mainComponents.filter(comp => comp.priority === 2);
        
        // Load header and footer first for better UX
        if (priorityComponents.length > 0) {
            console.log('Încărcare componente prioritare...');
            await Promise.all(
                priorityComponents.map(component => 
                    loadComponent(component.id, component.path, { fadeIn: true })
                )
            );
        }
        
        // Load remaining components
        if (standardComponents.length > 0) {
            console.log('Încărcare componente standard...');
            for (const component of standardComponents) {
                await loadComponent(component.id, component.path, { fadeIn: true });
            }
        }
        
        // Initialize core modules
        console.log('Inițializare module de bază...');
        
        // Initialize header with date and time display
        initHeader();
        
        // Initialize sliders after a short delay
        setTimeout(() => {
            // Initialize Swiper sliders
            const swiper = initSwiper();
            
            // Show page content with fade-in
            document.body.classList.remove('app-loading');
            document.body.classList.add('app-initialized');
            
            console.timeEnd('Timp inițializare aplicație');
            console.log('Aplicație inițializată cu succes!');
            
            // Dispatch application ready event
            const readyEvent = new CustomEvent('appReady', {
                detail: { timestamp: Date.now() }
            });
            document.dispatchEvent(readyEvent);
        }, 100);
        
        // Add cleanup function for when page is unloaded
        window.addEventListener('beforeunload', () => {
            // Clean up any resources or event listeners
            
            // Clear component cache on page unload if in development mode
            if (isDevelopment) clearComponentCache();
        });
    } catch (error) {
        console.error('Eroare la inițializarea aplicației:', error);
        document.body.classList.remove('app-loading');
        document.body.classList.add('app-error');
        
        // Show error message
        const errorElement = document.createElement('div');
        errorElement.className = 'app-error-message';
        errorElement.innerHTML = `
            <div class="error-container">
                <h2>A apărut o eroare!</h2>
                <p>Ne pare rău, dar a apărut o eroare la încărcarea paginii.</p>
                <p class="error-details">Detalii: ${error.message}</p>
                <button onclick="window.location.reload()">Reîncarcă pagina</button>
            </div>
        `;
        document.body.appendChild(errorElement);
        
        // Dispatch application error event
        const errorEvent = new CustomEvent('appError', {
            detail: { error, timestamp: Date.now() }
        });
        document.dispatchEvent(errorEvent);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);