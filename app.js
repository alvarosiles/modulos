// Lógica del Dashboard principal (index.html)

async function iniciarDashboard() {
  const [ventas, productos, clientes, proveedores, inventario] = await Promise.all([
    cargarColeccion("ventas", "data/ventas.json"),
    cargarColeccion("productos", "data/productos.json"),
    cargarColeccion("clientes", "data/clientes.json"),
    cargarColeccion("proveedores", "data/proveedores.json"),
    cargarColeccion("inventario", "data/inventario.json"),
  ]);

  pintarTarjetas(ventas, productos, clientes, proveedores, inventario);
  pintarUltimasVentas(ventas);
}

function pintarTarjetas(ventas, productos, clientes, proveedores, inventario) {
  const hoy = new Date().toISOString().slice(0, 10);
  const mesActual = hoy.slice(0, 7);

  const ventasHoy = ventas.filter((v) => v.fecha === hoy);
  const ventasMes = ventas.filter((v) => v.fecha.startsWith(mesActual));

  const totalHoy = ventasHoy.reduce((sum, v) => sum + v.total, 0);
  const totalMes = ventasMes.reduce((sum, v) => sum + v.total, 0);

  const productosVendidos = ventas.reduce((sum, v) => {
    return sum + v.productos.reduce((s, p) => s + p.cantidad, 0);
  }, 0);

  const productosPorId = Object.fromEntries(productos.map((p) => [p.id, p]));
  const gananciaEstimada = ventas.reduce((sum, v) => {
    const gananciaVenta = v.productos.reduce((s, p) => {
      const prod = productosPorId[p.productoId];
      const costo = prod ? prod.costo : 0;
      return s + (p.precio - costo) * p.cantidad;
    }, 0);
    return sum + gananciaVenta;
  }, 0);

  const stockBajo = inventario.filter(
    (item) => item.estado === "bajo" || item.estado === "sin_stock"
  ).length;

  document.getElementById("ventasDia").textContent = formatoMoneda(totalHoy);
  document.getElementById("ventasMes").textContent = formatoMoneda(totalMes);
  document.getElementById("productosVendidos").textContent = productosVendidos;
  document.getElementById("stockBajo").textContent = stockBajo;
  document.getElementById("totalClientes").textContent = clientes.length;
  document.getElementById("totalProveedores").textContent = proveedores.length;
  document.getElementById("gananciasEstimadas").textContent = formatoMoneda(gananciaEstimada);
}

function pintarUltimasVentas(ventas) {
  const cuerpo = document.querySelector("#tablaUltimasVentas tbody");
  const ultimas = [...ventas].sort((a, b) => (a.fecha < b.fecha ? 1 : -1)).slice(0, 5);

  cuerpo.innerHTML = ultimas
    .map(
      (v) => `
        <tr>
          <td>${v.numeroVenta}</td>
          <td>${formatoFecha(v.fecha)}</td>
          <td>${v.cliente}</td>
          <td>${formatoMoneda(v.total)}</td>
          <td>${v.estado}</td>
        </tr>`
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", iniciarDashboard);
