console.log("Conectando...");

const mensaje = document.getElementById("Mensaje");
const btnCambiar = document.getElementById("btnCambiar");
const btnAgregar = document.getElementById("btnAgregar");
const inputTarea = document.getElementById("inputTarea");
const listaTareas = document.getElementById("listaTareas");

console.log('ruvik elementos =>', mensaje, btnCambiar, btnAgregar, inputTarea, listaTareas);


btnCambiar.addEventListener("click", () => {
    mensaje.textContent = "Lo cambiamos con un click";
});

btnAgregar.addEventListener("click", () => {
    const texto = inputTarea.value.trim();

    if (texto === "") {
        alert ('Esribe algo antes de agregar la tarea');
        return;
    }
    const nuevaTarea = document.createElement("li");
    nuevaTarea.textContent = texto;
    const btnBorrar = document.createElement("button");
    btnBorrar.textContent = "❌";
    btnBorrar.style.marginLeft = "10px";
    btnBorrar.addEventListener("click", () => {
        listaTareas.removeChild(nuevaTarea);
    });
    nuevaTarea.appendChild(btnBorrar);
    listaTareas.appendChild(nuevaTarea);
    inputTarea.value = "";
});