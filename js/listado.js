// Datos con fotos
const avisos = {
  1: { 
    info: "1 perro, 6 meses, comuna Santiago, sector Centro. Contacto: Frederick Fazbearinton", 
    fotos: ["../imagenes/puppoy.png","../imagenes/nicodios.png"]
  },
  2: { 
    info: "2 gatitos, 3 meses, comuna Providencia, sector Bustamante. Contacto: Chayanne", 
    fotos: ["../imagenes/doodo2.png", "../imagenes/dodo.png"]
  },
  3: { 
    info: "1 perro, 2 años, comuna Ñuñoa, sector Irarrazabal. Contacto: Hideo Kojima", 
    fotos: ["../imagenes/perro2year.png"]
  },
  4: { 
    info: "3 gatos, 1 año, comuna La Florida, sector Trinidad. Contacto: Jorge San Martin", 
    fotos: ["../imagenes/3gatos.png"]
  },
  5: { 
    info: "1 perro, 8 meses, comuna Maipú, sector Pajaritos. Contacto: Sakurajima Mai", 
    fotos: ["../imagenes/doge.png"]
  }
};

const tabla = document.getElementById("tabla-avisos");
const detalle = document.getElementById("detalle");
const detalleInfo = document.getElementById("detalle-info");
const detalleFotos = document.getElementById("detalle-fotos");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");

// Click en fila → mostrar detalle
tabla.addEventListener("click", (e) => {
  let fila = e.target.closest("tr[data-id]");
  if (!fila) return;
  let id = fila.dataset.id;
  mostrarDetalle(id);
});

function mostrarDetalle(id) {
  tabla.style.display = "none";
  detalle.style.display = "block";
  detalleInfo.textContent = avisos[id].info;
  detalleFotos.innerHTML = "";
  avisos[id].fotos.forEach(foto => {
    let img = document.createElement("img");
    img.src = foto;
    img.className = "foto";
    img.addEventListener("click", () => abrirModal(foto));
    detalleFotos.appendChild(img);
  });
}

function mostrarTabla() {
  detalle.style.display = "none";
  tabla.style.display = "table";
}

function abrirModal(src) {
  modal.style.display = "flex";
  modalImg.src = src.replace(/320x240|321x240|322x240|323x240|324x240|325x240|326x240|327x240|328x240/, "800x600");
}

function cerrarModal() {
  modal.style.display = "none";
}
