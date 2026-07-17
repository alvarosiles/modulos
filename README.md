# Restobar

Sistema completo de administración para un restobar: punto de venta (POS), productos, menú, inventario, almacén, proveedores, clientes, ventas y reportes.

Aplicación web estática — sin frameworks ni backend. Los datos de ejemplo viven en `data/*.json` y todos los cambios del usuario se persisten en el `localStorage` del navegador.

URL del proyecto: [restobar.alvarosiles.cloud](https://restobar.alvarosiles.cloud)

## Características

- 🏠 **Dashboard** con ventas del día/mes, productos vendidos, alertas de bajo stock, clientes, proveedores y ganancias estimadas.
- 🛒 **Punto de Venta**: búsqueda y filtro por categoría, carrito, descuento, métodos de pago (efectivo, tarjeta, transferencia, QR) e impresión de ticket.
- 🍔 **Productos**: alta, edición y baja con precio, costo, categoría y estado.
- 📋 **Menú**: vista pública de productos activos agrupados por categoría.
- 📦 **Inventario**: control de ingredientes con alertas automáticas (🟢 disponible, 🟡 bajo, 🔴 sin stock).
- 🏬 **Almacén**: entradas, salidas y ajustes que actualizan el inventario en tiempo real.
- 🚚 **Proveedores** y 👥 **Clientes**: gestión de contactos e historial de compras.
- 💰 **Ventas**: historial con reimpresión de ticket y anulación.
- 📊 **Reportes**: ventas diarias/mensuales, productos más vendidos, ganancias, inventario y movimientos de almacén.
- ⚙ **Configuración**: datos del negocio y restablecer los datos de ejemplo.

## Instalación

No requiere `npm install` ni build. Solo necesitas servir los archivos estáticos (los módulos usan `fetch` para leer los JSON, por lo que **no funciona abriendo `index.html` directamente con `file://`**).

Opciones para levantar un servidor local:

```bash
# Con Node.js
npx serve .

# o con Python
python -m http.server 8080
```

Luego abre `http://localhost:8080` en el navegador.

## Uso

1. Entra por **Dashboard** para ver el resumen del negocio.
2. Usa **Punto de Venta** para registrar ventas rápidas.
3. Administra **Productos**, **Inventario**, **Almacén**, **Proveedores** y **Clientes** desde sus respectivos módulos.
4. Revisa **Ventas** y **Reportes** para el histórico y las métricas.
5. Ajusta el nombre del negocio o restablece los datos de ejemplo en **Configuración**.

## Estructura del proyecto

```
restobar/
├── index.html
├── style.css
├── app.js
├── pages/
│   ├── pos.html
│   ├── productos.html
│   ├── menu.html
│   ├── inventario.html
│   ├── almacen.html
│   ├── proveedores.html
│   ├── clientes.html
│   ├── ventas.html
│   ├── reportes.html
│   └── configuracion.html
├── data/
│   ├── productos.json
│   ├── inventario.json
│   ├── movimientos.json
│   ├── ventas.json
│   ├── clientes.json
│   └── proveedores.json
├── js/
│   ├── sidebar.js
│   ├── utils.js
│   ├── pos.js
│   ├── productos.js
│   ├── menu.js
│   ├── inventario.js
│   ├── almacen.js
│   ├── proveedores.js
│   ├── clientes.js
│   ├── ventas.js
│   ├── reportes.js
│   └── configuracion.js
└── assets/
    ├── images/
    └── icons/
```

## Cómo agregar productos

Ve a **Productos → Nuevo producto** y completa nombre, categoría, precio, costo, stock mínimo y estado. El producto aparece de inmediato en el **Punto de Venta** y en el **Menú** (si está activo).

## Cómo modificar inventario

En **Inventario** puedes editar la cantidad actual y el stock mínimo de cada ingrediente; el estado (disponible/bajo/sin stock) se recalcula solo. Para registrar movimientos con trazabilidad (entradas, salidas, ajustes con responsable y observación), usa **Almacén** — ahí sí se actualiza el inventario automáticamente.

## Cómo publicar en hosting

Al ser una app 100% estática, puede publicarse en cualquier hosting de archivos estáticos:

- **GitHub Pages**: sube el contenido de este repo a la rama `main`/`gh-pages` y activa Pages en la configuración del repositorio.
- Cualquier otro hosting estático (Netlify, Vercel, un servidor propio, etc.) también sirve: solo necesita servir estos archivos tal cual.

## Cómo conectar restobar.alvarosiles.cloud

1. En el hosting elegido, configura el dominio personalizado `restobar.alvarosiles.cloud`.
2. Si usas GitHub Pages, agrega/edita el archivo `CNAME` en la raíz del repo con el contenido:
   ```
   restobar.alvarosiles.cloud
   ```
3. En tu proveedor de DNS, crea un registro `CNAME` que apunte `restobar.alvarosiles.cloud` hacia el dominio del hosting (por ejemplo `tuusuario.github.io`).
4. Espera la propagación del DNS y verifica que el certificado HTTPS se emita correctamente.
