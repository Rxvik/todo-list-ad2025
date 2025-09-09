console.log("Conectando...");

const mensaje = document.getElementById("Mensaje");
const btnCambiar = document.getElementById("btnCambiar");
const btnAgregar = document.getElementById("btnAgregar");
const inputTarea = document.getElementById("inputTarea");
const listaTareas = document.getElementById("listaTareas");
const filtros = document.querySelectorAll("#filtros button");
const btnBorrarCompletadas = document.getElementById("btnBorrarCompletadas");
const contadorPendientes = document.getElementById("contadorPendientes");

let filtroActual = "todas";

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const obtenerTareas = () => {
  const raw = localStorage.getItem("tareas");
  if (!raw) return [];

  try {
    const data = JSON.parse(raw);

    if (Array.isArray(data) && typeof data[0] === "string") {
      const nuevo = data.map((texto) => ({
        id: genId(),
        texto,
        completada: false,
      }));
      localStorage.setItem("tareas", JSON.stringify(nuevo));
      return nuevo;
    }

    if (Array.isArray(data) && data.length > 0 && !data[0].id) {
      const nuevo = data.map((obj) => ({
        id: genId(),
        ...obj,
      }));
      localStorage.setItem("tareas", JSON.stringify(nuevo));
      return nuevo;
    }

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error parseando tareas desde localStorage:", error);
    return [];
  }
};

const guardarTareas = (tareas) => {
  localStorage.setItem("tareas", JSON.stringify(tareas));
};

const renderizarTareas = () => {
  listaTareas.innerHTML = "";
  const tareas = obtenerTareas();

  const tareasFiltradas = tareas.filter((tarea) => {
    if (filtroActual === "pendientes") return !tarea.completada;
    if (filtroActual === "completadas") return tarea.completada;
    return true;
  });

  const pendientes = tareas.filter((t) => !t.completada).length;
  contadorPendientes.textContent =
    pendientes === 1 ? `1 tarea pendiente` : `${pendientes} tareas pendientes`;

  tareasFiltradas.forEach((tarea) => {
    const nuevaTarea = document.createElement("li");

    const spanTexto = document.createElement("span");
    spanTexto.textContent = tarea.texto;
    if (tarea.completada) {
      spanTexto.style.textDecoration = "line-through";
      spanTexto.style.color = "grey";
    }

    const btnCompletar = document.createElement("button");
    btnCompletar.textContent = tarea.completada ? "↩️" : "✔️";
    btnCompletar.style.marginLeft = "10px";
    btnCompletar.addEventListener("click", () => {
      toggleCompletar(tarea.id);
    });

    const btnBorrar = document.createElement("button");
    btnBorrar.textContent = "❌";
    btnBorrar.style.marginLeft = "10px";
    btnBorrar.addEventListener("click", () => {
      eliminarTarea(tarea.id);
    });

    nuevaTarea.appendChild(spanTexto);
    nuevaTarea.appendChild(btnBorrar);
    nuevaTarea.appendChild(btnCompletar);

    listaTareas.appendChild(nuevaTarea);
  });
};

const agregarTarea = (texto) => {
  const tareas = obtenerTareas();
  tareas.push({ id: genId(), texto, completada: false });
  guardarTareas(tareas);
  renderizarTareas();
};

const eliminarTarea = (id) => {
  const tareas = obtenerTareas();
  const nuevas = tareas.filter((t) => t.id !== id);
  guardarTareas(nuevas);
  renderizarTareas();
};

const toggleCompletar = (id) => {
  const tareas = obtenerTareas();
  const tarea = tareas.find((t) => t.id === id);
  if (tarea) {
    tarea.completada = !tarea.completada;
    guardarTareas(tareas);
    renderizarTareas();
  }
};

btnCambiar && btnCambiar.addEventListener("click", () => {
  mensaje.textContent = "Lo cambiamos con un click";
});

btnAgregar && btnAgregar.addEventListener("click", () => {
  const texto = inputTarea.value.trim();

  if (texto === "") {
    alert("Escribe algo antes de agregar la tarea");
    return;
  }
  agregarTarea(texto);
  inputTarea.value = "";
});

filtros.forEach((btn) => {
  btn.addEventListener("click", () => {
    filtroActual = btn.dataset.filtro;
    // Opcional: marcar visualmente el botón activo
    filtros.forEach((b) => b.classList.remove("activo"));
    btn.classList.add("activo");
    renderizarTareas();
  });
});

// Listener del botón Borrar Completadas — con logs para depuración
if (btnBorrarCompletadas) {
  btnBorrarCompletadas.addEventListener("click", () => {
    console.log("Botón 'Borrar Completadas' pulsado");
    const tareas = obtenerTareas();
    console.log("Tareas antes de borrar:", tareas);
    const pendientes = tareas.filter((tarea) => !tarea.completada);
    guardarTareas(pendientes);
    console.log("Tareas después de borrar:", pendientes);
    renderizarTareas();
  });
} else {
  console.error(
    "btnBorrarCompletadas NO encontrado en DOM. Revisa el id en el HTML y la ruta del script."
  );
}

// Render inicial
document.addEventListener("DOMContentLoaded", () => {
  renderizarTareas();
});
