// --- 1. Inicialización de la Gráfica Radar ---
const ctx = document.getElementById('radarChart').getContext('2d');
const inputs = document.querySelectorAll('.dato');
const capturaTextos = document.querySelectorAll('.captura-texto');
const totalDisplay = document.getElementById('total-val');

// REGISTRAMOS EL PLUGIN (Indispensable para que aparezcan los números)
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
            // CONFIGURACIÓN DE LOS NÚMEROS EN LA WEB
            datalabels: {
                color: '#0069b4',
                anchor: 'end',
                align: 'top',
                offset: 5,
                font: { 
                    family: 'Montserrat', 
                    weight: 'bold', 
                    size: 12 
                },
                formatter: (value) => value.toFixed(2)
            }
        }]
    },
    options: {
        scales: { 
            r: { 
                min: 0, 
                max: 100,
                ticks: { color: 'rgba(224, 224, 224)', 
                font: { family: 'Montserrat' } },
                grid: { color: 'rgba(224, 224, 224, 0.7)' },
                angleLines: { color: '#e0e0e0' },
                pointLabels: { 
                    color: '#333333', 
                    font: { size: 12, weight: '600', family: 'Montserrat' } 
                }
            } 
        },
        plugins: { 
            legend: { display: false },
            datalabels: { display: true } // Activa el plugin
        }
    }
});

// --- 2. Lógica de actualización ---
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

// --- 3. Función: Descargar Tabla PNG ---
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

// --- 4. Función: Descargar Gráfico PNG (VERSIÓN 1080px HD) ---
function descargarGrafico() {
    const canvasOriginal = document.getElementById('radarChart');
    const printSize = 1080;
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = printSize;
    tempCanvas.height = printSize;
    const tempCtx = tempCanvas.getContext('2d');

    // --- PASO CLAVE: Forzar fondo blanco inicial ---
    tempCtx.fillStyle = '#ffffff';
    tempCtx.fillRect(0, 0, printSize, printSize);

    const chartRender = new Chart(tempCtx, {
        type: 'radar',
        data: JSON.parse(JSON.stringify(radarChart.data)), 
        options: {
            ...radarChart.options,
            devicePixelRatio: 1,
            animation: false,
            responsive: false,
            maintainAspectRatio: true,
            // --- PASO CLAVE 2: Plugin interno para forzar fondo blanco en el render ---
            plugins: {
                legend: { display: false },
                customCanvasBackgroundColor: {
                    color: 'white',
                },
                datalabels: {
                    display: true,
                    color: '#0069b4',
                    anchor: 'end',
                    align: 'top',
                    offset: 12,
                    font: { size: 30, weight: 'bold', family: 'Montserrat' },
                    formatter: (value) => value.toFixed(2)
                }
            }
        },
        plugins: [ChartDataLabels, {
            // Este mini-plugin asegura que el fondo sea blanco antes de dibujar el radar
            id: 'customCanvasBackgroundColor',
            beforeDraw: (chart) => {
                const {ctx} = chart;
                ctx.save();
                ctx.globalCompositeOperation = 'destination-over';
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, chart.width, chart.height);
                ctx.restore();
            }
        }]
    });

    setTimeout(() => {
        const link = document.createElement('a');
        link.download = 'grafico-madurez-digital-HD.png';
        
        // Usamos image/jpeg si quieres asegurar que NO haya transparencias, 
        // pero image/png con el fondo pintado también funciona perfecto.
        link.href = tempCanvas.toDataURL("image/png", 1.0);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        chartRender.destroy();
    }, 200); // Aumentamos un pelín el tiempo para asegurar el renderizado
}