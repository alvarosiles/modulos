const modal = document.getElementById("modal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

const tabsContainer = document.querySelector(".tabs");
const tableBody = document.querySelector(".table-body");
const recordCount = document.querySelector(".record-count");

let data = {};
let currentTab = "";
let hasChanges = false;

const STORAGE_KEY = "parametrosData";

/* =============================
   ABRIR / CERRAR MODAL
============================= */

openBtn.addEventListener("click", async () => {
    modal.style.display = "flex";
    await loadJSON(); // 🔥 siempre carga desde archivo
});

closeBtn.addEventListener("click", () => modal.style.display = "none");
cancelBtn.addEventListener("click", () => modal.style.display = "none");

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "flex") {
        modal.style.display = "none";
    }
});

/* =============================
   CARGAR SIEMPRE DESDE JSON
============================= */

// async function loadJSON() {
//     const response = await fetch("parametros.json");
//     data = await response.json();
//     hasChanges = false;
//     createTabs();
// }

async function loadJSON() {
    // 1️⃣ Verificar si hay datos en storage
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
        data = JSON.parse(stored);
    } else {
        // 2️⃣ Si no hay storage, cargar desde archivo
        const response = await fetch("parametros.json");
        data = await response.json();
    }

    hasChanges = false;
    createTabs();
}
/* =============================
   GUARDAR SOLO CON BOTON ✔
============================= */

// saveBtn.addEventListener("click", () => {

//     if (!hasChanges) {
//         alert("No hay cambios para guardar.");
//         return;
//     }

//     localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
//     hasChanges = false;
//     alert("Cambios guardados correctamente ✔");
// });

saveBtn.addEventListener("click", () => {

    // Aplicar cualquier edición activa
    const activeInput = document.querySelector(".edit-input");
    if (activeInput) {
        const row = activeInput.closest(".table-row");
        const id = parseInt(row.dataset.id);
        const item = data[currentTab].find(i => i.id === id);

        item.descripcion = activeInput.value; // guardar en memoria
        hasChanges = true;
    }

    if (!hasChanges) {
        alert("No hay cambios para guardar.");
        return;
    }

    // Guardar en localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    hasChanges = false;
    alert("Cambios guardados correctamente ✔");

    // Refrescar tabla para mostrar cambios
    renderTable();
});

/* =============================
   CREAR TABS
============================= */

function createTabs() {

    tabsContainer.innerHTML = "";

    Object.keys(data).forEach((key, index) => {

        const tab = document.createElement("div");
        tab.classList.add("tab");
        tab.textContent = key;

        if (index === 0) {
            tab.classList.add("active");
            currentTab = key;
            renderTable();
        }

        tab.addEventListener("click", () => {
            document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            currentTab = key;
            renderTable();
        });

        tabsContainer.appendChild(tab);
    });
}

/* =============================
   RENDER TABLA
============================= */

function renderTable() {

    const items = data[currentTab];

    tableBody.innerHTML = items.map(item => {

        let extra = "";

        if (currentTab === "SubGrupo") {
            const grupo = data.Grupo.find(g => g.id === item.grupoId);
            extra = grupo ? grupo.descripcion : "";
        } else if (item.foto) {
            extra = item.foto;
        }

        return `
            <div class="table-row" data-id="${item.id}">
                <div class="cell" style="flex:0.5;">${item.id}</div>
                <div class="cell descripcion">${item.descripcion}</div>
                <div class="cell" style="flex:0.5;">${extra}</div>
            </div>
        `;
    }).join("");

    recordCount.value = items.length;

    activateRowEvents();
}

/* =============================
   SELECCION Y EDICION
============================= */

function activateRowEvents() {

    const rows = document.querySelectorAll(".table-row");

    rows.forEach(row => {

        row.addEventListener("click", () => {
            rows.forEach(r => r.classList.remove("selected"));
            row.classList.add("selected");
        });

        row.addEventListener("dblclick", () => {

            const id = parseInt(row.dataset.id);
            const item = data[currentTab].find(i => i.id === id);

            const descCell = row.querySelector(".descripcion");
            const oldValue = item.descripcion;

            descCell.innerHTML = `<input type="text" value="${oldValue}" class="edit-input">`;
            const input = descCell.querySelector("input");
            input.focus();

            input.addEventListener("keydown", (e) => {

                if (e.key === "Enter") {
                    item.descripcion = input.value;
                    hasChanges = true;   // 🔥 marcar como modificado
                    renderTable();
                }

                if (e.key === "Escape") {
                    renderTable();
                }
            });
        });
    });
}