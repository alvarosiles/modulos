// Historial de Ventas (pages/ventas.html)

let ventas = [];

async function iniciarVentas() {
  ventas = await cargarColeccion("ventas", "../data/ventas.json");

  pintarTabla();

  document.getElementById("buscarVenta").addEventListener("input", pintarTabla);
  document.getElementById("filtroEstado").addEventListener("change", pintarTabla);
}

function pintarTabla() {
  const texto = document.getElementById("buscarVenta").value.trim().toLowerCase();
  const filtroEstado = document.getElementById("filtroEstado").value;

  const filtradas = ventas
    .filter((v) => {
      const coincideTexto =
        v.numeroVenta.toLowerCase().includes(texto) || v.cliente.toLowerCase().includes(texto);
      const coincideEstado = !filtroEstado || v.estado === filtroEstado;
      return coincideTexto && coincideEstado;
    })
    .sort((a, b) => (a.fecha < b.fecha ? 1 : -1));

  const cuerpo = document.getElementById("tablaVentas");

  if (!filtradas.length) {
    cuerpo.innerHTML = `<tr><td colspan="7"><p class="empty-state">No hay ventas registradas</p></td></tr>`;
    return;
  }

  const badges = { completada: "badge-success", pendiente: "badge-warning", anulada: "badge-danger" };

  cuerpo.innerHTML = filtradas
    .map(
      (v) => `
      <tr>
        <td>${v.numeroVenta}</td>
        <td>${formatoFecha(v.fecha)}</td>
        <td>${v.cliente}</td>
        <td>${formatoMoneda(v.total)}</td>
        <td>${v.metodoPago}</td>
        <td><span class="badge ${badges[v.estado] || "badge-muted"}">${v.estado}</span></td>
        <td class="actions-cell">
          <button class="btn btn-sm" data-ticket="${v.id}">Ver ticket</button>
          ${v.estado !== "anulada" ? `<button class="btn btn-sm btn-danger" data-anular="${v.id}">Anular</button>` : ""}
        </td>
      </tr>`
    )
    .join("");

  cuerpo.querySelectorAll("[data-ticket]").forEach((btn) =>
    btn.addEventListener("click", () => imprimirTicket(Number(btn.dataset.ticket)))
  );
  cuerpo.querySelectorAll("[data-anular]").forEach((btn) =>
    btn.addEventListener("click", () => anularVenta(Number(btn.dataset.anular)))
  );
}

function anularVenta(id) {
  if (!confirm("¿Anular esta venta?")) return;

  const venta = ventas.find((v) => v.id === id);
  if (!venta) return;

  venta.estado = "anulada";
  guardarLocal("ventas", ventas);
  pintarTabla();
}

function imprimirTicket(id) {
  const venta = ventas.find((v) => v.id === id);
  if (!venta) return;

  document.getElementById("ticketFecha").textContent = formatoFecha(venta.fecha);
  document.getElementById("ticketNumero").textContent = venta.numeroVenta;
  document.getElementById("ticketTotal").textContent = formatoMoneda(venta.total);

  document.getElementById("ticketItems").innerHTML = venta.productos
    .map(
      (p) => `<div class="ticket-line"><span>${p.nombre} x${p.cantidad}</span><span>${formatoMoneda(p.precio * p.cantidad)}</span></div>`
    )
    .join("");

  window.print();
}

document.addEventListener("DOMContentLoaded", iniciarVentas);
