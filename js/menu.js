// Vista de solo lectura del Menú, agrupada por categoría (pages/menu.html)

async function iniciarMenu() {
  const productos = await cargarColeccion("productos", "../data/productos.json");
  const activos = productos.filter((p) => p.estado === "activo");

  const categorias = [...new Set(activos.map((p) => p.categoria))];
  const contenedor = document.getElementById("menuContent");

  if (!categorias.length) {
    contenedor.innerHTML = '<p class="empty-state">No hay productos activos en el menú</p>';
    return;
  }

  contenedor.innerHTML = categorias
    .map(
      (categoria) => `
      <section class="panel" style="margin-bottom: 20px;">
        <h2 style="margin-bottom: 14px;">${categoria}</h2>
        <div class="product-grid">
          ${activos
            .filter((p) => p.categoria === categoria)
            .map(
              (p) => `
              <div class="product-tile" style="cursor: default;">
                <span class="nombre">${p.nombre}</span>
                <span class="categoria">${p.descripcion || ""}</span>
                <span class="precio">${formatoMoneda(p.precio)}</span>
              </div>`
            )
            .join("")}
        </div>
      </section>`
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", iniciarMenu);
