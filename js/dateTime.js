function updateDateTime() {
        const now = new Date();

        // Format date: e.g., "18 Octombrie 2025"
        const optionsDate = { day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = now.toLocaleDateString('ro-RO', optionsDate);

        // Format time: e.g., "20:51:03"
        const formattedTime = now.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        // Update DOM
        document.getElementById('date').textContent = formattedDate;
        document.getElementById('time').textContent = formattedTime;
    }

    // Initial call
    updateDateTime();

    // Update every second
    setInterval(updateDateTime, 1000);