// Módulo Reportes (pages/reportes.html)

async function iniciarReportes() {
  const [ventas, productos, inventario, movimientos] = await Promise.all([
    cargarColeccion("ventas", "../data/ventas.json"),
    cargarColeccion("productos", "../data/productos.json"),
    cargarColeccion("inventario", "../data/inventario.json"),
    cargarColeccion("movimientos", "../data/movimientos.json"),
  ]);

  const ventasValidas = ventas.filter((v) => v.estado !== "anulada");

  pintarResumen(ventasValidas, productos, inventario);
  pintarVentasDiarias(ventasValidas);
  pintarVentasMensuales(ventasValidas);
  pintarMasVendidos(ventasValidas);
  pintarInventarioActual(inventario);
  pintarMovimientos(movimientos);
}

function pintarResumen(ventas, productos, inventario) {
  const totalVentas = ventas.reduce((sum, v) => sum + v.total, 0);
  const productosPorId = Object.fromEntries(productos.map((p) => [p.id, p]));

  const ganancias = ventas.reduce((sum, v) => {
    return (
      sum +
      v.productos.reduce((s, p) => {
        const costo = productosPorId[p.productoId]?.costo || 0;
        return s + (p.precio - costo) * p.cantidad;
      }, 0)
    );
  }, 0);

  const bajoStock = inventario.filter((i) => i.estado === "bajo" || i.estado === "sin_stock").length;

  document.getElementById("totalVentasGeneral").textContent = formatoMoneda(totalVentas);
  document.getElementById("totalGanancias").textContent = formatoMoneda(ganancias);
  document.getElementById("totalBajoStock").textContent = bajoStock;
}

function dibujarBarras(contenedorId, datos) {
  const contenedor = document.getElementById(contenedorId);
  const maximo = Math.max(...datos.map((d) => d.valor), 1);

  if (!datos.length) {
    contenedor.innerHTML = '<p class="empty-state">Sin datos suficientes</p>';
    return;
  }

  contenedor.innerHTML = datos
    .map(
      (d) => `
      <div class="bar-col">
        <span class="bar-label">${formatoMoneda(d.valor)}</span>
        <div class="bar" style="height: ${(d.valor / maximo) * 100}%;"></div>
        <span class="bar-label">${d.etiqueta}</span>
      </div>`
    )
    .join("");
}

function pintarVentasDiarias(ventas) {
  const dias = [];
  for (let i = 6; i >= 0; i--) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - i);
    dias.push(fecha.toISOString().slice(0, 10));
  }

  const datos = dias.map((fecha) => ({
    etiqueta: fecha.slice(5),
    valor: ventas.filter((v) => v.fecha === fecha).reduce((sum, v) => sum + v.total, 0),
  }));

  dibujarBarras("chartVentasDiarias", datos);
}

function pintarVentasMensuales(ventas) {
  const meses = {};
  ventas.forEach((v) => {
    const mes = v.fecha.slice(0, 7);
    meses[mes] = (meses[mes] || 0) + v.total;
  });

  const datos = Object.entries(meses)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([mes, valor]) => ({ etiqueta: mes, valor }));

  dibujarBarras("chartVentasMensuales", datos);
}

function pintarMasVendidos(ventas) {
  const resumen = {};

  ventas.forEach((v) => {
    v.productos.forEach((p) => {
      if (!resumen[p.nombre]) resumen[p.nombre] = { cantidad: 0, total: 0 };
      resumen[p.nombre].cantidad += p.cantidad;
      resumen[p.nombre].total += p.precio * p.cantidad;
    });
  });

  const filas = Object.entries(resumen)
    .sort(([, a], [, b]) => b.cantidad - a.cantidad)
    .slice(0, 10);

  const cuerpo = document.getElementById("tablaMasVendidos");

  if (!filas.length) {
    cuerpo.innerHTML = `<tr><td colspan="3"><p class="empty-state">Sin ventas registradas</p></td></tr>`;
    return;
  }

  cuerpo.innerHTML = filas
    .map(
      ([nombre, datos]) => `
      <tr>
        <td>${nombre}</td>
        <td>${datos.cantidad}</td>
        <td>${formatoMoneda(datos.total)}</td>
      </tr>`
    )
    .join("");
}

function pintarInventarioActual(inventario) {
  const etiquetas = { disponible: "🟢 Disponible", bajo: "🟡 Bajo", sin_stock: "🔴 Sin stock" };
  const cuerpo = document.getElementById("tablaInventarioActual");

  cuerpo.innerHTML = inventario
    .map(
      (i) => `
      <tr>
        <td>${i.producto}</td>
        <td>${i.cantidadActual}</td>
        <td>${i.unidad}</td>
        <td>${etiquetas[i.estado] || i.estado}</td>
      </tr>`
    )
    .join("");
}

function pintarMovimientos(movimientos) {
  const etiquetas = { entrada: "Entrada", salida: "Salida", ajuste: "Ajuste" };
  const cuerpo = document.getElementById("tablaMovimientosReporte");
  const ultimos = [...movimientos].sort((a, b) => (a.fecha < b.fecha ? 1 : -1)).slice(0, 10);

  if (!ultimos.length) {
    cuerpo.innerHTML = `<tr><td colspan="5"><p class="empty-state">Sin movimientos registrados</p></td></tr>`;
    return;
  }

  cuerpo.innerHTML = ultimos
    .map(
      (m) => `
      <tr>
        <td>${formatoFecha(m.fecha)}</td>
        <td>${m.producto}</td>
        <td>${m.cantidad}</td>
        <td>${etiquetas[m.tipoMovimiento]}</td>
        <td>${m.responsable}</td>
      </tr>`
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", iniciarReportes);
