# bioalarm · Proceso de Diseño y Maquetación

Repositorio del proceso de diseño y maquetación de `bioalarm`, una propuesta de interfaz web y móvil para monitoreo clínico del sueño.

## Objetivo
Construir una entrega navegable que muestre la evolución del proyecto desde la definición visual hasta la maqueta interactiva final, manteniendo una línea de diseño consistente y una navegación clara entre pantallas.

## Estructura del Proceso
El trabajo quedó organizado siguiendo cuatro etapas principales:

### 1. Design System
En esta etapa se definieron los fundamentos visuales del producto:

- color
- tipografía
- jerarquías visuales
- componentes base
- lineamientos de layout

Archivos relacionados:

- [design-system.html](/Users/tomasvelasquez/Documents/MAESTRIA/Wireframes_Alarma_UX/design-system.html)
- [design-system-web.html](/Users/tomasvelasquez/Documents/MAESTRIA/Wireframes_Alarma_UX/design-system-web.html)

### 2. Wireframe
En esta fase se estructuró la arquitectura inicial de las pantallas y el flujo general del producto.

Se trabajó sobre:

- distribución de contenidos
- bloques funcionales
- navegación principal
- jerarquía de información

Archivo relacionado:

- [indexweb.html](/Users/tomasvelasquez/Documents/MAESTRIA/Wireframes_Alarma_UX/indexweb.html)

### 3. Mockup
Aquí se refinó la propuesta visual con mayor detalle y lenguaje gráfico más cercano al producto final.

Se trabajó sobre:

- estilo visual premium
- estados visuales
- lectura de datos
- identidad de marca
- experiencia de landing y dashboard

Archivos relacionados:

- [mockup-web.html](/Users/tomasvelasquez/Documents/MAESTRIA/Wireframes_Alarma_UX/mockup-web.html)
- [mockup-mobile.html](/Users/tomasvelasquez/Documents/MAESTRIA/Wireframes_Alarma_UX/mockup-mobile.html)

### 4. Maqueta Navegable
La entrega final quedó implementada en HTML, CSS y jQuery, con navegación entre pantallas e interacciones visuales activas para componentes como filtros, chips, selects y botones.

Carpeta final:

- [maqueta-web-alarma](/Users/tomasvelasquez/Documents/MAESTRIA/Wireframes_Alarma_UX/maqueta-web-alarma)

Archivos principales:

- [index.html](/Users/tomasvelasquez/Documents/MAESTRIA/Wireframes_Alarma_UX/maqueta-web-alarma/index.html)
- [styles.css](/Users/tomasvelasquez/Documents/MAESTRIA/Wireframes_Alarma_UX/maqueta-web-alarma/styles.css)
- [app.js](/Users/tomasvelasquez/Documents/MAESTRIA/Wireframes_Alarma_UX/maqueta-web-alarma/app.js)

## Qué se hizo en la Maqueta Final
La maqueta final toma como base el mockup web y lo convierte en una experiencia navegable.

Incluye:

- landing de login con fondo animado y formulario flotante
- pantalla de carga
- dashboard analítico
- detalle de sesión
- historial de sesiones
- alertas clínicas
- exportación de reporte
- confirmación de descarga
- perfil y salud

También se añadieron interacciones visuales en componentes no funcionales para cumplir la naturaleza de mockup navegable:

- navegación entre pantallas
- filtro interactivo de rango `30 días / 7 días / 90 días`
- chips seleccionables
- stepper de exportación seleccionable
- selects activos
- botones y acciones visualmente reactivas

## Cómo correr la maqueta
La forma recomendada es abrirla con un servidor local.

### Opción recomendada
Desde la raíz del repositorio:

```bash
cd /Users/tomasvelasquez/Documents/MAESTRIA/Wireframes_Alarma_UX/maqueta-web-alarma
python3 -m http.server 8000
```

Luego abrir en el navegador:

```text
http://localhost:8000
```

### Opción simple
También se puede abrir directamente este archivo en el navegador:

- [index.html](/Users/tomasvelasquez/Documents/MAESTRIA/Wireframes_Alarma_UX/maqueta-web-alarma/index.html)

Sin embargo, se recomienda el servidor local para evitar problemas con recursos externos.

## Tecnologías utilizadas

- HTML5
- CSS3
- jQuery 3.7.1 por CDN

## Validación frente a la entrega
La maqueta fue pensada para cumplir con los criterios solicitados:

- repositorio bajo git
- interfaces desarrolladas en HTML, CSS y jQuery
- pantallas navegables
- componentes interactivos activos aunque no funcionales
- flujo completo del proyecto representado en pantallas

## Nota para evaluación
Para cumplir completamente el requisito de disponibilidad externa, el repositorio debe estar publicado en un remoto accesible y sin restricciones de clonación al momento de la entrega.
