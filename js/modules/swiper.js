export const initSwiper = () => {
    // Slider pentru galeria de imagini individuale (PRODUSE NOI)
    const productsContainer = document.querySelector('.home-images-container');
    if (productsContainer && typeof Swiper !== 'undefined') {
        new Swiper(productsContainer, {
            loop: true,
            navigation: {
                nextEl: productsContainer.querySelector('.swiper-button-next'),
                prevEl: productsContainer.querySelector('.swiper-button-prev'),
            },
            spaceBetween: 20,
            slidesPerView: 1,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
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

    // Slider pentru secțiunea înainte-după (RETAPIȚĂRI)
    const beforeAfterContainers = document.querySelectorAll('.before-after-swiper');
    beforeAfterContainers.forEach(container => {
        if (typeof Swiper !== 'undefined') {
            new Swiper(container, {
                loop: true,
                navigation: {
                    nextEl: container.querySelector('.swiper-button-next'),
                    prevEl: container.querySelector('.swiper-button-prev'),
                },
                spaceBetween: 20,
                slidesPerView: 1,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
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
        }
    });
};