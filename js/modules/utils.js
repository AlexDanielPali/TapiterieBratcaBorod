// Utility functions for the website

export function ResponsiveNavBar() {
    var x = document.getElementById("myNavMenu");
    if (x.className === "navbar") {
        x.className += " responsive";
    } else {
        x.className = "navbar";
    }
}

export function expandImage(imgs) {
    var expandImg = document.getElementById("expandedImg");
    var imgText = document.getElementById("imgtext");
    expandImg.src = imgs.src;
    imgText.innerHTML = imgs.alt;
    expandImg.parentElement.style.display = "block";
}

// Make functions globally available for onclick handlers
window.ResponsiveNavBar = ResponsiveNavBar;
window.expandImage = expandImage;
