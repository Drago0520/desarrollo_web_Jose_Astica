// función que convierte Date -> "YYYY-MM-DDTHH:MM"
function toLocalDatetimeValue(date){
  const p = n => String(n).padStart(2,'0');
  return `${date.getFullYear()}-${p(date.getMonth()+1)}-${p(date.getDate())}T${p(date.getHours())}:${p(date.getMinutes())}`;
}

// obtenemos el input
const entregaEl = document.getElementById('entrega');

// calculamos: ahora + 3 horas
const ahora = new Date();
const entregaMin = new Date(ahora.getTime() + 3*60*60*1000);

// convertimos a string para usar en el input
const valor = toLocalDatetimeValue(entregaMin);

// seteamos atributos en el input
entregaEl.min   = valor;   // mínimo permitido
entregaEl.value = valor;   // prellenado
entregaEl.required = true;
entregaEl.step = 60;       // precisión a minutos


//Selecion de redes sociales 
const select = document.getElementById("red-select");
const inputContainer = document.getElementById("input-container");
let contadorInputs = 0;
const maxInputs = 5;

select.addEventListener("change", () => {
  // si no hay selección o ya se alcanzó el máximo, no hacemos nada
  if (!select.value || contadorInputs >= maxInputs) return;

  // creamos un label + input para el id/url
  const wrapper = document.createElement("div");
  wrapper.classList.add("red-input");

  const label = document.createElement("label");
  label.textContent = `ID/URL de ${select.value}:`;

  const input = document.createElement("input");
  input.type = "text";
  input.name = `contacto-${contadorInputs+1}`;
  input.minLength = 4;
  input.maxLength = 50;
  input.placeholder = "Ej: usuario123 o https://...";

  // agregamos todo al contenedor
  wrapper.appendChild(label);
  wrapper.appendChild(input);
  inputContainer.appendChild(wrapper);

  contadorInputs++;

  // resetear select para poder elegir otra
  select.value = "";
});
//Para el envio de fotos
document.addEventListener("DOMContentLoaded", () => {
  const fileContainer = document.getElementById("file-container");
  const addPhotoBtn = document.getElementById("add-photo-btn");

  addPhotoBtn.addEventListener("click", () => {
    const fileInputs = fileContainer.querySelectorAll(".file-input");

    if (fileInputs.length >= 5) {
      alert("No puedes subir más de 5 fotos.");
      return;
    }

    // Crear un nuevo input file
    const newInput = document.createElement("input");
    newInput.type = "file";
    newInput.name = "files";
    newInput.classList.add("file-input");
    newInput.accept = "image/*,.pdf";

    // Añadir al contenedor
    fileContainer.appendChild(newInput);
  });
});

