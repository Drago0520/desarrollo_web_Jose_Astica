
//Grafico de Líneas (Avisos por Dia)
function dibujarGraficoLinea(datos) {
    Highcharts.chart('grafico-linea', { 
        chart: { type: 'line' },
        title: { text: 'Cantidad de Avisos de Adopción Agregados por Día' },
        xAxis: { categories: datos.dias },
        yAxis: { title: { text: 'Cantidad de Avisos' } },
        series: [{ name: 'Avisos', data: datos.avisos }]
    });
}

//Grafico de Torta (Total por Tipo de Mascota)
function dibujarGraficoTorta(datos) {
    Highcharts.chart('grafico-torta', {
        chart: { plotBackgroundColor: null, plotBorderWidth: null, plotShadow: false, type: 'pie' },
        title: { text: 'Total de Avisos por Tipo de Mascota' },
        series: [{
            name: 'Total',
            colorByPoint: true,
            data: datos 
        }]
    });
}

//Grafico de Barras (Avisos por Mes)
function dibujarGraficoBarras(datos) {
    Highcharts.chart('grafico-barras', {
        chart: { type: 'column' },
        title: { text: 'Cantidad de Avisos Mensuales (Perros vs. Gatos)' },
        xAxis: { categories: datos.meses },
        yAxis: { title: { text: 'Cantidad' } },
        series: [{
            name: 'Gatos',
            data: datos.gatos
        }, {
            name: 'Perros',
            data: datos.perros
        }]
    });
}



function cargarEstadisticas() {
    const apiUrl = '/api/estadisticas'; 
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                // Si la respuesta es 500 o 404, lanzamos un error
                throw new Error('Error al obtener datos: ' + response.statusText);
            }
            return response.json(); 
        })
        .then(datos => {
            dibujarGraficoLinea(datos.linea);
            dibujarGraficoTorta(datos.torta);
            dibujarGraficoBarras(datos.barras);
        })
        .catch(error => {
            console.error('Error al cargar estadísticas:', error);
            const contenedorError = document.getElementById('grafico-linea');
            if (contenedorError) {
                contenedorError.innerHTML = '<p style="color: red; padding: 20px;">No se pudieron cargar las estadisticas. Revise la consola del navegador.</p>';
            }
        });
}


document.addEventListener('DOMContentLoaded', cargarEstadisticas);