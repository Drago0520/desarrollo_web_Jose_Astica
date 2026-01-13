
document.addEventListener('DOMContentLoaded', () => {
    const tabla = document.getElementById('tabla-avisos');
    
   
    tabla.addEventListener('click', (event) => {
        
        if (event.target.classList.contains('evaluar-btn')) {
            const boton = event.target;
            const avisoId = boton.dataset.avisoId;
            
          
            const notaInput = prompt("Ingrese nota entre 1 y 7 para este aviso:");
            if (notaInput === null) {
                return; 
            }

            const nota = parseInt(notaInput, 10);

          
            if (isNaN(nota) || nota < 1 || nota > 7) {
                alert("Error: Debe ingresar un numero entero entre 1 y 7.");
                return;
            }
            
          
            evaluarAviso(avisoId, nota);
        }
    });
});


function evaluarAviso(avisoId, nota) {
    
    const springBootUrl = 'http://localhost:8080/api/avisos/' + avisoId + '/evaluar';

    fetch(springBootUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nota: nota }) 
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.error || 'Error en el servidor'); });
        }
        return response.json();
    })
    .then(data => {
        
        const celdaNota = document.getElementById('nota-aviso-' + avisoId);
        celdaNota.textContent = data.nuevaNotaPromedio.toFixed(1);
        alert("Evaluacion guardada");
    })
    .catch(error => {
        console.error('Error al evaluar:', error);
        alert("No se pudo guardar la evaluacion: " + error.message);
    });
}