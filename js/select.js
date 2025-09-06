

const data1 = {
  "Perro":["woof"],
  "Gato":["meow"]
};
const data2 = {
  "Meses":["yo"],
  "Años":["gurt"]
};

const data = {
  "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
  "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
  "Antofagasta": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"],
  "Atacama": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"],
  "Coquimbo": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paihuano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
  "Valparaíso": ["Valparaíso", "Viña del Mar", "Concón", "Quilpué", "Villa Alemana", "Quillota", "La Calera", "Limache", "Olmué", "San Antonio", "Cartagena", "Santo Domingo", "Los Andes", "San Felipe"],
  "Metropolitana de Santiago": ["Santiago", "Providencia", "Las Condes", "Ñuñoa", "La Florida", "Maipú", "Puente Alto", "San Bernardo", "Melipilla", "Talagante", "Colina", "Pirque", "Buin", "Paine"],
  "O’Higgins": ["Rancagua", "Machalí", "Graneros", "San Fernando", "Santa Cruz", "Chimbarongo", "Pichilemu", "Navidad", "Litueche"],
  "Maule": ["Talca", "Curicó", "Linares", "Cauquenes", "Constitución", "Maule", "San Javier", "Parral"],
  "Ñuble": ["Chillán", "Chillán Viejo", "San Carlos", "Bulnes", "Yungay", "Cobquecura", "Quillón"],
  "Biobío": ["Concepción", "Talcahuano", "Hualpén", "Coronel", "San Pedro de la Paz", "Lota", "Chiguayante", "Los Ángeles", "Nacimiento", "Cabrero", "Yumbel", "Curanilahue", "Lebu"],
  "La Araucanía": ["Temuco", "Padre Las Casas", "Villarrica", "Pucón", "Angol", "Victoria", "Lautaro", "Collipulli"],
  "Los Ríos": ["Valdivia", "Corral", "Lanco", "Mariquina", "Panguipulli", "La Unión", "Río Bueno", "Futrono", "Paillaco"],
  "Los Lagos": ["Puerto Montt", "Puerto Varas", "Castro", "Ancud", "Quellón", "Osorno", "Purranque", "San Pablo"],
  "Aysén": ["Coyhaique", "Puerto Aysén", "Cisnes", "Chile Chico", "Cochrane", "Guaitecas", "Río Ibáñez", "O’Higgins"],
  "Magallanes y de la Antártica Chilena": ["Punta Arenas", "Puerto Natales", "Porvenir", "Cabo de Hornos (Puerto Williams)"]
};


const poblarDepartamentos = () => {
  let departmentSelect = document.getElementById("select-department");
  for (const department in data) {
      let option = document.createElement("option");
      option.value = department;
      option.text = department;
      departmentSelect.appendChild(option);
  }
};
const poblarDepartamentos1 = () => {
  let departmentSelect = document.getElementById("select-department1");
  for (const department in data1) {
      let option = document.createElement("option");
      option.value = department;
      option.text = department;
      departmentSelect.appendChild(option);
  }
};
const poblarDepartamentos2 = () => {
  let departmentSelect = document.getElementById("select-department2");
  for (const department in data2) {
      let option = document.createElement("option");
      option.value = department;
      option.text = department;
      departmentSelect.appendChild(option);
  }
};

const updateCursos = () => {
  let departmentSelect = document.getElementById("select-department");
  let courseSelect = document.getElementById("select-course");
  let selectedDepartment = departmentSelect.value;
  
  courseSelect.innerHTML = '<option value="">Seleccione un ramo</option>';
  
  if (data[selectedDepartment]) {
      data[selectedDepartment].forEach(course => {
          let option = document.createElement("option");
          option.value = course;
          option.text = course;
          courseSelect.appendChild(option);
      });
  }
  changeArguments();
};

function changeArguments() {
  const courseSelect = document.getElementById("select-course");
  const reasonLabel = document.querySelector("label[for='comments']");
  const reasonTextarea = document.getElementById("comments");
  
  if (courseSelect.value !== "") {
      reasonLabel.style.display = "block";
      reasonTextarea.style.display = "block";
  } else {
      reasonLabel.style.display = "none";
      reasonTextarea.style.display = "none";
  }
}

document.getElementById("select-department").addEventListener("change", updateCursos);
document.getElementById("select-course").addEventListener("change", changeArguments);

window.onload = () => {
  poblarDepartamentos();
  poblarDepartamentos1();
  poblarDepartamentos2();

  changeArguments();
};
