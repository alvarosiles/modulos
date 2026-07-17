// Sidebar y topbar compartidos por todas las páginas de Restobar.
// No es un framework: solo evita repetir el mismo bloque de HTML en cada página.

const MENU_ITEMS = [
  { key: "dashboard", icon: "🏠", label: "Dashboard", path: "index.html" },
  { key: "pos", icon: "🛒", label: "Punto de Venta", path: "pages/pos.html" },
  { key: "productos", icon: "🍔", label: "Productos", path: "pages/productos.html" },
  { key: "menu", icon: "📋", label: "Menú", path: "pages/menu.html" },
  { key: "inventario", icon: "📦", label: "Inventario", path: "pages/inventario.html" },
  { key: "almacen", icon: "🏬", label: "Almacén", path: "pages/almacen.html" },
  { key: "proveedores", icon: "🚚", label: "Proveedores", path: "pages/proveedores.html" },
  { key: "clientes", icon: "👥", label: "Clientes", path: "pages/clientes.html" },
  { key: "ventas", icon: "💰", label: "Ventas", path: "pages/ventas.html" },
  { key: "reportes", icon: "📊", label: "Reportes", path: "pages/reportes.html" },
  { key: "configuracion", icon: "⚙", label: "Configuración", path: "pages/configuracion.html" },
];

/**
 * Dibuja el sidebar y el título de la topbar.
 * @param {string} activeKey clave del módulo activo (ver MENU_ITEMS)
 * @param {string} basePath  "" en index.html, "../" dentro de pages/
 * @param {string} titulo    texto a mostrar en la topbar
 */
function renderSidebar(activeKey, basePath, titulo) {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    sidebar.innerHTML = `
      <div class="sidebar-brand">🍽️ Restobar</div>
      <nav class="sidebar-nav">
        ${MENU_ITEMS.map(
          (item) => `
          <a href="${basePath}${item.path}" class="nav-link${item.key === activeKey ? " active" : ""}">
            ${item.icon} ${item.label}
          </a>`
        ).join("")}
      </nav>
    `;
  }

  const pageTitle = document.getElementById("pageTitle");
  if (pageTitle && titulo) {
    pageTitle.textContent = titulo;
  }

  iniciarMenuMovil();
}
