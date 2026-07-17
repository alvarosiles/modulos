// CRUD del módulo Proveedores (pages/proveedores.html)

let proveedores = [];
let edicionId = null;

async function iniciarProveedores() {
  proveedores = await cargarColeccion("proveedores", "../data/proveedores.json");

  pintarTabla();

  document.getElementById("formProveedor").addEventListener("submit", guardarProveedor);
  document.getElementById("cancelarEdicion").addEventListener("click", cancelarEdicion);
  document.getElementById("buscarProveedor").addEventListener("input", pintarTabla);
}

function pintarTabla() {
  const texto = document.getElementById("buscarProveedor").value.trim().toLowerCase();
  const filtrados = proveedores.filter(
    (p) => p.empresa.toLowerCase().includes(texto) || p.contacto.toLowerCase().includes(texto)
  );

  const cuerpo = document.getElementById("tablaProveedores");

  if (!filtrados.length) {
    cuerpo.innerHTML = `<tr><td colspan="6"><p class="empty-state">No hay proveedores registrados</p></td></tr>`;
    return;
  }

  cuerpo.innerHTML = filtrados
    .map(
      (p) => `
      <tr>
        <td>${p.empresa}</td>
        <td>${p.contacto}</td>
        <td>${p.telefono || "-"}</td>
        <td>${(p.productosSuministrados || []).join(", ")}</td>
        <td><span class="badge ${p.estado === "activo" ? "badge-success" : "badge-muted"}">${p.estado}</span></td>
        <td class="actions-cell">
          <button class="btn btn-sm" data-editar="${p.id}">Editar</button>
          <button class="btn btn-sm btn-danger" data-eliminar="${p.id}">Eliminar</button>
        </td>
      </tr>`
    )
    .join("");

  cuerpo.querySelectorAll("[data-editar]").forEach((btn) =>
    btn.addEventListener("click", () => editarProveedor(Number(btn.dataset.editar)))
  );
  cuerpo.querySelectorAll("[data-eliminar]").forEach((btn) =>
    btn.addEventListener("click", () => eliminarProveedor(Number(btn.dataset.eliminar)))
  );
}

function guardarProveedor(evento) {
  evento.preventDefault();

  const datos = {
    empresa: document.getElementById("empresa").value.trim(),
    contacto: document.getElementById("contacto").value.trim(),
    telefono: document.getElementById("telefono").value.trim(),
    whatsapp: document.getElementById("whatsapp").value.trim(),
    correo: document.getElementById("correo").value.trim(),
    productosSuministrados: document
      .getElementById("productosSuministrados")
      .value.split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    direccion: document.getElementById("direccion").value.trim(),
    estado: document.getElementById("estado").value,
  };

  if (edicionId) {
    const index = proveedores.findIndex((p) => p.id === edicionId);
    proveedores[index] = { ...proveedores[index], ...datos };
  } else {
    proveedores.push({ id: generarId(proveedores), ...datos });
  }

  guardarLocal("proveedores", proveedores);
  cancelarEdicion();
  pintarTabla();
}

function editarProveedor(id) {
  const proveedor = proveedores.find((p) => p.id === id);
  if (!proveedor) return;

  edicionId = id;
  document.getElementById("formTitulo").textContent = `Editar ${proveedor.empresa}`;
  document.getElementById("submitLabel").textContent = "Actualizar proveedor";
  document.getElementById("cancelarEdicion").style.display = "inline-flex";

  document.getElementById("empresa").value = proveedor.empresa;
  document.getElementById("contacto").value = proveedor.contacto;
  document.getElementById("telefono").value = proveedor.telefono || "";
  document.getElementById("whatsapp").value = proveedor.whatsapp || "";
  document.getElementById("correo").value = proveedor.correo || "";
  document.getElementById("productosSuministrados").value = (proveedor.productosSuministrados || []).join(", ");
  document.getElementById("direccion").value = proveedor.direccion || "";
  document.getElementById("estado").value = proveedor.estado;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function eliminarProveedor(id) {
  if (!confirm("¿Eliminar este proveedor?")) return;

  proveedores = proveedores.filter((p) => p.id !== id);
  guardarLocal("proveedores", proveedores);
  pintarTabla();
}

function cancelarEdicion() {
  edicionId = null;
  document.getElementById("formProveedor").reset();
  document.getElementById("formTitulo").textContent = "Nuevo proveedor";
  document.getElementById("submitLabel").textContent = "Guardar proveedor";
  document.getElementById("cancelarEdicion").style.display = "none";
}

document.addEventListener("DOMContentLoaded", iniciarProveedores);
