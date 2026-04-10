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
                offset: 6,
                font: { family: 'Montserrat', weight: 'bold', size: 12 },
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
    const exportScale = 3; // 3x para PNG nítido sin deformar proporciones
    const originalDpr = radarChart.options.devicePixelRatio || window.devicePixelRatio || 1;
    const originalAnimation = radarChart.options.animation;

    // Subimos resolución interna sin cambiar tamaño visual
    radarChart.options.devicePixelRatio = exportScale;
    radarChart.options.animation = false;
    radarChart.resize();
    radarChart.update('none');

    const link = document.createElement('a');
    link.download = 'grafico-madurez-digital-PRO.png';
    link.href = radarChart.toBase64Image('image/png', 1);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Restauramos estado original
    radarChart.options.devicePixelRatio = originalDpr;
    radarChart.options.animation = originalAnimation;
    radarChart.resize();
    radarChart.update('none');
}
