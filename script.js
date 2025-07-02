
// =====================================================
// ACEST FIȘIER NU MAI ESTE UTILIZAT ACTIV
// =====================================================
// Funcționalitatea a fost mutată în sistemul modular ES6:
// - js/modules/datetime.js - pentru funcționalitatea de dată și oră
// - js/modules/swiper.js - pentru slider-urile Swiper
// - js/modules/utils.js - pentru funcții utilitare
// - js/modules/index.js - pentru inițializarea paginii principale
// =====================================================

// ACEST COD ESTE PĂSTRAT PENTRU REFERINȚĂ
/*
// Function to update the time and date
function updateDateTime() {
    var currentDate = new Date(); // Get the current date and time

    // Format the date
    var date = currentDate.toLocaleDateString(); // Formats to the user's local date format
    // Format the time
    var time = currentDate.toLocaleTimeString(); // Formats to the user's local time format

    // Display date and time in the elements with IDs 'date' and 'time'
    document.getElementById("date").innerHTML = date;
    document.getElementById("time").innerHTML = time;
}

// Update the time every second
setInterval(updateDateTime, 1000);

// Initial update on page load
window.onload = updateDateTime;

// Slider pentru galeria de imagini individuale
const swiper1 = new Swiper('.home-images-container', {
    loop: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    spaceBetween: 20,
    slidesPerView: 3,
});

// Slider pentru secțiunea înainte-după
const swiper2 = new Swiper('.before-after-swiper', {
    loop: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    spaceBetween: 20,
    slidesPerView: 3,
});

function ResponsiveNavBar() {
    var x = document.getElementById("myNavMenu");
    if (x.className === "navbar") {
      x.className += " responsive";
    } else {
      x.className = "navbar";
    }
  }
  
function expandImage(imgs) {
    var expandImg = document.getElementById("expandedImg");
    var imgText = document.getElementById("imgtext");
    expandImg.src = imgs.src;
    imgText.innerHTML = imgs.alt;
    expandImg.parentElement.style.display = "block";
}
*/