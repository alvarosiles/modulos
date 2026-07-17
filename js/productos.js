// CRUD del módulo Productos (pages/productos.html)

let productos = [];
let edicionId = null;

async function iniciarProductos() {
  productos = await cargarColeccion("productos", "../data/productos.json");

  pintarTabla();

  document.getElementById("formProducto").addEventListener("submit", guardarProducto);
  document.getElementById("cancelarEdicion").addEventListener("click", cancelarEdicion);
  document.getElementById("buscarProducto").addEventListener("input", pintarTabla);
}

function pintarTabla() {
  const texto = document.getElementById("buscarProducto").value.trim().toLowerCase();

  const filtrados = productos.filter(
    (p) => p.nombre.toLowerCase().includes(texto) || p.categoria.toLowerCase().includes(texto)
  );

  const cuerpo = document.getElementById("tablaProductos");

  if (!filtrados.length) {
    cuerpo.innerHTML = `<tr><td colspan="8"><p class="empty-state">No hay productos registrados</p></td></tr>`;
    return;
  }

  cuerpo.innerHTML = filtrados
    .map(
      (p) => `
      <tr>
        <td>${p.id}</td>
        <td>${p.nombre}</td>
        <td>${p.categoria}</td>
        <td>${formatoMoneda(p.precio)}</td>
        <td>${formatoMoneda(p.costo)}</td>
        <td>${p.stockMinimo}</td>
        <td><span class="badge ${p.estado === "activo" ? "badge-success" : "badge-muted"}">${p.estado}</span></td>
        <td class="actions-cell">
          <button class="btn btn-sm" data-editar="${p.id}">Editar</button>
          <button class="btn btn-sm btn-danger" data-eliminar="${p.id}">Eliminar</button>
        </td>
      </tr>`
    )
    .join("");

  cuerpo.querySelectorAll("[data-editar]").forEach((btn) =>
    btn.addEventListener("click", () => editarProducto(Number(btn.dataset.editar)))
  );
  cuerpo.querySelectorAll("[data-eliminar]").forEach((btn) =>
    btn.addEventListener("click", () => eliminarProducto(Number(btn.dataset.eliminar)))
  );
}

function guardarProducto(evento) {
  evento.preventDefault();

  const datos = {
    nombre: document.getElementById("nombre").value.trim(),
    categoria: document.getElementById("categoria").value.trim(),
    descripcion: document.getElementById("descripcion").value.trim(),
    imagen: document.getElementById("imagen").value.trim(),
    precio: Number(document.getElementById("precio").value),
    costo: Number(document.getElementById("costo").value),
    stockMinimo: Number(document.getElementById("stockMinimo").value),
    estado: document.getElementById("estado").value,
  };

  if (edicionId) {
    const index = productos.findIndex((p) => p.id === edicionId);
    productos[index] = { ...productos[index], ...datos };
  } else {
    productos.push({ id: generarId(productos), ...datos });
  }

  guardarLocal("productos", productos);
  cancelarEdicion();
  pintarTabla();
}

function editarProducto(id) {
  const producto = productos.find((p) => p.id === id);
  if (!producto) return;

  edicionId = id;
  document.getElementById("formTitulo").textContent = `Editar producto #${id}`;
  document.getElementById("submitLabel").textContent = "Actualizar producto";
  document.getElementById("cancelarEdicion").style.display = "inline-flex";

  document.getElementById("nombre").value = producto.nombre;
  document.getElementById("categoria").value = producto.categoria;
  document.getElementById("descripcion").value = producto.descripcion || "";
  document.getElementById("imagen").value = producto.imagen || "";
  document.getElementById("precio").value = producto.precio;
  document.getElementById("costo").value = producto.costo;
  document.getElementById("stockMinimo").value = producto.stockMinimo;
  document.getElementById("estado").value = producto.estado;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function eliminarProducto(id) {
  if (!confirm("¿Eliminar este producto?")) return;

  productos = productos.filter((p) => p.id !== id);
  guardarLocal("productos", productos);
  pintarTabla();
}

function cancelarEdicion() {
  edicionId = null;
  document.getElementById("formProducto").reset();
  document.getElementById("formTitulo").textContent = "Nuevo producto";
  document.getElementById("submitLabel").textContent = "Guardar producto";
  document.getElementById("cancelarEdicion").style.display = "none";
}

document.addEventListener("DOMContentLoaded", iniciarProductos);
