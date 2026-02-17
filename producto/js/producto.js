let DB = {
    Producto: [
        {id:1,codigo:"P001",descripcion:"Coca Cola 2L",marca:"Coca Cola",grupoId:1,subGrupoId:1,origenId:1,minimo:10,maximo:100},
        {id:2,codigo:"P002",descripcion:"Jugo Naranja",marca:"Del Valle",grupoId:1,subGrupoId:2,origenId:2,minimo:5,maximo:50},
        {id:3,codigo:"P003",descripcion:"Hamburguesa",marca:"Casa Burger",grupoId:2,subGrupoId:3,origenId:1,minimo:20,maximo:200}
    ]
};

let productos = DB.Producto;
let indiceActual = -1;

function limpiarFormulario(){
    document.querySelectorAll("#formProducto input, #formProducto select")
        .forEach(el => el.value = "");
    indiceActual = -1;
}

function cargarProducto(indice){
    if(indice < 0 || indice >= productos.length) return;

    let p = productos[indice];

    codigo.value = p.codigo;
    descripcion.value = p.descripcion;
    marca.value = p.marca;
    grupo.value = p.grupoId;
    subgrupo.value = p.subGrupoId;
    origen.value = p.origenId;
    minimo.value = p.minimo;
    maximo.value = p.maximo;

    indiceActual = indice;
}

function guardarProducto(){

    let nuevo = {
        id: indiceActual === -1 ? Date.now() : productos[indiceActual].id,
        codigo: codigo.value,
        descripcion: descripcion.value,
        marca: marca.value,
        grupoId: parseInt(grupo.value),
        subGrupoId: parseInt(subgrupo.value),
        origenId: parseInt(origen.value),
        minimo: parseInt(minimo.value),
        maximo: parseInt(maximo.value)
    };

    if(indiceActual === -1){
        productos.push(nuevo);
    } else {
        productos[indiceActual] = nuevo;
    }

    actualizarTabla();
    limpiarFormulario();
}

function actualizarTabla(){

    let tbody = document.querySelector("#tablaProductos tbody");
    tbody.innerHTML = "";

    productos.forEach((p,index)=>{

        let fila = `
        <tr onclick="cargarProducto(${index})">
            <td>${p.codigo}</td>
            <td>${p.descripcion}</td>
            <td>${p.marca}</td>
            <td>${p.minimo}</td>
            <td>${p.maximo}</td>
        </tr>`;

        tbody.innerHTML += fila;
    });
}

/* BOTONES */

document.querySelector(".btn-nuevo").onclick = limpiarFormulario;
document.querySelector(".btn-guardar").onclick = guardarProducto;

document.querySelector(".btn-primero").onclick = ()=> cargarProducto(0);
document.querySelector(".btn-ultimo").onclick = ()=> cargarProducto(productos.length-1);

document.querySelector(".btn-anterior").onclick = ()=>{
    if(indiceActual > 0)
        cargarProducto(indiceActual - 1);
};

document.querySelector(".btn-siguiente").onclick = ()=>{
    if(indiceActual < productos.length - 1)
        cargarProducto(indiceActual + 1);
};

/* ESCAPE */

document.addEventListener("keydown",function(e){
    if(e.key === "Escape"){
        limpiarFormulario();
    }
});

actualizarTabla();
