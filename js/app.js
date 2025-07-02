import { initSwiper } from './modules/swiper.js';
import { initDateTime } from './modules/datetime.js';
import { initGallery } from './modules/gallery.js';

document.addEventListener('DOMContentLoaded', async () => {
    const components = ['header', 'welcome-section', 'product-gallery', 'recent-product', 'before-after', 'footer'];
    
    for (const component of components) {
        const response = await fetch(`components/${component}.html`);
        const html = await response.text();
        document.getElementById(component).innerHTML = html;
    }


    initSwiper();
    initDateTime();
    initGallery();
});