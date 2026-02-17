let zIndex = 1;
let ventanaActiva = null;
const ventanasAbiertas = {};
const cache = {};

/* efecto cascada */
let cascadeOffset = 0;
const cascadeStep = 30;
const cascadeLimit = 150;

/* ===== ABRIR MODULO ===== */
function abrirModulo(boton, titulo, archivo) {

    document.querySelectorAll(".submenu button")
        .forEach(b => b.classList.remove("activo"));
    boton.classList.add("activo");

    if (ventanasAbiertas[archivo]) {
        activarVentana(ventanasAbiertas[archivo]);
        return;
    }

    const workspace = document.getElementById("workspace");

    const ventana = document.createElement("div");
    ventana.className = "ventana";
    ventana.style.zIndex = ++zIndex;
    ventana.dataset.archivo = archivo;
    ventana.dataset.maximizada = "false";

    /* CENTRADO + CASCADA */
    const centerX = (workspace.clientWidth / 2) - (700 / 2);
    const centerY = (workspace.clientHeight / 2) - (450 / 2);

    // Si no hay ventanas abiertas → reiniciar cascada
    if (Object.keys(ventanasAbiertas).length === 0) {
        cascadeOffset = 0;
    }

    ventana.style.left = (centerX + cascadeOffset) + "px";
    ventana.style.top = (centerY + cascadeOffset) + "px";
    ventana.style.width = "700px";
    ventana.style.height = "450px";

    cascadeOffset += cascadeStep;
    if (cascadeOffset > cascadeLimit) cascadeOffset = 0;

    ventana.innerHTML = `
        <div class="ventana-header">
            <div>${titulo}</div>
            <div class="botones">
                <span class="minimizar"></span>
                <span class="maximizar"></span>
                <span class="cerrar"></span>
            </div>
        </div>
        <div class="ventana-body">Cargando...</div>
    `;

    workspace.appendChild(ventana);
    ventanasAbiertas[archivo] = ventana;

    cargarModulo(archivo, ventana.querySelector(".ventana-body"));
    activarVentana(ventana);
    hacerDrag(ventana);
    configurarBotones(ventana, archivo);
    agregarTask(ventana, titulo, archivo);
    actualizarLogo();

}

/* ===== CARGA CACHE ===== */
function cargarModulo(archivo, contenedor) {

    if (cache[archivo]) {
        contenedor.innerHTML = cache[archivo];
        return;
    }

    fetch(archivo)
        .then(r => r.text())
        .then(html => {
            cache[archivo] = html;
            contenedor.innerHTML = html;
        });
}

/* ===== ACTIVAR ===== */
function activarVentana(v) {

    document.querySelectorAll(".ventana")
        .forEach(el => el.classList.remove("activa"));

    document.querySelectorAll(".task-item")
        .forEach(el => el.classList.remove("activa"));

    v.classList.add("activa");
    v.style.zIndex = ++zIndex;
    ventanaActiva = v;

    document.querySelector(`[data-archivo='${v.dataset.archivo}']`)
        ?.classList.add("activa");
}

/* ===== DRAG CON LIMITES + DOBLE CLICK ===== */
function hacerDrag(v) {

    const header = v.querySelector(".ventana-header");
    const workspace = document.getElementById("workspace");

    let offsetX, offsetY, drag = false;

    /* DOBLE CLICK → MAXIMIZAR */
    header.addEventListener("dblclick", () => {
        v.querySelector(".maximizar").click();
    });

    header.addEventListener("mousedown", e => {

        if (v.dataset.maximizada === "true") return;

        e.preventDefault();
        activarVentana(v);
        drag = true;
        document.body.classList.add("no-select");

        offsetX = e.clientX - v.offsetLeft;
        offsetY = e.clientY - v.offsetTop;
    });

    document.addEventListener("mousemove", e => {
        if (!drag) return;

        requestAnimationFrame(() => {

            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;

            x = Math.max(0, Math.min(x, workspace.clientWidth - v.offsetWidth));
            y = Math.max(0, Math.min(y, workspace.clientHeight - v.offsetHeight));

            v.style.left = x + "px";
            v.style.top = y + "px";
        });
    });

    document.addEventListener("mouseup", () => {
        drag = false;
        document.body.classList.remove("no-select");
    });
}

/* ===== BOTONES ===== */
function configurarBotones(v, archivo) {

    const workspace = document.getElementById("workspace");

    /* CERRAR */
    v.querySelector(".cerrar").onclick = () => {

        // eliminar botón de taskbar
        document.querySelector(`#taskbar [data-archivo='${archivo}']`)?.remove();

        delete ventanasAbiertas[archivo];

        v.remove();
        ventanaActiva = null;
        actualizarLogo();

    };

    // v.querySelector(".cerrar").onclick = () => {
    //     document.querySelector(`[data-archivo='${archivo}']`)?.remove();
    //     delete ventanasAbiertas[archivo];
    //     v.remove();
    //     ventanaActiva = null;
    // };

    /* MINIMIZAR */
    v.querySelector(".minimizar").onclick = () => {
        v.style.display = "none";
    };

    /* MAXIMIZAR / RESTAURAR */
    v.querySelector(".maximizar").onclick = () => {

        if (v.dataset.maximizada === "false") {

            v.dataset.prevLeft = v.style.left;
            v.dataset.prevTop = v.style.top;
            v.dataset.prevWidth = v.style.width;
            v.dataset.prevHeight = v.style.height;

            v.style.left = "0px";
            v.style.top = "0px";
            v.style.width = workspace.clientWidth + "px";
            v.style.height = workspace.clientHeight + "px";

            v.dataset.maximizada = "true";

        } else {

            v.style.left = v.dataset.prevLeft;
            v.style.top = v.dataset.prevTop;
            v.style.width = v.dataset.prevWidth || "700px";
            v.style.height = v.dataset.prevHeight || "450px";

            v.dataset.maximizada = "false";
        }

        activarVentana(v);
    };
}

/* ===== TASKBAR ===== */
function agregarTask(v, titulo, archivo) {

    const taskbar = document.getElementById("taskbar");

    // 🔥 Si ya existe el botón, no lo vuelvas a crear
    if (taskbar.querySelector(`[data-archivo='${archivo}']`)) {
        return;
    }

    const task = document.createElement("div");
    task.className = "task-item";
    task.innerText = titulo;
    task.dataset.archivo = archivo;

    task.onclick = () => {

        if (v.style.display === "none") {
            v.style.display = "flex";
        }

        activarVentana(v);
    };

    taskbar.appendChild(task);
}


/* ===== ESCAPE CIERRA VENTANA ACTIVA ===== */
document.addEventListener("keydown", e => {

    if (e.key === "Escape" && ventanaActiva) {

        const archivo = ventanaActiva.dataset.archivo;

        document.querySelector(`#taskbar [data-archivo='${archivo}']`)?.remove();

        delete ventanasAbiertas[archivo];

        ventanaActiva.remove();
        ventanaActiva = null;
        actualizarLogo();

    }
});

function actualizarLogo() {

    const logo = document.getElementById("logoCenter");
    if (!logo) return;

    if (Object.keys(ventanasAbiertas).length === 0) {
        // logo.style.opacity = "0.08";
        logo.style.opacity = "0.08";
    } else {
        logo.style.opacity = "0";
    }
}
