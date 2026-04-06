# DICA Varemo - Evaluador de Madurez Digital

Herramienta interactiva para el cálculo y visualización del estado de digitalización de organizaciones a través de cinco ejes estratégicos. Esta aplicación permite la edición dinámica de valores y la exportación de resultados para informes profesionales.

## Funcionalidades

- Cálculo dinámico: Los totales y el gráfico de radar se actualizan en tiempo real al modificar los valores de entrada.
- Gráfico de Radar: Visualización técnica del equilibrio digital mediante la librería Chart.js.
- Exportación de Informes: 
    - Generación de imagen PNG de la tabla de datos.
    - Generación de imagen PNG del gráfico de resultados.
- Optimización de Captura: El sistema incluye una lógica de limpieza de interfaz que elimina los elementos de formulario (inputs) durante la exportación para asegurar un acabado profesional.

## Tecnologías Utilizadas

- HTML5 y CSS3: Estructura semántica y diseño tipográfico basado en Montserrat.
- JavaScript Vanilla: Lógica de cálculo, manipulación del DOM y gestión de eventos de usuario.
- Chart.js: Renderizado de visualización de datos.
- html2canvas: Procesamiento de elementos HTML a formato imagen.

## Estructura del Proyecto

dica-varemo/
├── index.html    # Estructura y carga de dependencias
├── style.css     # Estilos, alineaciones y reglas de impresión
├── index.js      # Lógica de negocio y funciones de exportación
└── README.md     # Documentación técnica

## Notas de Implementación

### Gestión de estilos y compatibilidad
Para evitar errores de renderizado en la exportación (como el fallo provocado por funciones de color modernas tipo OKLCH en ciertas extensiones de navegador), el código implementa un filtro de limpieza mediante la función onclone. Esto asegura que la captura de imagen sea fiel al diseño original independientemente del entorno del usuario.

### Despliegue
El proyecto está optimizado para ser servido mediante GitHub Pages. Para activarlo, acceda a la configuración del repositorio (Settings), sección Pages, y seleccione la rama principal como fuente de despliegue.

---
Herramienta desarrollada para procesos de consultoría y transformación digital.