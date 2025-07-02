/**
 * Hamburger menu functionality
 * @module hamburger
 */

/**
 * Initializes the hamburger menu functionality
 * @returns {Object} An object with methods to control the menu
 */
export function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger-menu');
    const nav = document.getElementById('main-nav');

    // Exit early if elements don't exist
    if (!hamburger || !nav) {
        console.warn('Elementele pentru meniul hamburger nu au fost găsite');
        return {
            open: () => {},
            close: () => {},
            toggle: () => {}
        };
    }

    // Add ARIA attributes for accessibility
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-controls', 'main-nav');
    hamburger.setAttribute('aria-label', 'Meniu');
    hamburger.setAttribute('role', 'button');
    hamburger.setAttribute('tabindex', '0');

    // Click handler for hamburger
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });
    
    // Keyboard handler for hamburger
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('active') &&
            !nav.contains(e.target) &&
            !hamburger.contains(e.target)) {
            closeMenu();
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            closeMenu();
        }
    });

    // Set up resize listener with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        }, 250); // 250ms debounce
    });

    /**
     * Toggles the menu state
     */
    function toggleMenu() {
        const isOpen = hamburger.classList.contains('active');
        
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    /**
     * Opens the menu
     */
    function openMenu() {
        hamburger.classList.add('active');
        nav.classList.add('active');
        document.body.classList.add('menu-open');
        hamburger.setAttribute('aria-expanded', 'true');
    }

    /**
     * Closes the menu
     */
    function closeMenu() {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        document.body.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
    }

    // Return methods for external control
    return {
        open: openMenu,
        close: closeMenu,
        toggle: toggleMenu
    };
}