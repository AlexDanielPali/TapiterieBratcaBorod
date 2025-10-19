const hamburger = document.getElementById('hamburger-menu');
const navList = document.querySelector('.navbar ul');

if (hamburger && navList) {
    // Ensure ARIA defaults
    hamburger.setAttribute('aria-expanded', 'false');
    navList.setAttribute('aria-hidden', 'true');

    function openMenu() {
        navList.classList.add('active');
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        navList.setAttribute('aria-hidden', 'false');
        document.body.classList.add('menu-open');
        // move focus to first link
        const firstLink = navList.querySelector('a');
        if (firstLink) firstLink.focus();
        // listen for outside clicks
        setTimeout(() => document.addEventListener('click', onDocClick), 0);
        // enable focus trap
        document.addEventListener('keydown', onKeyDownTrap);
    }

    function closeMenu() {
        navList.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        navList.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('menu-open');
        document.removeEventListener('click', onDocClick);
        document.removeEventListener('keydown', onKeyDownTrap);
        hamburger.focus();
    }

    function onDocClick(e) {
        if (!navList.contains(e.target) && e.target !== hamburger) closeMenu();
    }

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (navList.classList.contains('active')) closeMenu(); else openMenu();
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navList.classList.contains('active')) closeMenu();
    });

    // Focus trap for menu when open
    function onKeyDownTrap(e){
      if (!navList.classList.contains('active')) return;
      if (e.key !== 'Tab') return;
      const focusable = Array.from(navList.querySelectorAll('a, button')).filter(el => !el.hasAttribute('disabled'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length -1];
      if (e.shiftKey && document.activeElement === first){
          e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last){
          e.preventDefault(); first.focus();
      }
    }
}