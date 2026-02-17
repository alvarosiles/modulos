
/* =============================
   JSON BASE DE DATOS
============================= */

const data = {

    Grupo: Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        descripcion: "Grupo " + (i + 1),
        foto: "📦"
    })),

    SubGrupo: [
        { id: 1, descripcion: "Gaseosas", grupoId: 1 },
        { id: 2, descripcion: "Jugos", grupoId: 1 },
        { id: 3, descripcion: "Hamburguesas", grupoId: 2 }
    ],

    Origen: [
        { id: 1, descripcion: "Nacional" },
        { id: 2, descripcion: "Importado" }
    ],

    Industria: [
        { id: 1, descripcion: "Coca Cola" },
        { id: 2, descripcion: "Nestlé" }
    ],

    Medida: [
        { id: 1, descripcion: "Unidad" },
        { id: 2, descripcion: "Caja" }
    ],

    Tipo: [
        { id: 1, descripcion: "Venta" },
        { id: 2, descripcion: "Consumo Interno" }
    ]
};

/* =============================
   LOGICA
============================= */

const tabs = document.querySelectorAll(".tab");
const tableBody = document.querySelector(".table-body");
const recordCount = document.querySelector(".record-count");

let currentTab = "Grupo";

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        currentTab = tab.textContent.trim();
        renderTable();
    });
});

function renderTable() {

    const items = data[currentTab];

    if (!items || items.length === 0) {
        tableBody.innerHTML = "<div style='padding:10px'>No data</div>";
        recordCount.value = 0;
        return;
    }

    tableBody.innerHTML = items.map(item => {

        let extra = "";

        if (currentTab === "SubGrupo") {
            const grupo = data.Grupo.find(g => g.id === item.grupoId);
            extra = grupo ? grupo.descripcion : "";
        } else if (item.foto) {
            extra = item.foto;
        }

        return `
            <div class="table-row">
                <div class="cell" style="flex:0.5;">${item.id}</div>
                <div class="cell">${item.descripcion}</div>
                <div class="cell" style="flex:0.5;">${extra}</div>
            </div>
        `;
    }).join("");

    recordCount.value = items.length;
}

renderTable();

 