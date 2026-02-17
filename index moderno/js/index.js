
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

        /* CENTRADO + CASCADA */
        const centerX = (workspace.clientWidth / 2) - (700 / 2);
        const centerY = (workspace.clientHeight / 2) - (450 / 2);

        ventana.style.left = (centerX + cascadeOffset) + "px";
        ventana.style.top = (centerY + cascadeOffset) + "px";

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

    /* ===== DRAG CON LIMITES ===== */
    function hacerDrag(v) {

        const header = v.querySelector(".ventana-header");
        const workspace = document.getElementById("workspace");

        let offsetX, offsetY, drag = false;

        header.addEventListener("mousedown", e => {
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

        v.querySelector(".cerrar").onclick = () => {
            document.querySelector(`[data-archivo='${archivo}']`)?.remove();
            delete ventanasAbiertas[archivo];
            v.remove();
        };

        v.querySelector(".minimizar").onclick = () => {
            v.style.display = "none";
        };
    }



    /* ===== TASKBAR ===== */
    function agregarTask(v, titulo, archivo) {

        const task = document.createElement("div");
        task.className = "task-item";
        task.innerText = titulo;
        task.dataset.archivo = archivo;

        task.onclick = () => {
            if (v.style.display === "none") v.style.display = "flex";
            activarVentana(v);
        };

        document.getElementById("taskbar").appendChild(task);
    }

    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && ventanaActiva) {
            document.querySelector(`[data-archivo='${archivo}']`)?.remove();

            document.querySelector(`[data-task='${ventanaActiva.dataset.id}']`)?.remove();
            ventanaActiva.remove();
        }
    });