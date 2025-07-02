export function initDateTime() {
    const dateElement = document.getElementById('date');
    const timeElement = document.getElementById('time');

    function updateDateTime() {
        const now = new Date();
        
        // Format date
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const date = now.toLocaleDateString('ro-RO', dateOptions);
        
        // Format time
        const timeOptions = { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            hour12: false 
        };
        const time = now.toLocaleTimeString('ro-RO', timeOptions);

        // Update elements
        if (dateElement) dateElement.textContent = date;
        if (timeElement) timeElement.textContent = time;
    }

    // Initial update
    updateDateTime();

    // Update every second
    setInterval(updateDateTime, 1000);
}