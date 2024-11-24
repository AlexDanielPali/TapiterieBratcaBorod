
var swiper1 = new Swiper('.home-gallery.swiper', {
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        loop: true,
        effect: 'slide', // Poți alege și alte efecte cum ar fi fade sau cube
    });

    // Slider pentru imagini înainte și după
    var swiper2 = new Swiper('.before-after.swiper', {
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        loop: true,
        effect: 'slide',
    });


document.addEventListener("DOMContentLoaded", function() {
    // Sortare imagini în funcție de data specificată în atributul data-date
    function sortGalleryImages() {
        const albumGrids = document.querySelectorAll('.album-grid');
        
        albumGrids.forEach(albumGrid => {
            const images = Array.from(albumGrid.querySelectorAll('img'));
            images.sort((a, b) => new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date')));
            
            // Eliminăm imaginile și le re-adăugăm în ordine sortată
            albumGrid.innerHTML = '';
            images.forEach(img => albumGrid.appendChild(img));
        });
    }

    // Funcție pentru actualizarea orei și datei în footer
    function updateDateTime() {
        const now = new Date();
        const formattedDateTime = now.toLocaleString("ro-RO", {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        document.getElementById('currentDateTime').textContent = `Data și ora curentă: ${formattedDateTime}`;
    }

    // Apelăm funcțiile la încărcarea paginii
    sortGalleryImages();
    updateDateTime();
    setInterval(updateDateTime, 60000); // Actualizare la fiecare minut
});


window.addEventListener('DOMContentLoaded', function() {
    // Select all album grids
    const albumGrids = document.querySelectorAll('.album-grid');
    
    albumGrids.forEach(function(grid) {
        // Check the number of images in each grid
        const images = grid.querySelectorAll('img');
        
        // If there's only one image, adjust the layout
        if (images.length === 1) {
            grid.classList.add('single-image'); // Add class for single image
        } else {
            grid.classList.remove('single-image'); // Remove class for multiple images
        }
    });
});
