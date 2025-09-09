console.log("Conectando...");

const mensaje = document.getElementById("Mensaje");
const btnCambiar = document.getElementById("btnCambiar");
const btnAgregar = document.getElementById("btnAgregar");
const inputTarea = document.getElementById("inputTarea");
const listaTareas = document.getElementById("listaTareas");
const filtros = document.querySelectorAll("#filtros button");
const btnBorrarCompletadas = document.getElementById("btBorrarCompletadas");
const contadorPendientes = document.getElementById("contadorPendientes");

let filtroActual = 'todas';

const genId = () => '${Date.now()}-${Math.random().toString(36).slice(2, 8)}';

const obtenerTareas = () => {
    const raw = localStorage.getItem("tareas");
    if (!raw) {
        return [];
    }
    try {
      const data = JSON.parse(raw);
      //Validar si son string, convertirlos a objetos con id
      if (Array.isArray(data) && typeof data[0] === 'string') {
        const nuevo = data.map((texto) => ({
            id: genId(),
            texto,
            completada: false
        }));
        localStorage.setItem("tareas", JSON.stringify(nuevos));
        return nuevo;
     }
     //Validamos cuando ya es un arreglo de objetos
     if (Array.isArray(data) && data[0].id && !data[0].id) {
        const nuevo = data.map((obj) => ({
            id: genId(),
            ...obj
        }))
        localStorage.setItem("tareas", JSON.stringify(nuevo));
        return nuevo;
     }
    } catch (error) {
        return [];
    }
    return JSON.parse(localStorage.getItem("tareas")) || [];
}

const renderizarTareas = () => {
    listaTareas.innerHTML = "";
    const tareas = obtenerTareas();

    const tareasFiltradas = tareas.filter((tarea) => {
        if (filtroActual === 'pendientes') {
            return !tarea.completada;
        } 
        if (filtroActual === 'completadas') {
            return tarea.completada;
        } 
        return true;
    })

    const pendientes = tareas.filter((pen) => !pen.completada).length;
    contadorPendientes.textContent = pendientes === 1 ? `1 tarea pendiente` : `${pendientes} tareas pendientes`;

    tareasFiltradas.forEach((tarea, index) => {
    const nuevaTarea = document.createElement("li");
   
    const spanTexto = document.createElement("span");
    spanTexto.textContent = tarea.texto;
    //Saber si la tarea está completa
    if(tarea.completada) {
        spanTexto.style.textDecoration = "line-through";
        spanTexto.style.color = 'grey';
    }

    const btnCompletar = document.createElement("button");
    btnCompletar.textContent = tarea.completada ? "↩️" : "✔️";
    btnCompletar.style.marginLeft = "10px";
    btnCompletar.addEventListener("click", () => {
        toggleCompletar(index);
    });

    const btnBorrar = document.createElement("button");
    btnBorrar.textContent = "❌";
    btnBorrar.style.marginLeft = "10px";
    btnBorrar.addEventListener("click", () => {
        eliminarTarea(index);
    });

    nuevaTarea.appendChild(spanTexto);
    nuevaTarea.appendChild(btnBorrar);
    nuevaTarea.appendChild(btnCompletar);

    listaTareas.appendChild(nuevaTarea);
    });
}

const agregarTarea = (texto) => {
    const tareas = obtenerTareas();
    tareas.push({id: genId(), texto, completada: false});
    guardarTareas(tareas);
    renderizarTareas();
}

const eliminarTarea = (index) => {
    const tareas = obtenerTareas();
    tareas.splice(index, 1);
    guardarTareas(tareas);
    renderizarTareas();
}

const toggleCompletar = (index) => {
    const tareas = obtenerTareas();
    tareas[index].completada = !tareas[index].completada;
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

filtros.forEach((btn) => {
    btn.addEventListener("click", () => {
        filtroActual = btn.dataset.filtro;
        renderizarTareas();
    });
});

btnBorrarCompletadas.addEventListener("click", () => {
    const tareas = obtenerTareas();
    const pendientes = tareas.filter((tarea) => !tarea.completada).
    guardarTareas(pendientes);
    renderizarTareas();
});

document.addEventListener("DOMContentLoaded", () => {
    renderizarTareas();
});