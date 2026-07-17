// CRUD del módulo Clientes (pages/clientes.html)

let clientes = [];
let clientesVentas = [];
let edicionId = null;

async function iniciarClientes() {
  [clientes, clientesVentas] = await Promise.all([
    cargarColeccion("clientes", "../data/clientes.json"),
    cargarColeccion("ventas", "../data/ventas.json"),
  ]);

  pintarTabla();

  document.getElementById("formCliente").addEventListener("submit", guardarCliente);
  document.getElementById("cancelarEdicion").addEventListener("click", cancelarEdicion);
  document.getElementById("buscarCliente").addEventListener("input", pintarTabla);
}

function contarCompras(clienteId) {
  return clientesVentas.filter((v) => v.clienteId === clienteId).length;
}

function pintarTabla() {
  const texto = document.getElementById("buscarCliente").value.trim().toLowerCase();
  const filtrados = clientes.filter((c) => c.nombre.toLowerCase().includes(texto));
  const cuerpo = document.getElementById("tablaClientes");

  if (!filtrados.length) {
    cuerpo.innerHTML = `<tr><td colspan="5"><p class="empty-state">No hay clientes registrados</p></td></tr>`;
    return;
  }

  cuerpo.innerHTML = filtrados
    .map(
      (c) => `
      <tr>
        <td>${c.nombre}</td>
        <td>${c.telefono || "-"}</td>
        <td>${c.correo || "-"}</td>
        <td>${contarCompras(c.id)} compra(s)</td>
        <td class="actions-cell">
          <button class="btn btn-sm" data-editar="${c.id}">Editar</button>
          <button class="btn btn-sm btn-danger" data-eliminar="${c.id}">Eliminar</button>
        </td>
      </tr>`
    )
    .join("");

  cuerpo.querySelectorAll("[data-editar]").forEach((btn) =>
    btn.addEventListener("click", () => editarCliente(Number(btn.dataset.editar)))
  );
  cuerpo.querySelectorAll("[data-eliminar]").forEach((btn) =>
    btn.addEventListener("click", () => eliminarCliente(Number(btn.dataset.eliminar)))
  );
}

function guardarCliente(evento) {
  evento.preventDefault();

  const datos = {
    nombre: document.getElementById("nombre").value.trim(),
    telefono: document.getElementById("telefono").value.trim(),
    correo: document.getElementById("correo").value.trim(),
    direccion: document.getElementById("direccion").value.trim(),
  };

  if (edicionId) {
    const index = clientes.findIndex((c) => c.id === edicionId);
    clientes[index] = { ...clientes[index], ...datos };
  } else {
    clientes.push({ id: generarId(clientes), historialCompras: [], ...datos });
  }

  guardarLocal("clientes", clientes);
  cancelarEdicion();
  pintarTabla();
}

function editarCliente(id) {
  const cliente = clientes.find((c) => c.id === id);
  if (!cliente) return;

  edicionId = id;
  document.getElementById("formTitulo").textContent = `Editar ${cliente.nombre}`;
  document.getElementById("submitLabel").textContent = "Actualizar cliente";
  document.getElementById("cancelarEdicion").style.display = "inline-flex";

  document.getElementById("nombre").value = cliente.nombre;
  document.getElementById("telefono").value = cliente.telefono || "";
  document.getElementById("correo").value = cliente.correo || "";
  document.getElementById("direccion").value = cliente.direccion || "";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function eliminarCliente(id) {
  if (!confirm("¿Eliminar este cliente?")) return;

  clientes = clientes.filter((c) => c.id !== id);
  guardarLocal("clientes", clientes);
  pintarTabla();
}

function cancelarEdicion() {
  edicionId = null;
  document.getElementById("formCliente").reset();
  document.getElementById("formTitulo").textContent = "Nuevo cliente";
  document.getElementById("submitLabel").textContent = "Guardar cliente";
  document.getElementById("cancelarEdicion").style.display = "none";
}

document.addEventListener("DOMContentLoaded", iniciarClientes);
