/**
 * Component loading utility
 * @module loadComponents
 */

import { initHamburgerMenu } from './modules/hamburger.js';

/**
 * Cache for loaded components to avoid redundant requests
 * @type {Map<string, {html: string, timestamp: number}>}
 */
const componentCache = new Map();

/**
 * Cache expiration time in milliseconds (5 minutes)
 * @type {number}
 */
const CACHE_EXPIRATION = 5 * 60 * 1000;

/**
 * Tracking pending component loads to prevent duplicate requests
 * @type {Map<string, Promise<string>>}
 */
const pendingLoads = new Map();

/**
 * Loads and inserts a component into the page
 * @async
 * @param {string} id - The ID of the element where the component should be inserted
 * @param {string} path - The path to the component file
 * @param {Object} [options] - Additional options
 * @param {boolean} [options.cache=true] - Whether to cache the component
 * @param {boolean} [options.fadeIn=true] - Whether to fade in the component
 * @param {boolean} [options.showLoadingIndicator=true] - Whether to show a loading indicator
 * @param {number} [options.cacheExpiration=CACHE_EXPIRATION] - Cache expiration time in ms
 * @returns {Promise<boolean>} - Resolves to true if successful, false otherwise
 */
export async function loadComponent(id, path, options = {}) {
    const { 
        cache = true,
        fadeIn = true,
        showLoadingIndicator = true,
        cacheExpiration = CACHE_EXPIRATION
    } = options;
    
    // Find the target element
    const target = document.getElementById(id);
    
    if (!target) {
        console.error(`Element țintă cu ID-ul "${id}" nu a fost găsit`);
        return false;
    }
    
    try {
        // Add loading indicator if requested
        if (showLoadingIndicator && !target.classList.contains('component-loading')) {
            target.innerHTML = '<div class="loading-spinner"><div></div><div></div><div></div></div>';
            target.classList.add('component-loading');
        }
        
        // Get component HTML (from cache or by fetching)
        const html = await getComponentHtml(path, { cache, cacheExpiration });
        
        // Apply the component with optional fade effect
        if (fadeIn) {
            target.style.opacity = '0';
            target.innerHTML = html;
            
            // Trigger reflow for animation
            void target.offsetWidth;
            target.style.opacity = '1';
            target.style.transition = 'opacity 0.3s ease';
        } else {
            target.innerHTML = html;
        }
        
        // Remove component-loading class if it exists
        target.classList.remove('component-loading');
        
        // Initialize hamburger menu if header is loaded
        if (id === 'header') {
            initHamburgerMenu();
        }
        
        // Initialize any scripts in the component
        initComponentScripts(target);
        
        // Dispatch event for component loaded
        const event = new CustomEvent('componentLoaded', { 
            detail: { id, path } 
        });
        document.dispatchEvent(event);
        
        return true;
    } catch (error) {
        console.error(`Eroare la încărcarea componentei ${id} din ${path}:`, error);
        
        // Show error in the component
        target.classList.remove('component-loading');
        target.innerHTML = `
            <div class="component-error">
                <p>Nu s-a putut încărca componenta.</p>
                <button onclick="window.location.reload()">Reîncarcă pagina</button>
            </div>
        `;
        
        // Dispatch error event
        const errorEvent = new CustomEvent('componentError', { 
            detail: { id, path, error } 
        });
        document.dispatchEvent(errorEvent);
        
        return false;
    }
}

/**
 * Gets the HTML for a component, either from cache or by fetching
 * @async
 * @param {string} path - Path to the component
 * @param {Object} options - Options for getting the component
 * @param {boolean} options.cache - Whether to use cache
 * @param {number} options.cacheExpiration - Cache expiration time
 * @returns {Promise<string>} The component HTML
 */
async function getComponentHtml(path, { cache, cacheExpiration }) {
    // Check if we can use cached version
    if (cache && componentCache.has(path)) {
        const cachedData = componentCache.get(path);
        const now = Date.now();
        
        // Use cache if it's not expired
        if (now - cachedData.timestamp < cacheExpiration) {
            console.log(`Componenta ${path} încărcată din cache`);
            return cachedData.html;
        } else {
            // Remove expired cache entry
            componentCache.delete(path);
        }
    }
    
    // Check if this component is already being loaded
    if (pendingLoads.has(path)) {
        console.log(`Folosind cererea existentă pentru ${path}`);
        return pendingLoads.get(path);
    }
    
    // Create a new fetch request
    const fetchPromise = (async () => {
        try {
            console.log(`Se încarcă componenta ${path}...`);
            const response = await fetch(path);
            
            if (!response.ok) {
                throw new Error(`Eroare HTTP! Cod: ${response.status}`);
            }
            
            const html = await response.text();
            
            // Cache the component for future use
            if (cache) {
                componentCache.set(path, {
                    html,
                    timestamp: Date.now()
                });
            }
            
            // Remove from pending loads
            pendingLoads.delete(path);
            
            return html;
        } catch (error) {
            // Remove from pending loads in case of error
            pendingLoads.delete(path);
            throw error;
        }
    })();
    
    // Store the pending load
    pendingLoads.set(path, fetchPromise);
    
    return fetchPromise;
}

/**
 * Initializes any script tags in a component
 * @param {HTMLElement} container - The container element
 */
function initComponentScripts(container) {
    // Find all script tags in the component
    const scripts = container.querySelectorAll('script');
    
    scripts.forEach(oldScript => {
        // Create a new script element
        const newScript = document.createElement('script');
        
        // Copy all attributes
        Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
        });
        
        // Copy the content
        newScript.textContent = oldScript.textContent;
        
        // Replace the old script with the new one
        oldScript.parentNode.replaceChild(newScript, oldScript);
    });
}

/**
 * Clears the component cache
 */
export function clearComponentCache() {
    componentCache.clear();
    console.log('Cache-ul componentelor a fost golit');
}

/**
 * Gets stats about the component cache
 * @returns {Object} Cache statistics
 */
export function getCacheStats() {
    const stats = {
        size: componentCache.size,
        components: [],
        totalSizeBytes: 0
    };
    
    componentCache.forEach((value, key) => {
        const sizeBytes = new Blob([value.html]).size;
        const ageMs = Date.now() - value.timestamp;
        
        stats.components.push({
            path: key,
            sizeBytes,
            ageMs,
            ageFormatted: `${Math.round(ageMs / 1000)}s`
        });
        
        stats.totalSizeBytes += sizeBytes;
    });
    
    stats.totalSizeFormatted = formatBytes(stats.totalSizeBytes);
    
    return stats;
}

/**
 * Formats bytes to a human-readable string
 * @param {number} bytes - The number of bytes
 * @param {number} [decimals=2] - Number of decimal places
 * @returns {string} Formatted size string
 */
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}