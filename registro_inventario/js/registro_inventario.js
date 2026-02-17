// ===== JSON DATA =====

const almacenes = [
    { id: 1, nombre: "Almacén Central" },
    { id: 2, nombre: "Almacén Secundario" },
    { id: 3, nombre: "Almacén Norte" }
];

const tiposRegistro = [
    "Ingreso",
    "Egreso",
    "Baja",
    "Ajuste"
];

const productos = [
    { id: 1, nombre: "Laptop HP", precio: 5000 },
    { id: 2, nombre: "Mouse Logitech", precio: 80 },
    { id: 3, nombre: "Teclado Mecánico", precio: 250 },
    { id: 4, nombre: "Monitor 24\"", precio: 1200 },
    { id: 5, nombre: "Impresora Epson", precio: 900 },
    { id: 6, nombre: "Router TP-Link", precio: 300 },
    { id: 7, nombre: "Disco SSD 1TB", precio: 650 },
    { id: 8, nombre: "Memoria RAM 16GB", precio: 400 },
    { id: 9, nombre: "Gabinete Gamer", precio: 550 },
    { id: 10, nombre: "Fuente 750W", precio: 450 },
    { id: 11, nombre: "Tablet Samsung", precio: 2200 },
    { id: 12, nombre: "Celular Xiaomi", precio: 1800 },
    { id: 13, nombre: "Cámara Web", precio: 250 },
    { id: 14, nombre: "Proyector", precio: 3500 },
    { id: 15, nombre: "Switch 8 Puertos", precio: 320 },
    { id: 16, nombre: "Cable HDMI", precio: 50 },
    { id: 17, nombre: "UPS 1200VA", precio: 800 },
    { id: 18, nombre: "Disco Externo 2TB", precio: 700 },
    { id: 19, nombre: "Auriculares Bluetooth", precio: 350 },
    { id: 20, nombre: "Microfono USB", precio: 300 }
];

// donde se guardarán los registros
let registros = [];

// ===== CARGAR SELECTS =====

window.onload = () => {
    const almacenSelect = document.getElementById("almacen");
    almacenes.forEach(a=>{
        almacenSelect.innerHTML += `<option value="${a.id}">${a.nombre}</option>`;
    });

    const tipoSelect = document.getElementById("tiporegistro");
    tiposRegistro.forEach(t=>{
        tipoSelect.innerHTML += `<option>${t}</option>`;
    });

    agregarFila();
};

// ===== TABS =====
function switchTab(id){
    document.querySelectorAll(".tab-content").forEach(c=>c.classList.remove("active"));
    document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));

    document.getElementById(id).classList.add("active");
    event.target.classList.add("active");

    if(id==="historicos") cargarHistoricos();
}

// ===== AGREGAR FILA =====
function agregarFila(){
    const tbody = document.querySelector("#detalleTable tbody");
    const row = document.createElement("tr");

    row.innerHTML = `
        <td></td>
        <td>
            <input list="productosList" class="producto-input">
        </td>
        <td><input type="number" class="cantidad" value="1"></td>
        <td class="subtotal">0</td>
        <td><button onclick="this.parentElement.parentElement.remove()">X</button></td>
    `;

    tbody.appendChild(row);
    actualizarNumeros();
}

function actualizarNumeros(){
    document.querySelectorAll("#detalleTable tbody tr").forEach((tr,i)=>{
        tr.children[0].innerText = i+1;
    });
}

// ===== AUTOCOMPLETADO =====
const datalist = document.createElement("datalist");
datalist.id="productosList";
productos.forEach(p=>{
    datalist.innerHTML += `<option value="${p.nombre}">`;
});
document.body.appendChild(datalist);

// recalcular subtotal
document.addEventListener("input", function(e){
    if(e.target.classList.contains("cantidad") || e.target.classList.contains("producto-input")){
        const row = e.target.closest("tr");
        const nombre = row.querySelector(".producto-input").value;
        const cantidad = parseFloat(row.querySelector(".cantidad").value) || 0;

        const prod = productos.find(p=>p.nombre===nombre);
        const subtotal = prod ? prod.precio * cantidad : 0;

        row.querySelector(".subtotal").innerText = subtotal;
    }
});

// ===== PROCESAR =====
function procesar(){

    const detalle = [];

    document.querySelectorAll("#detalleTable tbody tr").forEach(tr=>{
        const nombre = tr.querySelector(".producto-input").value;
        const cantidad = tr.querySelector(".cantidad").value;

        if(nombre){
            detalle.push({ nombre, cantidad });
        }
    });

    const registro = {
        fecha: document.getElementById("fecha").value,
        almacen: document.getElementById("almacen").selectedOptions[0].text,
        tipo: document.getElementById("tiporegistro").value,
        nrodoc: document.getElementById("nrodoc").value,
        detalle
    };

    registros.push(registro);

    alert("Registro guardado correctamente");
    limpiarFormulario();
}

// ===== LIMPIAR =====
function limpiarFormulario(){
    document.getElementById("nrodoc").value="";
    document.getElementById("descripcion").value="";
    document.querySelector("#detalleTable tbody").innerHTML="";
    agregarFila();
}

// ===== HISTORICOS =====
function cargarHistoricos(){
    const tbody = document.querySelector("#historicosTable tbody");
    tbody.innerHTML="";

    registros.forEach(r=>{
        tbody.innerHTML += `
            <tr>
                <td>${r.fecha}</td>
                <td>${r.almacen}</td>
                <td>${r.tipo}</td>
                <td>${r.nrodoc}</td>
                <td>${r.detalle.length}</td>
            </tr>
        `;
    });
}
