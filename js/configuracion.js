// Módulo Configuración (pages/configuracion.html)

const CLAVE_CONFIG = "configuracion";
const COLECCIONES = ["productos", "inventario", "ventas", "clientes", "proveedores", "movimientos"];

function iniciarConfiguracion() {
  const config = leerLocal(CLAVE_CONFIG) || { nombreNegocio: "Restobar", monedaPrefijo: "Bs", porcentajeDescuentoMax: 20 };

  document.getElementById("nombreNegocio").value = config.nombreNegocio;
  document.getElementById("monedaPrefijo").value = config.monedaPrefijo;
  document.getElementById("porcentajeDescuentoMax").value = config.porcentajeDescuentoMax;

  document.getElementById("formConfiguracion").addEventListener("submit", guardarConfiguracion);
  document.getElementById("btnRestablecer").addEventListener("click", restablecerDatos);
}

function guardarConfiguracion(evento) {
  evento.preventDefault();

  const config = {
    nombreNegocio: document.getElementById("nombreNegocio").value.trim() || "Restobar",
    monedaPrefijo: document.getElementById("monedaPrefijo").value.trim() || "Bs",
    porcentajeDescuentoMax: Number(document.getElementById("porcentajeDescuentoMax").value) || 0,
  };

  guardarLocal(CLAVE_CONFIG, config);
  alert("Configuración guardada.");
}

function restablecerDatos() {
  if (!confirm("Esto borrará todos tus cambios (ventas, productos, inventario, etc.) y volverá a los datos de ejemplo. ¿Continuar?")) {
    return;
  }

  COLECCIONES.forEach((clave) => localStorage.removeItem(clave));
  alert("Datos restablecidos. La página se recargará.");
  window.location.href = "../index.html";
}

document.addEventListener("DOMContentLoaded", iniciarConfiguracion);
