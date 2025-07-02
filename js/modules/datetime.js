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
    const capitalizeWords = (str) => {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    };

    /**
     * Updates the date display
     */
    const updateDate = () => {
        if (dateElement) {
            const now = new Date();
            let formattedDate = new Intl.DateTimeFormat(LOCALE, DATE_OPTIONS).format(now);
            formattedDate = capitalizeWords(formattedDate);
            dateElement.textContent = formattedDate;
        }
    };

    /**
     * Updates the time display
     */
    const updateTime = () => {
        if (timeElement) {
            const now = new Date();
            const formattedTime = new Intl.DateTimeFormat(LOCALE, TIME_OPTIONS).format(now);
            timeElement.textContent = formattedTime;
        }
    };

    // Initial update
    updateDate();
    updateTime();

    // Update date once per day at midnight
    const startOfTomorrow = new Date();
    startOfTomorrow.setHours(24, 0, 0, 0);
    const timeToMidnight = startOfTomorrow - new Date();

    // Set timeout for date update at midnight
    const dateTimeout = setTimeout(function updateDateDaily() {
        updateDate();
        // Setup next update for tomorrow
        setTimeout(updateDateDaily, 24 * 60 * 60 * 1000);
    }, timeToMidnight);

    // Update time every second
    const timeInterval = setInterval(updateTime, 1000);

    // Return cleanup function
    return () => {
        clearTimeout(dateTimeout);
        clearInterval(timeInterval);
    };
}