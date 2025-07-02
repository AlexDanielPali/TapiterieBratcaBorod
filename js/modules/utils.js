/**
 * Utility functions for the website
 * @module utils
 */

/**
 * Toggles the responsive navigation menu
 */
export function ResponsiveNavBar() {
    const navMenu = document.getElementById("myNavMenu");
    
    if (!navMenu) {
        console.error('Meniul de navigare nu a fost găsit');
        return;
    }
    
    if (navMenu.className === "navbar") {
        navMenu.className += " responsive";
        // Add ARIA attribute for accessibility
        navMenu.setAttribute('aria-expanded', 'true');
    } else {
        navMenu.className = "navbar";
        // Update ARIA attribute
        navMenu.setAttribute('aria-expanded', 'false');
    }
}

/**
 * Expands an image in the gallery view
 * @param {HTMLImageElement} imgs - The image element to expand
 */
export function expandImage(imgs) {
    const expandImg = document.getElementById("expandedImg");
    const imgText = document.getElementById("imgtext");
    
    if (!expandImg || !imgText) {
        console.error('Elementele pentru imagine expandată nu au fost găsite');
        return;
    }
    
    // Update expanded image
    expandImg.src = imgs.src;
    imgText.textContent = imgs.alt;
    expandImg.parentElement.style.display = "block";
    
    // Add fade-in animation
    expandImg.style.opacity = '0';
    setTimeout(() => {
        expandImg.style.opacity = '1';
        expandImg.style.transition = 'opacity 0.3s ease-in-out';
    }, 50);
    
    // Set focus on expanded image for accessibility
    expandImg.focus();
}

/**
 * Closes the expanded image view
 */
export function closeExpandedImage() {
    const expandedContainer = document.querySelector(".expanded-img-container");
    
    if (expandedContainer) {
        expandedContainer.style.display = "none";
    }
}

/**
 * Smooth scroll to an element
 * @param {string} elementId - The ID of the element to scroll to
 * @param {number} [offset=0] - Offset from the top in pixels
 */
export function smoothScrollTo(elementId, offset = 0) {
    const element = document.getElementById(elementId);
    
    if (!element) {
        console.error(`Elementul cu ID-ul '${elementId}' nu a fost găsit`);
        return;
    }
    
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

/**
 * Detect if the user is on a mobile device
 * @returns {boolean} True if on mobile device
 */
export function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Add lazy loading to all images on the page
 */
export function addLazyLoadingToImages() {
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
        img.setAttribute('loading', 'lazy');
    });
}

/**
 * Format date to Romanian locale
 * @param {Date|string} date - Date to format
 * @param {boolean} [includeTime=false] - Whether to include the time
 * @returns {string} Formatted date string
 */
export function formatDate(date, includeTime = false) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const options = { 
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }
    
    return dateObj.toLocaleDateString('ro-RO', options);
}

// Make functions globally available for onclick handlers in HTML
window.ResponsiveNavBar = ResponsiveNavBar;
window.expandImage = expandImage;
window.closeExpandedImage = closeExpandedImage;
window.smoothScrollTo = smoothScrollTo;

// Initialize lazy loading when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    addLazyLoadingToImages();
});
