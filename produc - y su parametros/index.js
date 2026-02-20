let dataGlobal = {};
let productos = [];
let currentIndex = null;

/* ELEMENTOS */
const tbody = document.getElementById("tbody");
const counter = document.getElementById("counter");
const search = document.getElementById("search");

const codigo = document.getElementById("codigo");
const descripcion = document.getElementById("descripcion");
const precio = document.getElementById("precio");
const moneda = document.getElementById("moneda");

const marcaSelect = document.getElementById("marca");
const grupoSelect = document.getElementById("grupo");
const subGrupoSelect = document.getElementById("subGrupo");
const origenSelect = document.getElementById("origen");
const industriaSelect = document.getElementById("industria");
const medidaSelect = document.getElementById("medida");
const estadoSelect = document.getElementById("estado");

const preview = document.getElementById("preview");

const btnFirst = document.getElementById("btnFirst");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnLast = document.getElementById("btnLast");
const btnNew = document.getElementById("btnNew");
const btnDelete = document.getElementById("btnDelete");
const btnSave = document.getElementById("btnSave");
const btnCancel = document.getElementById("btnCancel");

/* ================== CARGAR JSON / STORAGE ================== */
document.addEventListener("DOMContentLoaded", () => {
    fetch("./item.json")
        .then(res => res.json())
        .then(data => {
            dataGlobal = data;
            cargarSelects(); // carga todos los selects

            // Luego cargamos productos desde storage o JSON
            const stored = localStorage.getItem("productos");
            if (stored) {
                productos = JSON.parse(stored);
            } else {
                productos = data.Producto;
            }
            renderTabla();
        });
});

/* ================== CARGAR SELECTS ================== */
function cargarSelects() {
    cargarOptions(marcaSelect, dataGlobal.Marca, "Seleccionar Marca/Tipo");
    cargarOptions(grupoSelect, dataGlobal.Grupo, "Seleccionar Grupo");
    cargarOptions(subGrupoSelect, dataGlobal.SubGrupo, "Seleccionar SubGrupo");
    cargarOptions(origenSelect, dataGlobal.Origen, "Seleccionar Origen");
    cargarOptions(industriaSelect, dataGlobal.Industria, "Seleccionar Industria");
    cargarOptions(medidaSelect, dataGlobal.Medida, "Seleccionar Medida");
    cargarOptions(estadoSelect, dataGlobal.Estado, "Seleccionar Estado");

    // actualizarSubGrupo(); // subgrupo se actualizará según grupo
}
// function cargarSelects() {
//     if (!dataGlobal.Marca) return;

//     cargarOptions(marcaSelect, dataGlobal.Marca);
//     cargarOptions(grupoSelect, dataGlobal.Grupo);
//     cargarOptions(origenSelect, dataGlobal.Origen);
//     cargarOptions(industriaSelect, dataGlobal.Industria);
//     cargarOptions(medidaSelect, dataGlobal.Medida);
//     cargarOptions(estadoSelect, dataGlobal.Estado);

//     actualizarSubGrupo();
// }

function cargarOptions(select, lista, placeholder = "Seleccionar") {
    // Primero agregamos el placeholder
    let options = `<option value="">${placeholder}</option>`;

    // Luego los elementos reales
    options += lista.map(i =>
        `<option value="${i.id}">${i.descripcion}</option>`
    ).join("");

    select.innerHTML = options;

    // Si quieres, forzar que se muestre el placeholder
    select.selectedIndex = 0;
}
// function cargarOptions(select, lista) {
//     select.innerHTML = lista.map(i =>
//         `<option value="${i.id}">${i.descripcion}</option>`
//     ).join("");
// }

/* SubGrupo dependiente */
// grupoSelect.addEventListener("change", actualizarSubGrupo);

// function actualizarSubGrupo() {
//     if (!dataGlobal.SubGrupo) return;

//     const grupoId = parseInt(grupoSelect.value);
//     const filtrados = dataGlobal.SubGrupo.filter(s => s.grupoId === grupoId);
//     cargarOptions(subGrupoSelect, filtrados);
// }

/* ================== RENDER TABLA ================== */
function renderTabla(filtro = "") {
    const texto = filtro.toLowerCase().trim();

    const lista = productos.filter(p => {
        const contenido = `
            ${p.codigo}
            ${p.descripcion}
            ${p.precio}
            ${getGrupo(p.grupoId)}
            ${getSubGrupo(p.subGrupoId)}
            ${getEstado(p.estado)}
        `.toLowerCase();

        return contenido.includes(texto);
    });

    tbody.innerHTML = lista.map(p => `
        <tr data-id="${p.id}">
            <td><div class="texto-limitado" title="${p.codigo}">${p.codigo}</div></td>
            <td class="col-nombre"><div class="texto-limitado" title="${p.descripcion}">${p.descripcion}</div></td>
            <td>${p.precio} ${p.moneda}</td>
            <td><div class="texto-limitado" title="${getGrupo(p.grupoId)}">${getGrupo(p.grupoId)}</div></td>
            <td><div class="texto-limitado" title="${getSubGrupo(p.subGrupoId)}">${getSubGrupo(p.subGrupoId)}</div></td>
            <td>${getEstado(p.estado)}</td>
        </tr>
    `).join("");

    counter.innerText = lista.length;

    document.querySelectorAll("#tbody tr").forEach(row => {
        row.addEventListener("click", () => {
            document.querySelectorAll("#tbody tr").forEach(r => r.classList.remove("selected"));
            row.classList.add("selected");

            const id = parseInt(row.dataset.id);
            currentIndex = productos.findIndex(p => p.id === id);
            mostrarProducto(currentIndex);
        });
    });

    actualizarFilaSeleccionada();
}

/* ================== SELECCIÓN VISUAL ================== */
function actualizarFilaSeleccionada() {
    document.querySelectorAll("#tbody tr").forEach(r => r.classList.remove("selected"));
    if (currentIndex === null) return;

    const producto = productos[currentIndex];
    const fila = document.querySelector(`#tbody tr[data-id="${producto.id}"]`);
    if (fila) {
        fila.classList.add("selected");
        fila.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
}

/* ================== HELPERS ================== */
function getMarca(id) { return dataGlobal.Marca?.find(g => g.id === id)?.descripcion || ""; }
function getGrupo(id) { return dataGlobal.Grupo?.find(g => g.id === id)?.descripcion || ""; }
function getSubGrupo(id) { return dataGlobal.SubGrupo?.find(s => s.id === id)?.descripcion || ""; }
function getEstado(id) { return dataGlobal.Estado?.find(e => e.id === id)?.descripcion || ""; }

/* ================== MOSTRAR ================== */
/* ================== MOSTRAR ================== */
function mostrarProducto(index) {
    if (index === null || !productos[index]) return;
    const p = productos[index];

    codigo.value = p.codigo || "";
    descripcion.value = p.descripcion || "";
    precio.value = p.precio || 0;
    moneda.value = p.moneda || "Bs";
    marcaSelect.value = p.marca || marcaSelect.value;

    // Grupo → SubGrupo dependiente
    if (p.grupoId) grupoSelect.value = p.grupoId; else grupoSelect.selectedIndex = 0;
    // actualizarSubGrupo(); // recarga subgrupo según grupo
    if (p.subGrupoId) subGrupoSelect.value = p.subGrupoId; else subGrupoSelect.selectedIndex = 0;

    origenSelect.value = p.origenId || origenSelect.selectedIndex;
    industriaSelect.value = p.industriaId || industriaSelect.selectedIndex;
    medidaSelect.value = p.medidaId || medidaSelect.selectedIndex;
    estadoSelect.value = p.estado || estadoSelect.selectedIndex;

    preview.src = p.imagen || "";

    actualizarFilaSeleccionada();
}
/* ================== LIMPIAR ================== */
function limpiar() {
    codigo.value = "";
    descripcion.value = "";
    precio.value = "";
    moneda.value = "Bs";

    marcaSelect.selectedIndex = 0;
    grupoSelect.selectedIndex = 0;
    subGrupoSelect.selectedIndex = 0;
    // actualizarSubGrupo();
    origenSelect.selectedIndex = 0;
    industriaSelect.selectedIndex = 0;
    medidaSelect.selectedIndex = 0;
    estadoSelect.selectedIndex = 0;

    preview.src = "";

    currentIndex = null;
    document.querySelectorAll("#tbody tr").forEach(r => r.classList.remove("selected"));
}

/* ================== BUSCADOR ================== */
search.addEventListener("input", e => renderTabla(e.target.value));

/* ================== NAVEGACIÓN ================== */
btnFirst.onclick = () => { if (productos.length) { currentIndex = 0; mostrarProducto(currentIndex); } };
btnLast.onclick = () => { if (productos.length) { currentIndex = productos.length - 1; mostrarProducto(currentIndex); } };
btnNext.onclick = () => { if (currentIndex !== null && currentIndex < productos.length - 1) { currentIndex++; mostrarProducto(currentIndex); } };
btnPrev.onclick = () => { if (currentIndex !== null && currentIndex > 0) { currentIndex--; mostrarProducto(currentIndex); } };

/* Avanzar 2 filas ◀◀ / ▶▶ */
document.querySelector(".nav-btn:nth-of-type(2)").addEventListener("click", () => {
    if (currentIndex !== null) { currentIndex = Math.max(0, currentIndex - 2); mostrarProducto(currentIndex); }
});
document.querySelector(".nav-btn:nth-of-type(5)").addEventListener("click", () => {
    if (currentIndex !== null) { currentIndex = Math.min(productos.length - 1, currentIndex + 2); mostrarProducto(currentIndex); }
});

/* ================== NUEVO / CANCELAR ================== */
btnNew.onclick = limpiar;
btnCancel.onclick = limpiar;

/* ================== GUARDAR ================== */
function actualizarProducto() {
    if (currentIndex === null) return;
    const p = productos[currentIndex];
    p.codigo = codigo.value; p.descripcion = descripcion.value;
    p.precio = parseFloat(precio.value) || 0; p.moneda = moneda.value;
    p.marca = marcaSelect.value;
    p.grupoId = parseInt(grupoSelect.value);
    p.subGrupoId = parseInt(subGrupoSelect.value);
    p.origenId = parseInt(origenSelect.value);
    p.industriaId = parseInt(industriaSelect.value);
    p.medidaId = parseInt(medidaSelect.value);
    p.estado = parseInt(estadoSelect.value);
    p.imagen = preview.src || "";
    localStorage.setItem("productos", JSON.stringify(productos));
    renderTabla(search.value);
}

btnSave.onclick = () => {
    if (!codigo.value.trim() || !descripcion.value.trim()) { alert("Código y descripción son obligatorios"); return; }

    if (currentIndex !== null) {
        actualizarProducto();
    } else {
        const nuevo = {
            id: productos.length + 1,
            codigo: codigo.value,
            marca: marcaSelect.value,
            descripcion: descripcion.value,
            precio: parseFloat(precio.value) || 0,
            moneda: moneda.value,
            grupoId: parseInt(grupoSelect.value),
            subGrupoId: parseInt(subGrupoSelect.value),
            origenId: parseInt(origenSelect.value),
            industriaId: parseInt(industriaSelect.value),
            medidaId: parseInt(medidaSelect.value),
            estado: parseInt(estadoSelect.value),
            imagen: preview.src || ""
        };
        productos.push(nuevo);
        currentIndex = productos.length - 1;
        localStorage.setItem("productos", JSON.stringify(productos));
        renderTabla(search.value);
        mostrarProducto(currentIndex);
    }
};

/* ================== ELIMINAR ================== */
btnDelete.onclick = () => {
    if (currentIndex === null) { alert("Seleccione un producto"); return; }
    if (confirm("¿Seguro que desea eliminar este producto?")) {
        productos.splice(currentIndex, 1);
        if (currentIndex >= productos.length) currentIndex = productos.length - 1;
        renderTabla(search.value);
        if (productos.length) mostrarProducto(currentIndex); else limpiar();
        localStorage.setItem("productos", JSON.stringify(productos));
    }
};

/* ================== TECLAS ================== */
document.addEventListener("keydown", e => {
    if (e.key === "Escape") { search.value = ""; renderTabla(); limpiar(); }
    if (e.key === "ArrowDown") btnNext.click();
    if (e.key === "ArrowUp") btnPrev.click();
});

/* ================== TOOLBAR ================== */
const toolbarBtns = document.querySelectorAll(".toolbar-btn");
toolbarBtns.forEach(btn => {
    const text = btn.innerText;
    if (text.includes("📄")) btn.addEventListener("click", () => limpiar());
    if (text.includes("🔄")) btn.addEventListener("click", () => alert("Se actualizó todo"));
    if (text.includes("📥")) btn.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "file"; input.accept = ".xlsx,.xls";
        input.onchange = e => { if (e.target.files[0]) alert(`Archivo seleccionado: ${e.target.files[0].name}`); };
        input.click();
    });
    if (text.includes("📤")) btn.addEventListener("click", () => {
        let csv = "Código,Descripción,Precio,Grupo,SubGrupo,Estado\n";
        productos.forEach(p => {
            csv += `"${p.codigo}","${p.descripcion}",${p.precio},"${getGrupo(p.grupoId)}","${getSubGrupo(p.subGrupoId)}","${getEstado(p.estado)}"\n`;
        });
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "productos.csv"; a.click();
        URL.revokeObjectURL(url);
    });
    if (text.includes("⚙️")) btn.addEventListener("click", () => alert("Aquí se abriría un modal de parámetros"));
});

/* ================== TABS ================== */
function switchTab(e, tabName) {
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach(t => t.classList.remove("active"));
    e.currentTarget.classList.add("active");

    const contents = document.querySelectorAll(".tab-content");
    contents.forEach(c => c.classList.add("hidden"));

    const current = document.getElementById(`tab-${tabName}`);
    if (current) current.classList.remove("hidden");

    if (tabName !== "registro") alert("Estamos trabajando en " + tabName);
}

/* ================== COLUMNAS RESIZABLES ================== */
function makeColumnsResizable(table) {
    const ths = table.querySelectorAll("th");
    ths.forEach(th => {
        const resizer = document.createElement("div");
        resizer.classList.add("resizer"); th.appendChild(resizer);

        let startX, startWidth;
        resizer.addEventListener("mousedown", function (e) {
            startX = e.pageX; startWidth = th.offsetWidth;
            document.addEventListener("mousemove", resizeColumn);
            document.addEventListener("mouseup", stopResize);
        });

        function resizeColumn(e) { th.style.width = (startWidth + (e.pageX - startX)) + "px"; }
        function stopResize() { document.removeEventListener("mousemove", resizeColumn); document.removeEventListener("mouseup", stopResize); }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const table = document.querySelector(".tabla-fija");
    makeColumnsResizable(table);
});

openBtn.addEventListener("click", async () => {
    modal.style.display = "flex";
    await loadJSON(); // carga los parámetros
});

closeBtn.addEventListener("click", () => modal.style.display = "none");
cancelBtn.addEventListener("click", () => modal.style.display = "none");

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "flex") {
        modal.style.display = "none";
    }
});