import { loadComponent } from '../loadComponents.js';

// Helper function to resolve paths based on current page location
function resolvePath(path) {
    const isInPagesDir = window.location.pathname.includes('/pages/');
    return isInPagesDir ? `../${path}` : path;
}

const servicesComponents = [
    { 
        id: 'header', 
        path: resolvePath('components/layout/header.html')
    },
    { 
        id: 'produse-noi', 
        path: resolvePath('components/service-components/produse-noi.html')
    },
    { 
        id: 'retapitari', 
        path: resolvePath('components/service-components/retapitari.html')
    },
    { 
        id: 'footer', 
        path: resolvePath('components/layout/footer.html')
    }
];

async function initServices() {
    try {
        console.log('Initializing services...');
        for (const component of servicesComponents) {
            console.log(`Loading component: ${component.id} from ${component.path}`);
            await loadComponent(component.id, component.path);
        }
        console.log('All components loaded successfully');
    } catch (error) {
        console.error('Error loading services:', error);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initServices);