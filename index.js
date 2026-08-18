// --- 1. Inicialización de los Gráficos Radar ---
const ctxInicial = document.getElementById('radarChartInicial').getContext('2d');
const ctxEvolucion = document.getElementById('radarChartEvolucion').getContext('2d');

const inputsInicial = document.querySelectorAll('.dato-inicial');
const capturaTextosInicial = document.querySelectorAll('.captura-texto-inicial');
const totalDisplayInicial = document.getElementById('total-val-inicial');

const inputsEvolucion = document.querySelectorAll('.dato-evolucion');
const capturaTextosEvolucion = document.querySelectorAll('.captura-texto-evolucion');
const totalDisplayEvolucion = document.getElementById('total-val-evolucion');

Chart.register(ChartDataLabels);

// Gráfico 1: Solo Evaluación Inicial (Azul)
const radarChartInicial = new Chart(ctxInicial, {
    type: 'radar',
    data: {
        labels: ['SEO local', 'Web y SEO', 'Venta online', 'RRSS', 'Procesos'],
        datasets: [{
            label: 'Inicial',
            data: [0, 0, 0, 0, 0],
            backgroundColor: 'rgba(0, 105, 180, 0.2)', 
            borderColor: '#0069b4', 
            pointBackgroundColor: '#0069b4',
            borderWidth: 2,
            datalabels: {
                color: '#0069b4',
                anchor: 'end',
                align: 'end',
                offset: 4,
                font: { family: 'Montserrat', weight: 'bold', size: 11.5 },
                formatter: (value) => value === 0 ? '' : (value % 1 === 0 ? value.toFixed(0) : value.toFixed(1))
            }
        }]
    },
    options: {
        scales: { 
            r: { 
                min: 0, 
                max: 100,
                ticks: { 
                    color: '#D3D3D3', 
                    backdropColor: 'transparent', 
                    font: { family: 'Montserrat', size: 10 },
                    callback: (value) => value === 100 ? '' : value
                },
                grid: { color: 'rgba(224, 224, 224, 0.7)' },
                angleLines: { color: '#e0e0e0' },
                pointLabels: { 
                    color: '#333333', 
                    font: { size: 13, weight: '600', family: 'Montserrat' },
                    padding: 35
                }
            } 
        },
        plugins: { 
            legend: { display: false },
            datalabels: { display: true } 
        }
    }
});

// Gráfico 2: Inicial (Azul abajo) + Evolución (Amarillo arriba)
const radarChartEvolucion = new Chart(ctxEvolucion, {
    type: 'radar',
    data: {
        labels: ['SEO local', 'Web y SEO', 'Venta online', 'RRSS', 'Procesos'],
        datasets: [
            {
                label: 'Inicial',
                data: [0, 0, 0, 0, 0],
                backgroundColor: 'rgba(0, 105, 180, 0.1)', 
                borderColor: 'rgba(0, 105, 180, 0.5)', 
                pointBackgroundColor: 'rgba(0, 105, 180, 0.8)',
                borderWidth: 2,
                datalabels: {
                    color: '#0069b4',
                    anchor: 'end',
                    align: 'start',
                    offset: 0, // Pegado al punto (lejos del centro) para evitar solapamientos en valores pequeños
                    font: { family: 'Montserrat', weight: 'bold', size: 9.5 },
                    formatter: (value) => value === 0 ? '' : (value % 1 === 0 ? value.toFixed(0) : value.toFixed(1))
                }
            },
            {
                label: 'Evolución',
                data: [0, 0, 0, 0, 0],
                backgroundColor: 'rgba(242, 194, 0, 0.25)', 
                borderColor: '#f2c200', 
                pointBackgroundColor: '#f2c200',
                borderWidth: 2.5,
                datalabels: {
                    color: '#cda400', 
                    anchor: 'end',
                    align: 'end',
                    offset: 4, 
                    font: { family: 'Montserrat', weight: 'bold', size: 11.5 },
                    formatter: (value) => value === 0 ? '' : (value % 1 === 0 ? value.toFixed(0) : value.toFixed(1))
                }
            }
        ]
    },
    options: {
        scales: { 
            r: { 
                min: 0, 
                max: 100,
                ticks: { 
                    color: '#D3D3D3', 
                    backdropColor: 'transparent', 
                    font: { family: 'Montserrat', size: 10 },
                    callback: (value) => value === 100 ? '' : value
                },
                grid: { color: 'rgba(224, 224, 224, 0.7)' },
                angleLines: { color: '#e0e0e0' },
                pointLabels: { 
                    color: '#333333', 
                    font: { size: 13, weight: '600', family: 'Montserrat' },
                    padding: 35
                }
            } 
        },
        plugins: { 
            legend: { 
                display: true,
                position: 'top',
                labels: {
                    font: { family: 'Montserrat', weight: 'bold', size: 11 }
                }
            },
            datalabels: { display: true } 
        }
    }
});

// Eventos para la tabla Inicial
inputsInicial.forEach((input, index) => {
    input.addEventListener('input', () => {
        let val = parseFloat(input.value) || 0;
        if (val > 100) {
            val = 100;
            input.value = 100;
        } else if (val < 0) {
            val = 0;
            input.value = 0;
        }
        const values = Array.from(inputsInicial).map(i => parseFloat(i.value) || 0);
        
        // Actualizar gráfico inicial
        radarChartInicial.data.datasets[0].data = values;
        radarChartInicial.update();
        
        // Actualizar capa inicial en gráfico de evolución
        radarChartEvolucion.data.datasets[0].data = values;
        radarChartEvolucion.update();
        
        totalDisplayInicial.innerText = values.reduce((a, b) => a + b, 0).toFixed(2);
        capturaTextosInicial[index].innerText = val.toFixed(2);
    });
});

// Eventos para la tabla Evolución
inputsEvolucion.forEach((input, index) => {
    input.addEventListener('input', () => {
        let val = parseFloat(input.value) || 0;
        if (val > 100) {
            val = 100;
            input.value = 100;
        } else if (val < 0) {
            val = 0;
            input.value = 0;
        }
        const values = Array.from(inputsEvolucion).map(i => parseFloat(i.value) || 0);
        
        // Actualizar capa evolución en gráfico de evolución
        radarChartEvolucion.data.datasets[1].data = values;
        radarChartEvolucion.update();
        
        totalDisplayEvolucion.innerText = values.reduce((a, b) => a + b, 0).toFixed(2);
        capturaTextosEvolucion[index].innerText = val.toFixed(2);
    });
});

// --- 3. Funciones de Exportación PNG ---

function descargarTablaGenerica(containerId, nombreArchivo) {
    const container = document.querySelector(containerId);
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
            const clonedTable = clonedDoc.querySelector(containerId);
            if (clonedTable) clonedTable.style.color = '#333333';
        }
    }).then(canvas => {
        container.classList.remove('modo-captura');
        allElements.forEach(el => { el.style.color = ''; el.style.backgroundColor = ''; });
        const link = document.createElement('a');
        link.download = nombreArchivo;
        link.href = canvas.toDataURL("image/png");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }).catch(err => {
        console.error("Error al exportar la tabla:", err);
        container.classList.remove('modo-captura');
    });
}

function descargarTablaInicial() {
    descargarTablaGenerica('#table-capture-inicial', 'tabla-madurez-digital-inicial.png');
}

// Para compatibilidad por si se llamaba desde otro sitio
function descargarTabla() {
    descargarTablaInicial();
}

function descargarTablaEvolucion() {
    descargarTablaGenerica('#table-capture-evolucion', 'tabla-madurez-digital-evolucion.png');
}

function descargarGraficoGenerico(chartInstance, nombreArchivo) {
    const exportScale = 3; 
    const originalDpr = chartInstance.options.devicePixelRatio || window.devicePixelRatio || 1;
    const originalAnimation = chartInstance.options.animation;

    chartInstance.options.devicePixelRatio = exportScale;
    chartInstance.options.animation = false;
    chartInstance.resize();
    chartInstance.update('none');

    const link = document.createElement('a');
    link.download = nombreArchivo;
    link.href = chartInstance.toBase64Image('image/png', 1);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    chartInstance.options.devicePixelRatio = originalDpr;
    chartInstance.options.animation = originalAnimation;
    chartInstance.resize();
    chartInstance.update('none');
}

function descargarGraficoInicial() {
    descargarGraficoGenerico(radarChartInicial, 'grafico-madurez-digital-inicial.png');
}

// Para compatibilidad
function descargarGrafico() {
    descargarGraficoInicial();
}

function descargarGraficoEvolucion() {
    descargarGraficoGenerico(radarChartEvolucion, 'grafico-madurez-digital-evolucion.png');
}
