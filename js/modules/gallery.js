/**
 * Gallery functionality
 * @module gallery
 */

import { loadComponent } from '../loadComponents.js';
import { galleryConfig } from '../config/galleryConfig.js';

/**
 * Manages gallery functionality and image loading
 */
class GalleryManager {
    /**
     * Creates a new GalleryManager instance
     */
    constructor() {
        this.category = this.getCurrentCategory();
        this.galleryElement = document.getElementById('category-gallery');
        this.lightboxElement = null;
        this.currentIndex = 0;
        this.images = [];
        this.isLoading = true;
        this.isAnimationEnabled = window.innerWidth > 768;
        
        this.init();
    }

    /**
     * Gets current category from URL
     * @returns {string} The category identifier
     */
    getCurrentCategory() {
        // Get filename without extension
        const pathname = window.location.pathname;
        const filename = pathname.split('/').pop().replace('.html', '');
        return filename;
    }

    /**
     * Initializes the gallery
     * @async
     */
    async init() {
        try {
            console.log('Inițializare galerie...');
            document.body.classList.add('loading');
            
            // Load header and footer first
            await Promise.all([
                loadComponent('header', '../components/layout/header.html'),
                loadComponent('footer', '../components/layout/footer.html')
            ]);

            // Update page title if needed
            this.updatePageTitle();

            // Load gallery images if available
            if (this.galleryElement && galleryConfig[this.category]) {
                this.images = galleryConfig[this.category].images || [];
                this.loadImages();
                this.createLightbox();
                
                // Set up keyboard navigation
                document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
                
                console.log(`S-au încărcat ${this.images.length} imagini pentru categoria: ${this.category}`);
            } else if (!galleryConfig[this.category]) {
                console.error(`Nu există configurație pentru categoria: ${this.category}`);
                this.showErrorMessage('Nu există imagini pentru această categorie.');
            } else if (!this.galleryElement) {
                console.error('Containerul pentru galerie nu a fost găsit');
            }
            
            // Remove loading state
            document.body.classList.remove('loading');
            document.body.classList.add('page-loaded');
            this.isLoading = false;
        } catch (error) {
            console.error('Eroare la inițializarea galeriei:', error);
            document.body.classList.remove('loading');
            document.body.classList.add('error');
            this.isLoading = false;
            this.showErrorMessage('A apărut o eroare la încărcarea galeriei.');
        }
    }

    /**
     * Updates the page title with the gallery category
     */
    updatePageTitle() {
        if (galleryConfig[this.category] && galleryConfig[this.category].title) {
            // Update the album title if it exists
            const albumTitle = document.querySelector('.album-title');
            if (albumTitle) {
                albumTitle.textContent = galleryConfig[this.category].title;
            }
            
            // Update page title
            document.title = `Tapiterie B&B - ${galleryConfig[this.category].title}`;
        }
    }

    /**
     * Loads images into the gallery container
     */
    loadImages() {
        if (!this.galleryElement || !this.images.length) return;

        const fragment = document.createDocumentFragment();
        const loadingPlaceholder = this.createLoadingPlaceholder();
        this.galleryElement.appendChild(loadingPlaceholder);

        // Track loaded images
        let loadedCount = 0;
        const totalImages = this.images.length;

        this.images.forEach((image, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'gallery-image-wrapper';
            wrapper.style.opacity = '0';
            wrapper.style.transform = 'translateY(20px)';
            
            const imgContainer = document.createElement('div');
            imgContainer.className = 'gallery-image-container';

            const img = document.createElement('img');
            img.src = image.src;
            img.alt = image.alt || `Imagine ${index + 1}`;
            img.loading = 'lazy';
            img.className = 'gallery-image';
            img.dataset.index = index;
            img.setAttribute('aria-label', `Deschide imaginea: ${image.alt || `Imagine ${index + 1}`}`);
            img.setAttribute('tabindex', '0');
            
            // Image placeholder and loading indicator
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.innerHTML = '<div class="loading-spinner"><div></div><div></div><div></div></div>';
            imgContainer.appendChild(placeholder);
            
            // Add image caption if available
            if (image.alt) {
                const caption = document.createElement('div');
                caption.className = 'image-caption';
                caption.textContent = image.alt;
                wrapper.appendChild(caption);
            }
            
            // Add date information if available
            if (image.date) {
                const dateSpan = document.createElement('span');
                dateSpan.className = 'image-date';
                dateSpan.textContent = new Date(image.date).toLocaleDateString('ro-RO');
                wrapper.appendChild(dateSpan);
            }

            // Image load handler
            img.onload = () => {
                placeholder.style.opacity = '0';
                setTimeout(() => {
                    placeholder.remove();
                    
                    // Update loading progress
                    loadedCount++;
                    const progress = Math.round((loadedCount / totalImages) * 100);
                    this.updateLoadingProgress(progress);
                    
                    // Remove loading placeholder when all images are loaded
                    if (loadedCount === totalImages) {
                        loadingPlaceholder.style.opacity = '0';
                        setTimeout(() => {
                            loadingPlaceholder.remove();
                            this.animateGalleryItems();
                        }, 300);
                    }
                }, 200);
            };

            // Image error handler
            img.onerror = () => {
                placeholder.innerHTML = '<div class="image-error">Imaginea nu a putut fi încărcată</div>';
                
                // Update loading progress
                loadedCount++;
                const progress = Math.round((loadedCount / totalImages) * 100);
                this.updateLoadingProgress(progress);
            };

            // Add event listeners
            img.addEventListener('click', () => this.openLightbox(index));
            img.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openLightbox(index);
                }
            });

            imgContainer.appendChild(img);
            wrapper.appendChild(imgContainer);
            fragment.appendChild(wrapper);
        });

        this.galleryElement.appendChild(fragment);
    }

    /**
     * Creates a loading placeholder
     * @returns {HTMLElement} The loading placeholder element
     */
    createLoadingPlaceholder() {
        const placeholder = document.createElement('div');
        placeholder.className = 'gallery-loading';
        placeholder.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Se încarcă galeria...</p>
            <div class="loading-progress">
                <div class="progress-bar" style="width: 0%"></div>
                <span class="progress-text">0%</span>
            </div>
        `;
        return placeholder;
    }

    /**
     * Updates the loading progress
     * @param {number} progress - The progress percentage (0-100)
     */
    updateLoadingProgress(progress) {
        const progressBar = document.querySelector('.gallery-loading .progress-bar');
        const progressText = document.querySelector('.gallery-loading .progress-text');
        
        if (progressBar && progressText) {
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${progress}%`;
        }
    }

    /**
     * Animates gallery items with a staggered fade-in effect
     */
    animateGalleryItems() {
        if (!this.isAnimationEnabled) return;
        
        const items = this.galleryElement.querySelectorAll('.gallery-image-wrapper');
        
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            }, index * 100);
        });
    }

    /**
     * Creates the lightbox element
     */
    createLightbox() {
        // Create lightbox if it doesn't already exist
        if (document.getElementById('gallery-lightbox')) return;
        
        const lightbox = document.createElement('div');
        lightbox.id = 'gallery-lightbox';
        lightbox.className = 'gallery-lightbox';
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.setAttribute('aria-label', 'Vizualizare imagine');
        lightbox.setAttribute('tabindex', '-1');
        
        lightbox.innerHTML = `
            <div class="lightbox-overlay"></div>
            <button class="lightbox-close" aria-label="Închide">&times;</button>
            <button class="lightbox-nav lightbox-prev" aria-label="Imaginea anterioară">&#10094;</button>
            <div class="lightbox-container">
                <img class="lightbox-image" src="" alt="">
                <div class="lightbox-caption"></div>
                <div class="lightbox-loading">
                    <div class="loading-spinner"></div>
                </div>
                <div class="lightbox-error">Imaginea nu poate fi încărcată</div>
            </div>
            <button class="lightbox-nav lightbox-next" aria-label="Imaginea următoare">&#10095;</button>
            <div class="lightbox-counter"></div>
        `;
        
        document.body.appendChild(lightbox);
        this.lightboxElement = lightbox;
        
        // Setup lightbox event handlers
        const closeButton = lightbox.querySelector('.lightbox-close');
        const prevButton = lightbox.querySelector('.lightbox-prev');
        const nextButton = lightbox.querySelector('.lightbox-next');
        const overlay = lightbox.querySelector('.lightbox-overlay');
        
        closeButton.addEventListener('click', () => this.closeLightbox());
        prevButton.addEventListener('click', () => this.showPrevImage());
        nextButton.addEventListener('click', () => this.showNextImage());
        overlay.addEventListener('click', () => this.closeLightbox());
    }

    /**
     * Opens the lightbox with the selected image
     * @param {number} index - The index of the image to show
     */
    openLightbox(index) {
        if (!this.lightboxElement || this.isLoading) return;
        
        this.currentIndex = index;
        this.lightboxElement.classList.add('active');
        document.body.classList.add('lightbox-open');
        
        // Show the current image
        this.showCurrentImage();
        
        // Set focus to lightbox for accessibility
        this.lightboxElement.focus();
    }

    /**
     * Shows the current image in the lightbox
     */
    showCurrentImage() {
        if (!this.lightboxElement || !this.images[this.currentIndex]) return;
        
        const image = this.images[this.currentIndex];
        const lightboxImage = this.lightboxElement.querySelector('.lightbox-image');
        const caption = this.lightboxElement.querySelector('.lightbox-caption');
        const counter = this.lightboxElement.querySelector('.lightbox-counter');
        const loading = this.lightboxElement.querySelector('.lightbox-loading');
        const error = this.lightboxElement.querySelector('.lightbox-error');
        
        // Reset state
        lightboxImage.style.display = 'none';
        caption.style.display = 'none';
        loading.style.display = 'flex';
        error.style.display = 'none';
        
        // Update counter
        counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
        
        // Load new image
        lightboxImage.src = '';
        lightboxImage.alt = '';
        
        lightboxImage.onload = () => {
            loading.style.display = 'none';
            lightboxImage.style.display = 'block';
            
            // Show caption if available
            if (image.alt) {
                caption.textContent = image.alt;
                caption.style.display = 'block';
            }
        };
        
        lightboxImage.onerror = () => {
            loading.style.display = 'none';
            error.style.display = 'block';
        };
        
        // Set new image source
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt || `Imagine ${this.currentIndex + 1}`;
    }

    /**
     * Shows the previous image in the lightbox
     */
    showPrevImage() {
        if (this.images.length <= 1) return;
        
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.images.length - 1;
        }
        
        this.showCurrentImage();
    }

    /**
     * Shows the next image in the lightbox
     */
    showNextImage() {
        if (this.images.length <= 1) return;
        
        this.currentIndex++;
        if (this.currentIndex >= this.images.length) {
            this.currentIndex = 0;
        }
        
        this.showCurrentImage();
    }

    /**
     * Closes the lightbox
     */
    closeLightbox() {
        if (!this.lightboxElement) return;
        
        this.lightboxElement.classList.remove('active');
        document.body.classList.remove('lightbox-open');
        
        // Set focus back to the gallery image
        const focusedImage = this.galleryElement.querySelector(`[data-index="${this.currentIndex}"]`);
        if (focusedImage) {
            setTimeout(() => {
                focusedImage.focus();
            }, 100);
        }
    }

    /**
     * Handles keyboard navigation
     * @param {KeyboardEvent} e - The keyboard event
     */
    handleKeyboardNavigation(e) {
        if (!this.lightboxElement || !this.lightboxElement.classList.contains('active')) return;
        
        switch (e.key) {
            case 'Escape':
                this.closeLightbox();
                break;
            case 'ArrowLeft':
                this.showPrevImage();
                break;
            case 'ArrowRight':
                this.showNextImage();
                break;
        }
    }

    /**
     * Shows an error message in the gallery
     * @param {string} message - The error message to show
     */
    showErrorMessage(message) {
        if (!this.galleryElement) return;
        
        const errorElement = document.createElement('div');
        errorElement.className = 'gallery-error';
        errorElement.innerHTML = `
            <p>${message}</p>
            <button onclick="window.location.reload()">Reîncarcă</button>
        `;
        
        this.galleryElement.innerHTML = '';
        this.galleryElement.appendChild(errorElement);
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GalleryManager();
});