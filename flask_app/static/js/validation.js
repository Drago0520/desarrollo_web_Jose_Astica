const validateName = (name) => {
  if(!name) return false;
  let lengthValid = name.trim().length >= 4;
  
  return lengthValid;
}

const validateEmail = (email) => {
  if (!email) return false;
  let lengthValid = email.length > 15;

  // validamos el formato
  let re = /^[\w.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  let formatValid = re.test(email);

  // devolvemos la lógica AND de las validaciones.
  return lengthValid && formatValid;
};

const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return false;
  // validación de longitud
  let lengthValid = phoneNumber.length >= 8;

  // validación de formato
  let re = /^\+\d{3}\.d{8}$/;
  let formatValid = re.test(phoneNumber);

  // devolvemos la lógica AND de las validaciones.
  return lengthValid && formatValid;
};

const validateCantidad = (cantidad) => {
  if (!cantidad) return false;
  // validación de longitud
  let lengthValid = cantidad.length >= 1;

  // validación de formato
  let re = /^[0-9]+$/;
  let formatValid = re.test(cantidad);

  // devolvemos la lógica AND de las validaciones.
  return lengthValid && formatValid;
};
const validateedad = (edad) => {
  if (!edad) return false;
  // validación de longitud
  let lengthValid = edad.length >= 1;

  // validación de formato
  let re = /^[0-9]+$/;
  let formatValid = re.test(edad);

  // devolvemos la lógica AND de las validaciones.
  return lengthValid && formatValid;
};

const validateFiles = (files) => {
  if (!files) return false;

  // validación del número de archivos
  let lengthValid = 1 <= files.length && files.length <= 5;

  // validación del tipo de archivo
  let typeValid = true;

  for (const file of files) {
    // el tipo de archivo debe ser "image/<foo>" o "application/pdf"
    let fileFamily = file.type.split("/")[0];
    typeValid &&= fileFamily == "image" || file.type == "application/pdf";
  }

  // devolvemos la lógica AND de las validaciones.
  return lengthValid && typeValid;
};

const validateSelect = (select) => {
  if(!select) return false;
  return true
}

const validateForm = () => {
  // obtener elementos del DOM usando el nombre del formulario.
  let myForm = document.forms["myForm"];
  let email = myForm["email"].value;
  let phoneNumber = myForm["phone"].value.trim();
  let cantidad = myForm["cantidad"].value;
  let edad = myForm["edad"].value;
  let name = myForm["nombre"].value;
  let files = myForm["files"].files;
  let department = myForm["select-department"].value;
  let department1 = myForm["select-department1"].value;
  let department2 = myForm["select-department2"].value;
  let curso = myForm["select-course"].value;
  //para la fotos
  let newInput = document.createElement("input");
  newInput.type = "file";
  newInput.name = "files";
  newInput.required = false; 

  // variables auxiliares de validación y función.
  let invalidInputs = [];
  let isValid = true;
  const setInvalidInput = (inputName) => {
    invalidInputs.push(inputName);
    isValid &&= false;
  };

  // lógica de validación
  if (!validateName(name)) {
    setInvalidInput("Nombre");
  }
  if (!validateEmail(email)) {
    setInvalidInput("Email");
  }
 
  if (!validateCantidad(cantidad)) {
    setInvalidInput("Cantidad");
  }
  if (!validateedad(edad)) {
    setInvalidInput("Edad");
  }
  if (!validateFiles(files)) {
    setInvalidInput("Fotos");
  }
  if (!validateSelect(department)) {
    setInvalidInput("Region");
  }
  if (!validateSelect(department1)) {
    setInvalidInput("Perro o gato");
  }
  if (!validateSelect(department2)) {
    setInvalidInput("Meses o años");
  }
  if (!validateSelect(curso)) {
    setInvalidInput("Curso");
  }

  // finalmente mostrar la validación
  let validationBox = document.getElementById("val-box");
  let validationMessageElem = document.getElementById("val-msg");
  let validationListElem = document.getElementById("val-list");
  let formContainer = document.querySelector(".main-container");

  if (!isValid) {
    validationListElem.textContent = "";
    // agregar elementos inválidos al elemento val-list.
    for (input of invalidInputs) {
      let listElement = document.createElement("li");
      listElement.innerText = input;
      validationListElem.append(listElement);
    }
    // establecer val-msg
    validationMessageElem.innerText = "Los siguientes campos son inválidos:";

    // aplicar estilos de error
    validationBox.style.backgroundColor = "#ffdddd";
    validationBox.style.borderLeftColor = "#f44336";

    // hacer visible el mensaje de validación
    validationBox.hidden = false;
  } else {
    // Ocultar el formulario
    myForm.style.display = "none";

    // establecer mensaje de éxito
    validationMessageElem.innerText = "¿Está seguro que desea agregar este aviso de adopción?";
    validationListElem.textContent = "";

    // aplicar estilos de éxito
    validationBox.style.backgroundColor = "#ddffdd";
    validationBox.style.borderLeftColor = "#4CAF50";

    // Agregar botones para enviar el formulario o volver
    
    let submitButton = document.createElement("button");
    submitButton.innerText = "Sí, estoy seguro";
    submitButton.style.marginRight = "10px";
    submitButton.addEventListener("click", () => {
      //Ocultar el cuadro de validación
      validationBox.hidden = true;

      //Crear un nuevo contenedor de mensaje
      let successBox = document.createElement("div");
      successBox.style.backgroundColor = "#ddffdd";
      successBox.style.borderLeft = "6px solid #4CAF50";
      successBox.style.padding = "10px";
      successBox.style.marginTop = "20px";
      
      

      let successMessage = document.createElement("p");
      successMessage.innerText = "Hemos recibido la información de adopción, muchas gracias y suerte!";
      successBox.appendChild(successMessage);

      //boton para volver a la portada
      let homeButton = document.createElement("button");
      homeButton.innerText = "Volver a la portada";
      homeButton.addEventListener("click", () => {
        window.location.href = "index.html"; 
      });
      successBox.appendChild(homeButton);

      // Insertar el mensaje final en el contenedor principal
      formContainer.appendChild(successBox);
    });


    let backButton = document.createElement("button");
    backButton.innerText = "“No, no estoy seguro, quiero volver al formulario";
    backButton.addEventListener("click", () => {
      // Mostrar el formulario nuevamente
      myForm.style.display = "block";
      validationBox.hidden = true;
    });

    validationListElem.appendChild(submitButton);
    validationListElem.appendChild(backButton);

    // hacer visible el mensaje de validación
    validationBox.hidden = false;
  };
};


let submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", validateForm);
