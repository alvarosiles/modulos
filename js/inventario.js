// CRUD del módulo Inventario (pages/inventario.html)

let inventario = [];
let edicionId = null;

const ESTADOS_INVENTARIO = {
  disponible: { label: "Disponible", badge: "badge-success", icono: "🟢" },
  bajo: { label: "Stock bajo", badge: "badge-warning", icono: "🟡" },
  sin_stock: { label: "Sin stock", badge: "badge-danger", icono: "🔴" },
};

function calcularEstado(item) {
  if (item.cantidadActual <= 0) return "sin_stock";
  if (item.cantidadActual <= item.stockMinimo) return "bajo";
  return "disponible";
}

async function iniciarInventario() {
  inventario = await cargarColeccion("inventario", "../data/inventario.json");
  inventario.forEach((item) => (item.estado = calcularEstado(item)));

  pintarTabla();
  pintarResumen();

  document.getElementById("formInventario").addEventListener("submit", guardarItem);
  document.getElementById("cancelarEdicion").addEventListener("click", cancelarEdicion);
  document.getElementById("buscarItem").addEventListener("input", pintarTabla);
}

function pintarResumen() {
  document.getElementById("countDisponible").textContent = inventario.filter(
    (i) => i.estado === "disponible"
  ).length;
  document.getElementById("countBajo").textContent = inventario.filter(
    (i) => i.estado === "bajo"
  ).length;
  document.getElementById("countSinStock").textContent = inventario.filter(
    (i) => i.estado === "sin_stock"
  ).length;
}

function pintarTabla() {
  const texto = document.getElementById("buscarItem").value.trim().toLowerCase();
  const filtrados = inventario.filter((i) => i.producto.toLowerCase().includes(texto));
  const cuerpo = document.getElementById("tablaInventario");

  if (!filtrados.length) {
    cuerpo.innerHTML = `<tr><td colspan="6"><p class="empty-state">No hay ingredientes registrados</p></td></tr>`;
    return;
  }

  cuerpo.innerHTML = filtrados
    .map((i) => {
      const estado = ESTADOS_INVENTARIO[i.estado];
      return `
      <tr>
        <td>${i.producto}</td>
        <td>${i.cantidadActual}</td>
        <td>${i.unidad}</td>
        <td>${i.stockMinimo}</td>
        <td><span class="badge ${estado.badge}">${estado.icono} ${estado.label}</span></td>
        <td class="actions-cell">
          <button class="btn btn-sm" data-editar="${i.id}">Editar</button>
          <button class="btn btn-sm btn-danger" data-eliminar="${i.id}">Eliminar</button>
        </td>
      </tr>`;
    })
    .join("");

  cuerpo.querySelectorAll("[data-editar]").forEach((btn) =>
    btn.addEventListener("click", () => editarItem(Number(btn.dataset.editar)))
  );
  cuerpo.querySelectorAll("[data-eliminar]").forEach((btn) =>
    btn.addEventListener("click", () => eliminarItem(Number(btn.dataset.eliminar)))
  );
}

function guardarItem(evento) {
  evento.preventDefault();

  const datos = {
    producto: document.getElementById("producto").value.trim(),
    cantidadActual: Number(document.getElementById("cantidadActual").value),
    unidad: document.getElementById("unidad").value.trim(),
    stockMinimo: Number(document.getElementById("stockMinimo").value),
  };
  datos.estado = calcularEstado(datos);

  if (edicionId) {
    const index = inventario.findIndex((i) => i.id === edicionId);
    inventario[index] = { ...inventario[index], ...datos };
  } else {
    inventario.push({ id: generarId(inventario), ...datos });
  }

  guardarLocal("inventario", inventario);
  cancelarEdicion();
  pintarTabla();
  pintarResumen();
}

function editarItem(id) {
  const item = inventario.find((i) => i.id === id);
  if (!item) return;

  edicionId = id;
  document.getElementById("formTitulo").textContent = `Editar ${item.producto}`;
  document.getElementById("submitLabel").textContent = "Actualizar";
  document.getElementById("cancelarEdicion").style.display = "inline-flex";

  document.getElementById("producto").value = item.producto;
  document.getElementById("cantidadActual").value = item.cantidadActual;
  document.getElementById("unidad").value = item.unidad;
  document.getElementById("stockMinimo").value = item.stockMinimo;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function eliminarItem(id) {
  if (!confirm("¿Eliminar este ingrediente del inventario?")) return;

  inventario = inventario.filter((i) => i.id !== id);
  guardarLocal("inventario", inventario);
  pintarTabla();
  pintarResumen();
}

function cancelarEdicion() {
  edicionId = null;
  document.getElementById("formInventario").reset();
  document.getElementById("formTitulo").textContent = "Nuevo ingrediente";
  document.getElementById("submitLabel").textContent = "Guardar";
  document.getElementById("cancelarEdicion").style.display = "none";
}

document.addEventListener("DOMContentLoaded", iniciarInventario);
