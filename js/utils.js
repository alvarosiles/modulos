// Utilidades compartidas por todos los módulos de Restobar

/** Carga un archivo JSON desde /data y devuelve su contenido parseado. */
async function cargarJSON(ruta) {
  const respuesta = await fetch(ruta);
  if (!respuesta.ok) {
    throw new Error(`No se pudo cargar ${ruta}`);
  }
  return respuesta.json();
}

/** Formatea un número como moneda local (Bs). */
function formatoMoneda(valor) {
  return `Bs ${Number(valor).toFixed(2)}`;
}

/** Formatea una fecha ISO (YYYY-MM-DD) a formato legible dd/mm/aaaa. */
function formatoFecha(fechaISO) {
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}/${mes}/${anio}`;
}

/** Genera un ID incremental simple a partir de una lista existente. */
function generarId(lista) {
  if (!lista.length) return 1;
  return Math.max(...lista.map((item) => item.id)) + 1;
}

/** Lee una colección desde LocalStorage, o null si no existe. */
function leerLocal(clave) {
  const valor = localStorage.getItem(clave);
  return valor ? JSON.parse(valor) : null;
}

/** Guarda una colección en LocalStorage. */
function guardarLocal(clave, datos) {
  localStorage.setItem(clave, JSON.stringify(datos));
}

/**
 * Carga una colección: si ya existe en LocalStorage la usa (para persistir
 * cambios del usuario), si no, la trae del JSON de ejemplo y la guarda.
 */
async function cargarColeccion(clave, rutaJSON) {
  const local = leerLocal(clave);
  if (local) return local;

  const datos = await cargarJSON(rutaJSON);
  const lista = datos[clave] || datos;
  guardarLocal(clave, lista);
  return lista;
}

/** Activa el toggle del sidebar en vistas móviles. */
function iniciarMenuMovil() {
  const boton = document.getElementById("menuToggle");
  const sidebar = document.querySelector(".sidebar");
  if (!boton || !sidebar) return;

  boton.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
}

document.addEventListener("DOMContentLoaded", iniciarMenuMovil);
