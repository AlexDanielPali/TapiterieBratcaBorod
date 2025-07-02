/**
 * Swiper initialization module
 * Handles all Swiper sliders across the website
 * @module swiper
 */

/**
 * Initializes Swiper sliders on the page
 * @returns {Object|null} Initialized Swiper instances or null if Swiper is not available
 */
export const initSwiper = () => {
    // Check if Swiper is available
    if (typeof Swiper === 'undefined') {
        console.error('Eroare: Biblioteca Swiper nu este disponibilă!');
        return null;
    }
    
    const swiperInstances = {};
    
    try {
        // Slider pentru galeria de imagini individuale (PRODUSE NOI)
        initProductsSwiper();
        
        // Slider pentru secțiunea înainte-după (RETAPIȚĂRI)
        initBeforeAfterSwiper();
        
        console.log('Toate sliderele au fost inițializate cu succes');
        return swiperInstances;
    } catch (error) {
        console.error('Eroare la inițializarea sliderelor:', error);
        return null;
    }
    
    /**
     * Initialize products swiper
     */
    function initProductsSwiper() {
        const productsContainer = document.querySelector('.home-images-container');
        
        if (!productsContainer) {
            console.warn('Container pentru slider produse negăsit');
            return;
        }
        
        const nextBtn = productsContainer.querySelector('.swiper-button-next');
        const prevBtn = productsContainer.querySelector('.swiper-button-prev');
        
        // Add accessibility attributes
        if (nextBtn) {
            nextBtn.setAttribute('aria-label', 'Următoarea imagine');
            nextBtn.setAttribute('tabindex', '0');
        }
        
        if (prevBtn) {
            prevBtn.setAttribute('aria-label', 'Imaginea anterioară');
            prevBtn.setAttribute('tabindex', '0');
        }
        
        swiperInstances.products = new Swiper(productsContainer, {
            loop: true,
            navigation: {
                nextEl: nextBtn,
                prevEl: prevBtn,
            },
            spaceBetween: 20,
            slidesPerView: 1,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            keyboard: {
                enabled: true,
                onlyInViewport: true,
            },
            lazy: {
                loadPrevNext: true,
                loadOnTransitionStart: true,
            },
            a11y: {
                enabled: true,
                prevSlideMessage: 'Imaginea anterioară',
                nextSlideMessage: 'Următoarea imagine',
                firstSlideMessage: 'Prima imagine',
                lastSlideMessage: 'Ultima imagine',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                768: {
                    slidesPerView: 3,
                }
            }
        });
    }
    
    /**
     * Initialize before-after swiper
     */
    function initBeforeAfterSwiper() {
        const beforeAfterContainers = document.querySelectorAll('.before-after-swiper');
        
        if (!beforeAfterContainers.length) {
            console.warn('Containere pentru slider înainte-după negăsite');
            return;
        }
        
        beforeAfterContainers.forEach((container, index) => {
            const nextBtn = container.querySelector('.swiper-button-next');
            const prevBtn = container.querySelector('.swiper-button-prev');
            
            // Add accessibility attributes
            if (nextBtn) {
                nextBtn.setAttribute('aria-label', 'Următoarea comparație');
                nextBtn.setAttribute('tabindex', '0');
            }
            
            if (prevBtn) {
                prevBtn.setAttribute('aria-label', 'Comparația anterioară');
                prevBtn.setAttribute('tabindex', '0');
            }
            
            swiperInstances[`beforeAfter${index}`] = new Swiper(container, {
                loop: true,
                navigation: {
                    nextEl: nextBtn,
                    prevEl: prevBtn,
                },
                spaceBetween: 20,
                slidesPerView: 1,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                },
                keyboard: {
                    enabled: true,
                    onlyInViewport: true,
                },
                lazy: {
                    loadPrevNext: true,
                    loadOnTransitionStart: true,
                },
                a11y: {
                    enabled: true,
                    prevSlideMessage: 'Comparația anterioară',
                    nextSlideMessage: 'Următoarea comparație',
                },
                breakpoints: {
                    640: {
                        slidesPerView: 2,
                    },
                    768: {
                        slidesPerView: 2,
                    }
                }
            });
        });
    }
};