import { initHamburgerMenu } from './modules/hamburger.js';

export async function loadComponent(id, path) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const html = await response.text();
        document.getElementById(id).innerHTML = html;

        // Initialize hamburger menu if header is loaded
        if (id === 'header') {
            initHamburgerMenu();
        }

        return true;
    } catch (error) {
        console.error(`Error loading component ${id}:`, error);
        return false;
    }
}