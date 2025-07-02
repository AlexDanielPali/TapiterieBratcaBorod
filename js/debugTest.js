export function testComponentLoading() {
    indexComponents.forEach(async ({id, path}) => {
        try {
            const response = await fetch(path);
            console.log(`Component ${id}: ${response.ok ? 'OK' : 'Failed'} (${response.status})`);
            if (!response.ok) {
                console.error(`Failed to load ${path}`);
            }
        } catch (error) {
            console.error(`Error testing ${id}:`, error);
        }
    });
}