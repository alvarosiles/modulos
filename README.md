# modulos
https://alvarosiles.github.io/modulos/


Actúa como un desarrollador Senior especializado en sistemas POS, aplicaciones web, HTML5, CSS3, JavaScript ES6, UX/UI y gestión de inventarios.

Quiero crear una aplicación web llamada **Restobar**.

URL del proyecto:

restobar.alvarosiles.cloud

Objetivo:

Crear un sistema completo de administración para un restobar que permita gestionar punto de venta (POS), productos, menú, inventario, almacén, proveedores, clientes, ventas y reportes.

La aplicación debe funcionar inicialmente como una aplicación web estática utilizando archivos JSON para almacenar datos de ejemplo.

---

# Tecnologías

Utilizar:

* HTML5
* CSS3
* JavaScript ES6
* JSON
* LocalStorage

No utilizar frameworks.

No utilizar backend.

Código organizado y escalable.

---

# Diseño

Crear una interfaz moderna tipo sistema empresarial.

Inspiración:

* Sistemas POS profesionales
* Restaurantes modernos
* Dashboards administrativos

Estilo:

Modo oscuro elegante.

Colores:

Fondo:
#111827

Sidebar:
#1F2937

Tarjetas:
#1F2937

Color principal:
#F97316 (naranja restaurante)

Éxito:
#10B981

Error:
#EF4444

Texto:
#FFFFFF

Diseño responsive:

* Computadora
* Tablet
* Móvil

---

# Menú lateral

Crear:

🏠 Dashboard

🛒 Punto de Venta

🍔 Productos

📋 Menú

📦 Inventario

🏬 Almacén

🚚 Proveedores

👥 Clientes

💰 Ventas

📊 Reportes

⚙ Configuración

---

# Dashboard principal

Mostrar tarjetas:

Ventas del día

Ventas del mes

Productos vendidos

Productos con bajo stock

Clientes registrados

Proveedores

Ganancias estimadas

Últimas ventas

---

# Módulo Punto de Venta (POS)

Crear una pantalla de venta rápida.

Debe tener:

Lista de productos.

Categorías:

🍔 Hamburguesas

🍟 Complementos

🥤 Bebidas

🍰 Postres

Buscar productos.

Agregar productos al carrito.

Mostrar:

Producto

Cantidad

Precio

Subtotal

Total

Descuento

Método de pago:

* Efectivo
* Tarjeta
* Transferencia
* QR

Botón:

Finalizar venta

---

# Productos

Crear formulario:

Campos:

ID

Nombre del producto

Categoría

Descripción

Imagen

Precio venta

Costo

Stock mínimo

Estado

Activo/Inactivo

Ejemplos:

Hamburguesa clásica

Hamburguesa doble

Papas fritas

Gaseosa

Combo familiar

---

# Inventario

Gestionar ingredientes:

Ejemplo:

Carne

Pan

Queso

Lechuga

Tomate

Papas

Bebidas

Campos:

Producto

Cantidad actual

Unidad

Stock mínimo

Estado

Mostrar alertas:

🟢 Stock disponible

🟡 Stock bajo

🔴 Sin stock

---

# Almacén

Crear módulo para:

Entradas de productos

Salidas

Ajustes

Movimientos

Campos:

Fecha

Producto

Cantidad

Tipo movimiento

Responsable

Observación

---

# Proveedores

Registrar:

Empresa

Contacto

Teléfono

WhatsApp

Correo

Productos suministrados

Dirección

Estado

---

# Clientes

Registrar:

Nombre

Teléfono

Correo

Dirección

Historial de compras

---

# Ventas

Crear historial:

Número venta

Fecha

Cliente

Productos

Total

Método pago

Estado

---

# Reportes

Crear:

Ventas diarias

Ventas mensuales

Productos más vendidos

Ganancias

Inventario actual

Movimientos de almacén

---

# Archivos JSON

Crear carpeta:

data/

Archivos:

productos.json

inventario.json

ventas.json

clientes.json

proveedores.json

Ejemplo productos.json:

{
"productos":[
{
"id":1,
"nombre":"Hamburguesa Clásica",
"categoria":"Hamburguesa",
"precio":25,
"costo":12,
"stock":50,
"imagen":"assets/productos/hamburguesa.png",
"estado":"activo"
}
]
}

---

# Estructura del proyecto

Crear:

restobar/

│
├── index.html
├── style.css
├── app.js
│
├── pages/
│   ├── pos.html
│   ├── productos.html
│   ├── inventario.html
│   ├── almacen.html
│   ├── ventas.html
│   ├── clientes.html
│   └── reportes.html
│
├── data/
│   ├── productos.json
│   ├── inventario.json
│   ├── ventas.json
│   ├── clientes.json
│   └── proveedores.json
│
├── js/
│   ├── pos.js
│   ├── productos.js
│   ├── inventario.js
│   ├── ventas.js
│   └── utils.js
│
├── assets/
│   ├── images/
│   └── icons/
│
├── README.md
└── LICENSE

---

# Funciones

Implementar:

✔ Cargar información desde JSON

✔ Mostrar productos

✔ Crear ventas

✔ Carrito de compra

✔ Cálculo automático de totales

✔ Control de inventario

✔ Alertas de stock

✔ Buscar productos

✔ Filtrar categorías

✔ Guardar configuración en LocalStorage

✔ Diseño preparado para agregar backend después

---

# Diseño de impresión

Crear una plantilla de ticket:

```
RESTOBAR

Fecha:
Venta:

Producto      Cantidad   Precio

Hamburguesa       2       50

TOTAL: 50

Gracias por su visita
```

---

# Calidad del código

El código debe ser:

* Profesional
* Modular
* Escalable
* Comentado
* Fácil de mantener

Aplicar buenas prácticas de programación.

---

# README.md

Crear documentación:

* Descripción
* Características
* Instalación
* Uso
* Estructura
* Cómo agregar productos
* Cómo modificar inventario
* Cómo publicar en hosting
* Cómo conectar restobar.alvarosiles.cloud

---

# Entrega

Genera el proyecto archivo por archivo.

Orden:

1. Estructura del proyecto
2. Diseño HTML
3. CSS completo
4. JavaScript
5. Archivos JSON con datos reales de ejemplo
6. Módulos POS
7. README.md

Explica cada archivo antes de mostrar el código.

No resumas.

Espera mi confirmación antes de continuar con el siguiente archivo.
