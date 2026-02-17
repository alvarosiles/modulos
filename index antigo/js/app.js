 import {
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  Timestamp
} from "./firebase.js";

import {
  colProductos,
  colAlmacenes,
  colInventario,
  colRecetas,
  colVentas,
  colKardex
} from "./app.js";

/* =========================
   ESPERAR DOM
========================= */
document.addEventListener("DOMContentLoaded", () => {
  init();
});

const almacenSelect = document.getElementById("almacen");
const productoSelect = document.getElementById("producto");
const cantidadInput = document.getElementById("cantidad");
const venderBtn = document.getElementById("vender");

/* =========================
   INIT
========================= */
async function init() {
  await cargarSelects();
}

/* =========================
   CARGAR ALMACENES Y PRODUCTOS
========================= */
async function cargarSelects() {

  const alm = await getDocs(colAlmacenes);
  almacenSelect.innerHTML = "";

  alm.forEach(d => {
    almacenSelect.innerHTML += `
      <option value="${d.id}">
        ${d.data().nombre}
      </option>`;
  });

  const prod = await getDocs(colProductos);
  productoSelect.innerHTML = "";

  prod.forEach(d => {
    productoSelect.innerHTML += `
      <option value="${d.id}">
        ${d.data().nombre}
      </option>`;
  });
}

/* =========================
   VENDER
========================= */
venderBtn.onclick = async () => {

  const productoId = productoSelect.value;
  const almacenId = almacenSelect.value;
  const cantidadVenta = Number(cantidadInput.value);

  if (!productoId || !almacenId) {
    alert("Seleccione producto y almacén");
    return;
  }

  if (isNaN(cantidadVenta) || cantidadVenta <= 0) {
    alert("Cantidad inválida");
    return;
  }

  // 🔥 Obtener receta del producto
  const recetasSnap = await getDocs(
    query(colRecetas, where("productoId", "==", productoId))
  );

  if (recetasSnap.empty) {
    alert("Este producto no tiene receta configurada");
    return;
  }

  /* =========================
     1️⃣ VALIDAR STOCK PRIMERO
  ========================= */

  const movimientos = [];

  for (const r of recetasSnap.docs) {

    const receta = r.data();
    const totalNecesario = receta.cantidad * cantidadVenta;

    const invSnap = await getDocs(
      query(
        colInventario,
        where("ingredienteId", "==", receta.ingredienteId),
        where("almacenId", "==", almacenId)
      )
    );

    if (invSnap.empty) {
      alert("No existe inventario para un ingrediente");
      return;
    }

    const invDoc = invSnap.docs[0];
    const stockActual = invDoc.data().stock;

    if (stockActual < totalNecesario) {
      alert("Stock insuficiente para completar la venta");
      return;
    }

    movimientos.push({
      inventarioId: invDoc.id,
      ingredienteId: receta.ingredienteId,
      stockActual,
      totalNecesario
    });
  }

  /* =========================
     2️⃣ DESCONTAR STOCK
  ========================= */

  for (const mov of movimientos) {

    const stockNuevo = mov.stockActual - mov.totalNecesario;

    await updateDoc(doc(colInventario, mov.inventarioId), {
      stock: stockNuevo
    });

    await addDoc(colKardex, {
      ingredienteId: mov.ingredienteId,
      almacenId,
      tipo: "venta",
      cantidad: mov.totalNecesario,
      stockAnterior: mov.stockActual,
      stockNuevo: stockNuevo,
      fecha: Timestamp.now(),
      referencia: productoId
    });
  }

  /* =========================
     3️⃣ REGISTRAR VENTA
  ========================= */

  await addDoc(colVentas, {
    productoId,
    cantidad: cantidadVenta,
    almacenId,
    fecha: Timestamp.now()
  });

  cantidadInput.value = "";

  alert("Venta realizada correctamente");
};
