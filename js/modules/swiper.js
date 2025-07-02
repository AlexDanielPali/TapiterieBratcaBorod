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
        // Inițializăm toate sliderele
        initAllSwipers();
        
        console.log('Toate sliderele au fost inițializate cu succes');
        return swiperInstances;
    } catch (error) {
        console.error('Eroare la inițializarea sliderelor:', error);
        return null;
    }
    
    /**
     * Inițializează toate sliderele din pagină
     */
    function initAllSwipers() {
        // Găsim toate containerele Swiper
        const swiperContainers = document.querySelectorAll('.swiper-container');
        
        if (!swiperContainers.length) {
            console.warn('Nu au fost găsite containere pentru slidere');
            return;
        }
        
        // Inițializăm fiecare container Swiper
        swiperContainers.forEach((container, index) => {
            // Verificăm tipul de container pentru a aplica setări specifice
            const isProductSlider = container.closest('#home2') !== null;
            const isRetapitariSlider = container.closest('#home3') !== null;
            const isBeforeAfterSlider = container.classList.contains('before-after-container');
            
            const nextBtn = container.querySelector('.swiper-button-next');
            const prevBtn = container.querySelector('.swiper-button-prev');
            
            // Adăugăm atribute de accesibilitate
            if (nextBtn) {
                nextBtn.setAttribute('aria-label', 'Următoarea imagine');
                nextBtn.setAttribute('tabindex', '0');
            }
            
            if (prevBtn) {
                prevBtn.setAttribute('aria-label', 'Imaginea anterioară');
                prevBtn.setAttribute('tabindex', '0');
            }
            
            // Configurație comună pentru toate sliderele
            const commonConfig = {
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
            };
            
            // Setări specifice pentru slider-ul de înainte/după
            if (isRetapitariSlider || isBeforeAfterSlider) {
                commonConfig.a11y.prevSlideMessage = 'Comparația anterioară';
                commonConfig.a11y.nextSlideMessage = 'Următoarea comparație';
                commonConfig.autoplay.delay = 5000;
            }
            
            // Inițializăm Swiper cu configurația
            swiperInstances[`swiper${index}`] = new Swiper(container, commonConfig);
            
            console.log(`Swiper inițializat: ${isProductSlider ? 'Produse' : isRetapitariSlider ? 'Retapițări' : 'Alt tip'}`);
        });
        
        // De asemenea, inițializăm și sliderele legacy, dacă există
        initLegacyBeforeAfterSwipers();
    }
    
    /**
     * Inițializează sliderele înainte/după care folosesc clasa veche (.before-after-swiper)
     * pentru compatibilitate cu codul existent
     */
    function initLegacyBeforeAfterSwipers() {
        const beforeAfterContainers = document.querySelectorAll('.before-after-swiper');
        
        if (!beforeAfterContainers.length) {
            console.warn('Containere pentru slider înainte-după cu clasa veche negăsite');
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
            
            swiperInstances[`beforeAfterLegacy${index}`] = new Swiper(container, {
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
            
            console.log('Swiper legacy înainte/după inițializat');
        });
    }
};