// Este archivo JS se sirve desde Flask, pero llama a Spring Boot

document.addEventListener('DOMContentLoaded', () => {
    const tabla = document.getElementById('tabla-avisos');
    
    // Usamos delegación de eventos en la tabla
    tabla.addEventListener('click', (event) => {
        // Si el clic fue en un botón de evaluar
        if (event.target.classList.contains('evaluar-btn')) {
            const boton = event.target;
            const avisoId = boton.dataset.avisoId;
            
            // 1. Pedir la nota al usuario [cite: 206]
            const notaInput = prompt("Ingrese nota entre 1 y 7 para este aviso:");
            if (notaInput === null) {
                return; // El usuario apretó "Cancelar"
            }

            const nota = parseInt(notaInput, 10);

            // 2. Validar la nota [cite: 207]
            if (isNaN(nota) || nota < 1 || nota > 7) {
                alert("Error: Debe ingresar un número entero entre 1 y 7.");
                return;
            }
            
            // 3. Llamar al microservicio de Spring Boot [cite: 200, 210]
            evaluarAviso(avisoId, nota);
        }
    });
});

/**
 * Llama a la API de Spring Boot para guardar la nota
 * y actualizar la UI con el nuevo promedio.
 */
function evaluarAviso(avisoId, nota) {
    // IMPORTANTE: La URL apunta al servicio de Spring Boot (puerto 8080)
    const springBootUrl = 'http://localhost:8080/api/avisos/' + avisoId + '/evaluar';

    fetch(springBootUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nota: nota }) // El payload que espera el @RequestBody
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.error || 'Error en el servidor'); });
        }
        return response.json();
    })
    .then(data => {
        // data es: { nuevaNotaPromedio: 5.5 }
        // 4. Actualizar la interfaz SIN RECARGAR [cite: 208]
        const celdaNota = document.getElementById('nota-aviso-' + avisoId);
        celdaNota.textContent = data.nuevaNotaPromedio.toFixed(1);
        alert("¡Evaluación guardada exitosamente!");
    })
    .catch(error => {
        console.error('Error al evaluar:', error);
        alert("No se pudo guardar la evaluación: " + error.message);
    });
}
