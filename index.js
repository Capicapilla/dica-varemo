// --- 1. Inicialización de la Gráfica Radar ---
const ctx = document.getElementById('radarChart').getContext('2d');
const inputs = document.querySelectorAll('.dato');
const capturaTextos = document.querySelectorAll('.captura-texto');
const totalDisplay = document.getElementById('total-val');

Chart.register(ChartDataLabels);

const radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
        labels: ['SEO local', 'Web y SEO', 'Venta online', 'RRSS', 'Procesos'],
        datasets: [{
            label: 'Puntos',
            data: [36.25, 65, 35, 26.25, 37.5],
            backgroundColor: 'rgba(0, 105, 180, 0.2)', 
            borderColor: '#0069b4', 
            pointBackgroundColor: '#0069b4',
            borderWidth: 2,
            datalabels: {
                color: '#0069b4',
                anchor: 'end',
                align: 'top',
                offset: 8,
                font: { family: 'Montserrat', weight: 'bold', size: 16 },
                formatter: (value) => value.toFixed(2)
            }
        }]
    },
    options: {
        scales: { 
            r: { 
                min: 0, 
                max: 100,
                ticks: { 
                    color: '#D3D3D3', // <--- CAMBIADO A HEX SÓLIDO (WEB)
                    backdropColor: 'transparent', // <--- EVITA EL RECUADRO DETRÁS DEL NÚMERO
                    font: { family: 'Montserrat', size: 10 } 
                },
                grid: { color: 'rgba(224, 224, 224, 0.7)' },
                angleLines: { color: '#e0e0e0' },
                pointLabels: { 
                    color: '#333333', 
                    font: { size: 13, weight: '600', family: 'Montserrat' } 
                }
            } 
        },
        plugins: { 
            legend: { display: false },
            datalabels: { display: true } 
        }
    }
});

// --- 2. Lógica de actualización (Sin cambios) ---
inputs.forEach((input, index) => {
    input.addEventListener('input', () => {
        const val = parseFloat(input.value) || 0;
        const values = Array.from(inputs).map(i => parseFloat(i.value) || 0);
        radarChart.data.datasets[0].data = values;
        radarChart.update();
        totalDisplay.innerText = values.reduce((a, b) => a + b, 0).toFixed(2);
        capturaTextos[index].innerText = val.toFixed(2);
    });
});

// --- 3. Función: Descargar Tabla PNG (Sin cambios) ---
function descargarTabla() {
    const container = document.querySelector("#table-capture");
    container.classList.add('modo-captura');
    const allElements = container.querySelectorAll('*');
    allElements.forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.color.includes('oklch') || style.backgroundColor.includes('oklch')) {
            el.style.color = '#333333';
            el.style.backgroundColor = '#ffffff';
        }
    });
    html2canvas(container, {
        backgroundColor: "#ffffff",
        scale: 3,
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
            const clonedTable = clonedDoc.querySelector('#table-capture');
            if (clonedTable) clonedTable.style.color = '#333333';
        }
    }).then(canvas => {
        container.classList.remove('modo-captura');
        allElements.forEach(el => { el.style.color = ''; el.style.backgroundColor = ''; });
        const link = document.createElement('a');
        link.download = 'tabla-madurez-digital.png';
        link.href = canvas.toDataURL("image/png");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }).catch(err => {
        console.error("Error:", err);
        container.classList.remove('modo-captura');
    });
}

// *** IMPORTANTE: No olvides tener el script del plugin datalabels en tu HTML ***
// <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2"></script>

function descargarGrafico() {
    const canvasOriginal = document.getElementById('radarChart');
    const printSize = 1080;
    
    // Calculamos escala basada en el ancho real para que sea proporcional
    const scaleFactor = printSize / canvasOriginal.offsetWidth;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = printSize;
    tempCanvas.height = printSize;
    const tempCtx = tempCanvas.getContext('2d');

    // Fondo blanco sólido inicial con total prioridad
    tempCtx.fillStyle = '#ffffff';
    tempCtx.fillRect(0, 0, printSize, printSize);

    const originalOptions = radarChart.options;
    const originalDataset = radarChart.data.datasets[0];

    const chartRender = new Chart(tempCtx, {
        type: 'radar',
        data: JSON.parse(JSON.stringify(radarChart.data)), 
        options: {
            ...originalOptions,
            devicePixelRatio: 1, // Evitamos interferencias del monitor
            animation: false,
            responsive: false,
            maintainAspectRatio: true,
            
            // Aumentamos el padding interno para que los nombres largos no se corten
            layout: { padding: 40 * scaleFactor },

            scales: {
                r: {
                    ...originalOptions.scales.r,
                    // Ocultamos la escala de fondo del 10 al 100 para limpiar el centro
                    ticks: { display: false }, 
                    grid: { color: 'rgba(224, 224, 224, 0.3)' },
                    angleLines: { color: '#e0e0e0' },
                    
                    // *** PASO CLAVE 1: RECUPERAR Y ESCALAR LOS NOMBRES (POINTLABELS) ***
                    pointLabels: { 
                        display: true, // <--- ¡AQUÍ ESTÁN DE VUELTA!
                        color: '#333333', 
                        // Multiplicamos el tamaño de fuente original por el factor de escala
                        font: { 
                            size: 13 * scaleFactor, // Puntuación proporcional y grande
                            weight: '600', 
                            family: 'Montserrat' 
                        }
                    }
                }
            },

            plugins: {
                legend: { display: false },
                customCanvasBackgroundColor: { color: 'white' },
                
                datalabels: {
                    display: true,
                    color: '#0069b4', // Color azul
                    anchor: 'end',
                    align: 'top',
                    offset: 10 * scaleFactor, // Separación proporcional
                    
                    // *** PASO CLAVE 2: ESCALAR LA PUNTUACIÓN (DATALABELS) ***
                    font: { 
                        family: 'Montserrat',
                        weight: 'bold',
                        size: 14 * scaleFactor // Puntuación proporcional y grande
                    },
                    formatter: (value) => value.toFixed(2) // Solo el número, el nombre ya está
                }
            }
        },
        
        plugins: [ChartDataLabels, {
            id: 'customCanvasBackgroundColor',
            beforeDraw: (chart) => {
                const {ctx} = chart;
                ctx.save();
                ctx.globalCompositeOperation = 'destination-over';
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, chart.width, chart.height);
                ctx.restore();
            },
            // Mini-plugin extra para escalar grosores de línea y puntos ANTES de dibujar
            beforeUpdate: (chart) => {
                const dataset = chart.data.datasets[0];
                // *** PASO CLAVE 3: ESCALAR GROSORES PROPORCIONALMENTE ***
                dataset.borderWidth = 2 * scaleFactor; // Grosor proporcional
                dataset.pointRadius = 4 * scaleFactor; // Tamaño del punto proporcional
                dataset.pointHoverRadius = 5 * scaleFactor;
            }
        }]
    });

    // Pequeña pausa para asegurar el renderizado HD
    setTimeout(() => {
        const link = document.createElement('a');
        link.download = 'grafico-madurez-digital-PRO.png';
        link.href = tempCanvas.toDataURL("image/png", 1.0);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Limpiamos la memoria
        chartRender.destroy();
    }, 250);
}