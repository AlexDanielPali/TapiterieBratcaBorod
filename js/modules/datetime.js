/**
 * Date and time display functionality
 * @module datetime
 */

/**
 * The locale to use for date and time formatting
 * @type {string}
 */
const LOCALE = 'ro-RO';

/**
 * Date formatting options
 * @type {Intl.DateTimeFormatOptions}
 */
const DATE_OPTIONS = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
};

/**
 * Time formatting options
 * @type {Intl.DateTimeFormatOptions}
 */
const TIME_OPTIONS = { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    hour12: false 
};

/**
 * Initializes and maintains the date and time display on the page
 * @returns {function} A cleanup function that clears the interval
 */
export function initDateTime() {
    const dateElement = document.getElementById('date');
    const timeElement = document.getElementById('time');

    // Exit early if elements don't exist
    if (!dateElement && !timeElement) {
        console.warn('Elementele pentru dată și oră nu au fost găsite');
        return () => {}; // Return empty cleanup function
    }

    /**
     * Capitalizes the first letter of each word in a string
     * @param {string} str - The string to capitalize
     * @returns {string} The capitalized string
     */
    function capitalizeWords(str) {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    }

    /**
     * Updates the date and time display
     */
    function updateDateTime() {
        const now = new Date();
        
        // Format date with Romanian locale
        const date = now.toLocaleDateString(LOCALE, DATE_OPTIONS);
        
        // Capitalize first letter of each word in date
        const formattedDate = capitalizeWords(date);
        
        // Format time with Romanian locale
        const time = now.toLocaleTimeString(LOCALE, TIME_OPTIONS);

        // Update elements if they exist
        if (dateElement) {
            dateElement.textContent = formattedDate;
            // Add title for screen readers
            dateElement.setAttribute('title', `Data curentă: ${formattedDate}`);
        }
        
        if (timeElement) {
            timeElement.textContent = time;
            timeElement.setAttribute('title', `Ora curentă: ${time}`);
        }
    }

    // Initial update
    updateDateTime();

    // Update every second
    const intervalId = setInterval(updateDateTime, 1000);

    /**
     * Format a date for display
     * @param {Date|string} date - The date to format
     * @param {boolean} [includeTime=false] - Whether to include the time
     * @returns {string} The formatted date string
     */
    function formatDate(date, includeTime = false) {
        const dateObj = date instanceof Date ? date : new Date(date);
        let options = { ...DATE_OPTIONS };
        
        if (includeTime) {
            options = { ...options, ...TIME_OPTIONS };
        }
        
        return capitalizeWords(dateObj.toLocaleDateString(LOCALE, options));
    }

    // Expose the formatDate function globally
    window.formatDate = formatDate;

    // Return cleanup function to clear interval if needed
    return function cleanup() {
        clearInterval(intervalId);
        // Remove global function when cleaning up
        delete window.formatDate;
    };
}