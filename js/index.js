console.log("Conectando...");

const mensaje = document.getElementById("Mensaje");
const btnCambiar = document.getElementById("btnCambiar");
const btnAgregar = document.getElementById("btnAgregar");
const inputTarea = document.getElementById("inputTarea");
const listaTareas = document.getElementById("listaTareas");

const obtenerTareas = () => {
    return JSON.parse(localStorage.getItem("tareas")) || [];
}

const renderizarTareas = () => {
    listaTareas.innerHTML = "";
    const tareas = obtenerTareas();
    tareas.forEach((texto, index) => {
    const nuevaTarea = document.createElement("li");
    nuevaTarea.textContent = texto;
    const btnBorrar = document.createElement("button");
    btnBorrar.textContent = "❌";
    btnBorrar.style.marginLeft = "10px";
    btnBorrar.addEventListener("click", () => {
        eliminarTarea(index);
    });
    nuevaTarea.appendChild(btnBorrar);
    listaTareas.appendChild(nuevaTarea);
    });
}

const agregarTarea = (texto) => {
    const tareas = obtenerTareas();
    tareas.push(texto);
    guardarTareas(tareas);
    renderizarTareas();
}

const eliminarTarea = (index) => {
    const tareas = obtenerTareas();
    tareas.splice(index, 1);
    guardarTareas(tareas);
    renderizarTareas();
}

btnCambiar.addEventListener("click", () => {
    mensaje.textContent = "Lo cambiamos con un click";
});

btnAgregar.addEventListener("click", () => {
    const texto = inputTarea.value.trim();

    if (texto === "") {
        alert ('Esribe algo antes de agregar la tarea');
        return;
    }
    agregarTarea(texto);
    inputTarea.value = "";
});

const guardarTareas = (tareas) => {
    localStorage.setItem("tareas", JSON.stringify(tareas));
}

document.addEventListener("DOMContentLoaded", () => {
    renderizarTareas();
});