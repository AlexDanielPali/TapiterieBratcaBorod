/**
 * Services page functionality
 * @module services
 */

import { loadComponent } from '../loadComponents.js';
import { initDateTime } from './datetime.js';
import { initHeader } from './header.js';

/**
 * Helper function to resolve paths based on current page location
 * @param {string} path - The relative path to resolve
 * @returns {string} The resolved path
 */
function resolvePath(path) {
    const isInPagesDir = window.location.pathname.includes('/pages/');
    return isInPagesDir ? `../${path}` : path;
}

/**
 * Service components configuration
 * @type {Array<{id: string, path: string, priority: number}>}
 */
const servicesComponents = [
    { 
        id: 'header', 
        path: resolvePath('components/layout/header.html'),
        priority: 1
    },
    { 
        id: 'produse-noi', 
        path: resolvePath('components/service-components/produse-noi.html'),
        priority: 2
    },
    { 
        id: 'retapitari', 
        path: resolvePath('components/service-components/retapitari.html'),
        priority: 2
    },
    { 
        id: 'footer', 
        path: resolvePath('components/layout/footer.html'),
        priority: 1
    }
];

/**
 * Service categories configuration
 * @type {Array<{id: string, title: string, description: string, image: string}>}
 */
const serviceCategories = [
    {
        id: 'produse-noi',
        title: 'Produse Noi',
        description: 'Mobilier nou, personalizat după preferințele dumneavoastră',
        image: resolvePath('assets/images/Produse noi/imagine1.jpg'),
        subcategories: [
            { name: 'Paturi', url: 'produse_noi_paturi.html' },
            { name: 'Canapele', url: 'produse_noi_canapele.html' },
            { name: 'Colțare', url: 'produse_noi_coltare.html' }
        ]
    },
    {
        id: 'retapitari',
        title: 'Retapițări',
        description: 'Dăm viață nouă mobilierului dumneavoastră preferat',
        image: resolvePath('assets/images/Retapitari/dupa.jpg'),
        subcategories: [
            { name: 'Canapele', url: 'retapitari_canapele.html' },
            { name: 'Colțare', url: 'retapitari_coltare.html' },
            { name: 'Scaune', url: 'retapitari_scaune.html' },
            { name: 'Auto', url: 'retapitari_auto.html' }
        ]
    }
];

/**
 * Services page manager class
 */
class ServicesManager {
    /**
     * Creates an instance of ServicesManager
     */
    constructor() {
        this.activeCategory = null;
        this.isAnimationEnabled = window.innerWidth > 768;
    }

    /**
     * Initializes the services page
     * @async
     */
    async init() {
        try {
            console.log('Inițializare pagină servicii...');
            document.body.classList.add('loading');
            
            // Group components by priority
            const priorityComponents = servicesComponents.filter(comp => comp.priority === 1);
            const standardComponents = servicesComponents.filter(comp => comp.priority === 2);
            
            // Load priority components first (header and footer)
            if (priorityComponents.length > 0) {
                await Promise.all(
                    priorityComponents.map(component => 
                        loadComponent(component.id, component.path, { fadeIn: true })
                    )
                );
            }
            
            // Initialize header with date/time functionality
            initHeader();
            
            // Load service components
            for (const component of standardComponents) {
                await loadComponent(component.id, component.path);
                
                // Enhance the component after loading
                this.enhanceServiceComponent(component.id);
            }
            
            // Setup interactions
            this.setupInteractions();
            
            // Setup service categories
            this.setupServiceCategories();
            
            // Remove loading state
            document.body.classList.remove('loading');
            document.body.classList.add('page-loaded');
            
            console.log('Pagină servicii inițializată cu succes');
        } catch (error) {
            console.error('Eroare la inițializarea paginii de servicii:', error);
            document.body.classList.remove('loading');
            document.body.classList.add('error');
            
            // Show error message
            const errorElement = document.createElement('div');
            errorElement.className = 'page-error';
            errorElement.innerHTML = `
                <div class="error-container">
                    <h2>A apărut o eroare!</h2>
                    <p>Ne pare rău, dar a apărut o eroare la încărcarea paginii de servicii.</p>
                    <button onclick="window.location.reload()">Reîncarcă pagina</button>
                </div>
            `;
            document.body.appendChild(errorElement);
        }
    }

    /**
     * Enhances a service component after loading
     * @param {string} componentId - The ID of the component to enhance
     */
    enhanceServiceComponent(componentId) {
        const component = document.getElementById(componentId);
        if (!component) return;
        
        // Get the corresponding category data
        const categoryData = serviceCategories.find(cat => cat.id === componentId);
        if (!categoryData) return;
        
        // Update title if it exists
        const titleElement = component.querySelector('.service-title');
        if (titleElement) {
            titleElement.textContent = categoryData.title;
        }
        
        // Update description if it exists
        const descElement = component.querySelector('.service-description');
        if (descElement) {
            descElement.textContent = categoryData.description;
        }
        
        // Update subcategories if container exists
        const subcategoriesContainer = component.querySelector('.service-subcategories');
        if (subcategoriesContainer && categoryData.subcategories) {
            subcategoriesContainer.innerHTML = ''; // Clear existing content
            
            categoryData.subcategories.forEach(subcat => {
                const link = document.createElement('a');
                link.href = subcat.url;
                link.className = 'service-subcategory';
                link.textContent = subcat.name;
                subcategoriesContainer.appendChild(link);
            });
        }
        
        // Add animations
        if (this.isAnimationEnabled) {
            component.classList.add('animate-service');
        }
    }

    /**
     * Sets up interactions for the services page
     */
    setupInteractions() {
        // Add click handlers for service cards
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const categoryId = card.getAttribute('data-category');
                if (categoryId) {
                    this.showCategoryDetails(categoryId);
                }
            });
        });
    }

    /**
     * Sets up service categories with dynamic content
     */
    setupServiceCategories() {
        const categoriesContainer = document.querySelector('.service-categories');
        if (!categoriesContainer) return;
        
        // Clear existing content
        categoriesContainer.innerHTML = '';
        
        // Create category cards
        serviceCategories.forEach(category => {
            const card = document.createElement('div');
            card.className = 'service-category-card';
            card.setAttribute('data-category', category.id);
            
            card.innerHTML = `
                <div class="category-image">
                    <img src="${category.image}" alt="${category.title}" loading="lazy">
                </div>
                <div class="category-content">
                    <h3>${category.title}</h3>
                    <p>${category.description}</p>
                    <div class="category-links">
                        ${category.subcategories.map(sub => 
                            `<a href="${sub.url}" class="category-link">${sub.name}</a>`
                        ).join('')}
                    </div>
                </div>
            `;
            
            categoriesContainer.appendChild(card);
        });
    }

    /**
     * Shows details for a specific category
     * @param {string} categoryId - The ID of the category to show
     */
    showCategoryDetails(categoryId) {
        // Find the category
        const category = serviceCategories.find(cat => cat.id === categoryId);
        if (!category) return;
        
        // Update the active category
        this.activeCategory = categoryId;
        
        // Scroll to the category section
        const section = document.getElementById(categoryId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

/**
 * Initializes the services page
 * @async
 */
async function initServices() {
    const servicesManager = new ServicesManager();
    await servicesManager.init();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initServices);