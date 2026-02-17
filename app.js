let data = {};
let currentTab = "Grupo";

async function cargarDatos() {
  const res = await fetch("data.json");
  data = await res.json();
  crearTabs();
  renderTabla();
}

function crearTabs() {
  const tabsContainer = document.getElementById("tabs");
  tabsContainer.innerHTML = "";

  Object.keys(data).forEach(tab => {
    const div = document.createElement("div");
    div.className = "tab";
    div.innerText = tab;

    if (tab === currentTab) {
      div.classList.add("active");
    }

    div.onclick = () => {
      currentTab = tab;
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      div.classList.add("active");
      renderTabla();
    };

    tabsContainer.appendChild(div);
  });
}

function renderTabla() {
  const tbody = document.getElementById("tablaBody");
  tbody.innerHTML = "";

  if (!data[currentTab].length) {
    tbody.innerHTML = `<tr><td colspan="3">No hay datos</td></tr>`;
    return;
  }

  data[currentTab].forEach((item, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.codigo}</td>
      <td>${item.descripcion}</td>
      <td>
        <button onclick="eliminar(${index})">Eliminar</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function agregar() {
  const codigo = document.getElementById("codigo").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();

  if (!codigo || !descripcion) {
    alert("Complete los campos");
    return;
  }

  data[currentTab].push({ codigo, descripcion });

  document.getElementById("codigo").value = "";
  document.getElementById("descripcion").value = "";

  renderTabla();
}

function eliminar(index) {
  data[currentTab].splice(index, 1);
  renderTabla();
}

cargarDatos();
