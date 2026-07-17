// Módulo Almacén: entradas, salidas y ajustes de inventario (pages/almacen.html)

let movimientos = [];
let almacenInventario = [];

async function iniciarAlmacen() {
  [movimientos, almacenInventario] = await Promise.all([
    cargarColeccion("movimientos", "../data/movimientos.json"),
    cargarColeccion("inventario", "../data/inventario.json"),
  ]);

  document.getElementById("fecha").value = new Date().toISOString().slice(0, 10);
  llenarSelectProductos();
  pintarTabla();

  document.getElementById("formMovimiento").addEventListener("submit", registrarMovimiento);
  document.getElementById("filtroTipo").addEventListener("change", pintarTabla);
}

function llenarSelectProductos() {
  const select = document.getElementById("producto");
  select.innerHTML = almacenInventario
    .map((item) => `<option value="${item.producto}">${item.producto}</option>`)
    .join("");
}

function registrarMovimiento(evento) {
  evento.preventDefault();

  const producto = document.getElementById("producto").value;
  const tipoMovimiento = document.getElementById("tipoMovimiento").value;
  const cantidad = Number(document.getElementById("cantidad").value);

  const nuevoMovimiento = {
    id: generarId(movimientos),
    fecha: document.getElementById("fecha").value,
    producto,
    cantidad,
    tipoMovimiento,
    responsable: document.getElementById("responsable").value.trim(),
    observacion: document.getElementById("observacion").value.trim(),
  };

  movimientos.push(nuevoMovimiento);
  guardarLocal("movimientos", movimientos);

  aplicarMovimientoAInventario(producto, tipoMovimiento, cantidad);

  document.getElementById("formMovimiento").reset();
  document.getElementById("fecha").value = new Date().toISOString().slice(0, 10);
  pintarTabla();
}

function aplicarMovimientoAInventario(producto, tipoMovimiento, cantidad) {
  const item = almacenInventario.find((i) => i.producto === producto);
  if (!item) return;

  if (tipoMovimiento === "entrada") {
    item.cantidadActual += cantidad;
  } else if (tipoMovimiento === "salida") {
    item.cantidadActual = Math.max(0, item.cantidadActual - cantidad);
  } else if (tipoMovimiento === "ajuste") {
    item.cantidadActual = cantidad;
  }

  if (item.cantidadActual <= 0) item.estado = "sin_stock";
  else if (item.cantidadActual <= item.stockMinimo) item.estado = "bajo";
  else item.estado = "disponible";

  guardarLocal("inventario", almacenInventario);
}

function pintarTabla() {
  const filtro = document.getElementById("filtroTipo").value;
  const filtrados = movimientos
    .filter((m) => !filtro || m.tipoMovimiento === filtro)
    .sort((a, b) => (a.fecha < b.fecha ? 1 : -1));

  const cuerpo = document.getElementById("tablaMovimientos");

  if (!filtrados.length) {
    cuerpo.innerHTML = `<tr><td colspan="6"><p class="empty-state">No hay movimientos registrados</p></td></tr>`;
    return;
  }

  const etiquetas = { entrada: "Entrada", salida: "Salida", ajuste: "Ajuste" };
  const badges = { entrada: "badge-success", salida: "badge-danger", ajuste: "badge-warning" };

  cuerpo.innerHTML = filtrados
    .map(
      (m) => `
      <tr>
        <td>${formatoFecha(m.fecha)}</td>
        <td>${m.producto}</td>
        <td>${m.cantidad}</td>
        <td><span class="badge ${badges[m.tipoMovimiento]}">${etiquetas[m.tipoMovimiento]}</span></td>
        <td>${m.responsable}</td>
        <td>${m.observacion || "-"}</td>
      </tr>`
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", iniciarAlmacen);
