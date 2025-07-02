/**
 * Debug and testing functionality
 * @module debugTest
 */

// Configuration for debug mode
let debugMode = false;

/**
 * Components to test
 * @type {Array<{id: string, path: string}>}
 */
const testComponents = [
    { id: 'header', path: 'components/layout/header.html' },
    { id: 'footer', path: 'components/layout/footer.html' },
    { id: 'welcome-section', path: 'components/home-components/welcome-section.html' },
    { id: 'product-gallery', path: 'components/home-components/product-gallery.html' },
    { id: 'recent-product', path: 'components/home-components/recent-product.html' },
    { id: 'before-after', path: 'components/home-components/before-after.html' },
    { id: 'produse-noi', path: 'components/service-components/produse-noi.html' },
    { id: 'retapitari', path: 'components/service-components/retapitari.html' }
];

/**
 * Image paths to test
 * @type {Array<string>}
 */
const testImages = [
    'assets/images/logo.png',
    'assets/images/fundal.jpg',
    'assets/images/Produse noi/imagine1.jpg',
    'assets/images/Produse noi/imagine2.jpg',
    'assets/images/Retapitari/inainte.jpg',
    'assets/images/Retapitari/dupa.jpg',
    'assets/videos/MicrosoftTeams-video.mp4'
];

/**
 * Test component loading
 * @async
 * @returns {Promise<{success: number, failed: number, results: Array}>} Test results
 */
export async function testComponentLoading() {
    const results = {
        success: 0,
        failed: 0,
        results: []
    };
    
    console.group('Test încărcare componente');
    console.time('Durată totală teste componente');
    
    for (const component of testComponents) {
        try {
            console.time(`Testare ${component.id}`);
            const response = await fetch(component.path);
            console.timeEnd(`Testare ${component.id}`);
            
            const status = response.ok ? 'Succes' : 'Eșuat';
            const result = {
                id: component.id,
                path: component.path,
                status,
                statusCode: response.status
            };
            
            results.results.push(result);
            
            if (response.ok) {
                results.success++;
                console.log(`✅ Componenta ${component.id}: ${status} (${response.status})`);
            } else {
                results.failed++;
                console.error(`❌ Componenta ${component.id}: ${status} (${response.status})`);
            }
        } catch (error) {
            results.failed++;
            const result = {
                id: component.id,
                path: component.path,
                status: 'Eroare',
                error: error.message
            };
            
            results.results.push(result);
            console.error(`❌ Eroare la testarea ${component.id}:`, error);
        }
    }
    
    console.timeEnd('Durată totală teste componente');
    console.log(`Rezumat: ${results.success} reușite, ${results.failed} eșuate`);
    console.groupEnd();
    
    return results;
}

/**
 * Test image loading
 * @async
 * @returns {Promise<{success: number, failed: number, results: Array}>} Test results
 */
export async function testImageLoading() {
    const results = {
        success: 0,
        failed: 0,
        results: []
    };
    
    console.group('Test încărcare imagini');
    console.time('Durată totală teste imagini');
    
    for (const imagePath of testImages) {
        try {
            const start = performance.now();
            const response = await fetch(imagePath);
            const end = performance.now();
            const loadTime = end - start;
            
            const status = response.ok ? 'Succes' : 'Eșuat';
            const result = {
                path: imagePath,
                status,
                statusCode: response.status,
                loadTime: `${loadTime.toFixed(2)}ms`
            };
            
            results.results.push(result);
            
            if (response.ok) {
                results.success++;
                console.log(`✅ Imagine ${imagePath}: ${status} (${response.status}, ${loadTime.toFixed(2)}ms)`);
            } else {
                results.failed++;
                console.error(`❌ Imagine ${imagePath}: ${status} (${response.status})`);
            }
        } catch (error) {
            results.failed++;
            const result = {
                path: imagePath,
                status: 'Eroare',
                error: error.message
            };
            
            results.results.push(result);
            console.error(`❌ Eroare la testarea imaginii ${imagePath}:`, error);
        }
    }
    
    console.timeEnd('Durată totală teste imagini');
    console.log(`Rezumat: ${results.success} reușite, ${results.failed} eșuate`);
    console.groupEnd();
    
    return results;
}

/**
 * Run all tests
 * @async
 * @returns {Promise<Object>} All test results
 */
export async function runAllTests() {
    console.group('Rulare teste complete');
    console.time('Durată totală toate testele');
    
    const componentResults = await testComponentLoading();
    const imageResults = await testImageLoading();
    
    console.timeEnd('Durată totală toate testele');
    
    const results = {
        components: componentResults,
        images: imageResults,
        summary: {
            success: componentResults.success + imageResults.success,
            failed: componentResults.failed + imageResults.failed,
            total: componentResults.success + componentResults.success + 
                   imageResults.failed + imageResults.failed
        }
    };
    
    console.log('Rezumat teste complete:', results.summary);
    console.groupEnd();
    
    return results;
}

/**
 * Measure page performance
 * @returns {Object} Performance metrics
 */
export function measurePerformance() {
    if (!window.performance || !window.performance.getEntriesByType) {
        console.warn('API-ul de performanță nu este disponibil în acest browser');
        return null;
    }
    
    // Get performance entries
    const navigationTiming = performance.getEntriesByType('navigation')[0];
    const resourceTiming = performance.getEntriesByType('resource');
    
    // Calculate metrics
    const pageLoadTime = navigationTiming.loadEventEnd - navigationTiming.startTime;
    const domContentLoaded = navigationTiming.domContentLoadedEventEnd - navigationTiming.startTime;
    const firstPaint = performance.getEntriesByName('first-paint')[0]?.startTime || 'N/A';
    
    // Group resources by type
    const resources = {
        images: [],
        scripts: [],
        stylesheets: [],
        fonts: [],
        other: []
    };
    
    resourceTiming.forEach(resource => {
        const url = resource.name;
        const fileExtension = url.split('.').pop().toLowerCase();
        const type = resource.initiatorType;
        
        const resourceData = {
            url: url.split('/').pop(),
            size: resource.transferSize,
            duration: resource.duration.toFixed(2)
        };
        
        if (type === 'img' || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension)) {
            resources.images.push(resourceData);
        } else if (type === 'script' || fileExtension === 'js') {
            resources.scripts.push(resourceData);
        } else if (type === 'link' || ['css'].includes(fileExtension)) {
            resources.stylesheets.push(resourceData);
        } else if (['woff', 'woff2', 'ttf', 'otf'].includes(fileExtension)) {
            resources.fonts.push(resourceData);
        } else {
            resources.other.push(resourceData);
        }
    });
    
    // Compile results
    const metrics = {
        pageLoadTime: pageLoadTime.toFixed(2) + 'ms',
        domContentLoaded: domContentLoaded.toFixed(2) + 'ms',
        firstPaint: typeof firstPaint === 'number' ? firstPaint.toFixed(2) + 'ms' : firstPaint,
        resourceCounts: {
            images: resources.images.length,
            scripts: resources.scripts.length,
            stylesheets: resources.stylesheets.length,
            fonts: resources.fonts.length,
            other: resources.other.length,
            total: resourceTiming.length
        },
        resources
    };
    
    console.group('Metrici de performanță');
    console.table({
        'Timp încărcare pagină': metrics.pageLoadTime,
        'DOM Content Loaded': metrics.domContentLoaded,
        'First Paint': metrics.firstPaint
    });
    console.log('Resurse:', metrics.resourceCounts);
    console.groupEnd();
    
    return metrics;
}

/**
 * Toggle debug mode
 * @param {boolean} enabled - Whether debug mode should be enabled
 */
export function toggleDebugMode(enabled) {
    debugMode = enabled;
    
    if (enabled) {
        console.log('Mod debug activat');
        document.body.classList.add('debug-mode');
        
        // Add debug overlay
        if (!document.getElementById('debug-overlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'debug-overlay';
            overlay.className = 'debug-overlay';
            overlay.innerHTML = `
                <div class="debug-controls">
                    <h3>Debug Mode</h3>
                    <button id="run-tests">Rulează teste</button>
                    <button id="measure-performance">Măsoară performanța</button>
                    <button id="exit-debug">Ieșire mod debug</button>
                </div>
                <div class="debug-output"></div>
            `;
            document.body.appendChild(overlay);
            
            // Add event listeners
            document.getElementById('run-tests').addEventListener('click', () => {
                runAllTests().then(results => {
                    document.querySelector('.debug-output').innerHTML = `
                        <h4>Rezultate teste</h4>
                        <pre>${JSON.stringify(results, null, 2)}</pre>
                    `;
                });
            });
            
            document.getElementById('measure-performance').addEventListener('click', () => {
                const metrics = measurePerformance();
                document.querySelector('.debug-output').innerHTML = `
                    <h4>Metrici de performanță</h4>
                    <pre>${JSON.stringify(metrics, null, 2)}</pre>
                `;
            });
            
            document.getElementById('exit-debug').addEventListener('click', () => {
                toggleDebugMode(false);
            });
        }
    } else {
        console.log('Mod debug dezactivat');
        document.body.classList.remove('debug-mode');
        
        // Remove debug overlay if it exists
        const overlay = document.getElementById('debug-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
}

// Add debug mode toggle to window object for console access
window.toggleDebugMode = toggleDebugMode;
window.runTests = runAllTests;
window.measurePerformance = measurePerformance;