// Lógica del módulo Punto de Venta (pages/pos.html)

let posProductos = [];
let posClientes = [];
let posVentas = [];
let carrito = [];
let categoriaActiva = "Todas";

async function iniciarPOS() {
  [posProductos, posClientes, posVentas] = await Promise.all([
    cargarColeccion("productos", "../data/productos.json"),
    cargarColeccion("clientes", "../data/clientes.json"),
    cargarColeccion("ventas", "../data/ventas.json"),
  ]);

  posProductos = posProductos.filter((p) => p.estado === "activo");

  llenarSelectClientes();
  pintarCategorias();
  pintarProductos();

  document.getElementById("buscarProducto").addEventListener("input", pintarProductos);
  document.getElementById("descuentoInput").addEventListener("input", pintarCarrito);
  document.getElementById("finalizarVenta").addEventListener("click", finalizarVenta);
}

function llenarSelectClientes() {
  const select = document.getElementById("clienteSelect");
  posClientes.forEach((c) => {
    const opcion = document.createElement("option");
    opcion.value = c.id;
    opcion.textContent = c.nombre;
    select.appendChild(opcion);
  });
}

function pintarCategorias() {
  const categorias = ["Todas", ...new Set(posProductos.map((p) => p.categoria))];
  const contenedor = document.getElementById("categoryTabs");

  contenedor.innerHTML = categorias
    .map(
      (cat) => `<button class="category-tab${cat === categoriaActiva ? " active" : ""}" data-cat="${cat}">${cat}</button>`
    )
    .join("");

  contenedor.querySelectorAll(".category-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      categoriaActiva = btn.dataset.cat;
      pintarCategorias();
      pintarProductos();
    });
  });
}

function pintarProductos() {
  const texto = document.getElementById("buscarProducto").value.trim().toLowerCase();

  const filtrados = posProductos.filter((p) => {
    const coincideCategoria = categoriaActiva === "Todas" || p.categoria === categoriaActiva;
    const coincideTexto = p.nombre.toLowerCase().includes(texto);
    return coincideCategoria && coincideTexto;
  });

  const grid = document.getElementById("productGrid");

  if (!filtrados.length) {
    grid.innerHTML = '<p class="empty-state">No se encontraron productos</p>';
    return;
  }

  grid.innerHTML = filtrados
    .map(
      (p) => `
      <button class="product-tile" data-id="${p.id}">
        <span class="nombre">${p.nombre}</span>
        <span class="categoria">${p.categoria}</span>
        <span class="precio">${formatoMoneda(p.precio)}</span>
      </button>`
    )
    .join("");

  grid.querySelectorAll(".product-tile").forEach((tile) => {
    tile.addEventListener("click", () => agregarAlCarrito(Number(tile.dataset.id)));
  });
}

function agregarAlCarrito(productoId) {
  const producto = posProductos.find((p) => p.id === productoId);
  if (!producto) return;

  const itemExistente = carrito.find((i) => i.productoId === productoId);
  if (itemExistente) {
    itemExistente.cantidad += 1;
  } else {
    carrito.push({
      productoId: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
    });
  }

  pintarCarrito();
}

function cambiarCantidad(productoId, delta) {
  const item = carrito.find((i) => i.productoId === productoId);
  if (!item) return;

  item.cantidad += delta;
  if (item.cantidad <= 0) {
    carrito = carrito.filter((i) => i.productoId !== productoId);
  }

  pintarCarrito();
}

function pintarCarrito() {
  const contenedor = document.getElementById("cartItems");

  if (!carrito.length) {
    contenedor.innerHTML = '<p class="empty-state" id="cartVacio">El carrito está vacío</p>';
  } else {
    contenedor.innerHTML = carrito
      .map(
        (item) => `
        <div class="cart-item">
          <div class="info">
            <span class="nombre">${item.nombre}</span>
            <span class="precio-unit">${formatoMoneda(item.precio)} c/u</span>
          </div>
          <div class="qty">
            <button data-id="${item.productoId}" data-delta="-1">−</button>
            <span>${item.cantidad}</span>
            <button data-id="${item.productoId}" data-delta="1">+</button>
          </div>
          <span class="subtotal">${formatoMoneda(item.precio * item.cantidad)}</span>
        </div>`
      )
      .join("");

    contenedor.querySelectorAll("button[data-delta]").forEach((btn) => {
      btn.addEventListener("click", () =>
        cambiarCantidad(Number(btn.dataset.id), Number(btn.dataset.delta))
      );
    });
  }

  const subtotal = carrito.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
  const descuento = Math.min(Number(document.getElementById("descuentoInput").value) || 0, subtotal);
  const total = subtotal - descuento;

  document.getElementById("cartSubtotal").textContent = formatoMoneda(subtotal);
  document.getElementById("cartDescuento").textContent = formatoMoneda(descuento);
  document.getElementById("cartTotal").textContent = formatoMoneda(total);
}

function finalizarVenta() {
  if (!carrito.length) {
    alert("Agrega al menos un producto al carrito.");
    return;
  }

  const subtotal = carrito.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
  const descuento = Math.min(Number(document.getElementById("descuentoInput").value) || 0, subtotal);
  const total = subtotal - descuento;
  const metodoPago = document.querySelector('input[name="metodoPago"]:checked').value;
  const clienteId = document.getElementById("clienteSelect").value;
  const cliente = clienteId
    ? posClientes.find((c) => c.id === Number(clienteId))?.nombre
    : "Cliente general";

  const nuevaVenta = {
    id: generarId(posVentas),
    numeroVenta: `V-${String(generarId(posVentas)).padStart(4, "0")}`,
    fecha: new Date().toISOString().slice(0, 10),
    clienteId: clienteId ? Number(clienteId) : null,
    cliente,
    productos: carrito.map((i) => ({
      productoId: i.productoId,
      nombre: i.nombre,
      cantidad: i.cantidad,
      precio: i.precio,
    })),
    descuento,
    total,
    metodoPago,
    estado: "completada",
  };

  posVentas.push(nuevaVenta);
  guardarLocal("ventas", posVentas);

  imprimirTicket(nuevaVenta);

  carrito = [];
  document.getElementById("descuentoInput").value = 0;
  pintarCarrito();
}

function imprimirTicket(venta) {
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

document.addEventListener("DOMContentLoaded", iniciarPOS);
