// --- 1. Inicialización de la Gráfica Radar ---
const ctx = document.getElementById('radarChart').getContext('2d');
const inputs = document.querySelectorAll('.dato');
const capturaTextos = document.querySelectorAll('.captura-texto');
const totalDisplay = document.getElementById('total-val');

const radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
        labels: ['SEO local', 'Web y SEO', 'Venta online', 'RRSS', 'Procesos'],
        datasets: [{
            label: 'Puntos',
            data: [36.25, 65, 35, 26.25, 37.5],
            backgroundColor: 'rgba(163, 127, 76, 0.2)', 
            borderColor: 'rgb(163, 127, 76)', 
            pointBackgroundColor: 'rgb(163, 127, 76)',
            borderWidth: 2
        }]
    },
    options: {
        scales: { 
            r: { 
                min: 0, 
                max: 100,
                ticks: { color: '#888888', font: { family: 'Montserrat' } },
                grid: { color: '#e0e0e0' },
                angleLines: { color: '#e0e0e0' },
                pointLabels: { 
                    color: '#333333', 
                    font: { size: 12, weight: '600', family: 'Montserrat' } 
                }
            } 
        },
        plugins: { legend: { display: false } }
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

// --- 3. Función: Descargar Tabla PNG (CON LIMPIEZA DE ESTILOS) ---
function descargarTabla() {
    const container = document.querySelector("#table-capture");
    
    // 1. Activar modo captura
    container.classList.add('modo-captura');

    // 2. PARCHE CRÍTICO: Eliminamos temporalmente cualquier estilo que use oklch
    // Buscamos en todo el documento si hay estilos inyectados que den problemas
    const allElements = container.querySelectorAll('*');
    allElements.forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.color.includes('oklch') || style.backgroundColor.includes('oklch')) {
            el.style.color = '#333333'; // Forzamos a gris oscuro
            el.style.backgroundColor = '#ffffff'; // Forzamos a blanco
        }
    });

    html2canvas(container, {
        backgroundColor: "#ffffff",
        scale: 3, // Subimos a 3 para que se vea súper nítida
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
            // Aseguramos que en el clon que usa html2canvas no exista oklch
            const clonedTable = clonedDoc.querySelector('#table-capture');
            clonedTable.style.color = '#333333';
        }
    }).then(canvas => {
        container.classList.remove('modo-captura');
        
        // Limpiamos los estilos forzados (para que el usuario siga viendo su diseño original)
        allElements.forEach(el => { el.style.color = ''; el.style.backgroundColor = ''; });

        const link = document.createElement('a');
        link.download = 'tabla-madurez-digital.png';
        link.href = canvas.toDataURL("image/png");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }).catch(err => {
        console.error("Error detallado:", err);
        container.classList.remove('modo-captura');
        alert("Fallo al generar imagen. Intenta abrirlo en una ventana de Incógnito.");
    });
}

// --- 4. Función: Descargar Gráfico PNG ---
function descargarGrafico() {
    const canvas = document.getElementById('radarChart');
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    tempCtx.fillStyle = '#ffffff';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvas, 0, 0);

    const link = document.createElement('a');
    link.download = 'grafico-madurez-digital.png';
    link.href = tempCanvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}