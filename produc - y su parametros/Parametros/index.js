class MiModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // CSS + HTML encapsulado
        this.shadowRoot.innerHTML = `
            <style>
                /* Aquí va todo tu CSS del modal tal cual, adaptando selectores para Shadow DOM */
                * { margin:0; padding:0; box-sizing:border-box; }
                .modal { display:none; position:fixed; top:0; left:0; right:0; bottom:0;
                         background:rgba(0,0,0,0.3); justify-content:center; align-items:center; z-index:1000; }
                .window { background-color:#ece9d8; border:2px solid; border-color:#dfdfdf #808080 #808080 #dfdfdf; 
                          box-shadow:1px 1px 0 #ffffff inset, -1px -1px 0 #808080 inset; width:90%; max-width:950px; }
                .title-bar { background:linear-gradient(90deg,#000080,#1084d7); color:white; padding:2px 4px;
                             display:flex; justify-content:space-between; align-items:center; font-size:11px; font-weight:bold; }
                .window-buttons { display:flex; gap:2px; }
                .btn-window { width:16px; height:14px; background-color:#c0c0c0; border:1px solid;
                               border-color:#dfdfdf #808080 #808080 #dfdfdf; cursor:pointer; font-size:8px; }
                .content { padding:6px; }
                .tabs { display:flex; gap:2px; margin-bottom:4px; border-bottom:2px solid #c0c0c0; }
                .tab { background-color:#c0c0c0; border:1px solid; border-color:#dfdfdf #808080 #808080 #dfdfdf;
                       padding:4px 16px; cursor:pointer; font-size:11px; }
                .tab.active { background-color:#ece9d8; border-bottom:2px solid #ece9d8; }
                .table-header { display:flex; background-color:#c0c0c0; border:1px solid; border-color:#dfdfdf #808080 #808080 #dfdfdf; }
                .table-header-cell { flex:1; padding:4px 6px; font-size:11px; font-weight:bold; }
                .table-body { background-color:white; border:1px solid; border-color:#808080 #dfdfdf #dfdfdf #808080;
                               height:400px; overflow-y:auto; font-size:11px; }
                .table-row { display:flex; border-bottom:1px solid #eee; cursor:pointer; }
                .table-row:hover { background-color:#dbe8ff; }
                .table-row.selected { background-color:#a8c0ff; }
                .cell { flex:1; padding:4px; }
                .footer { background-color:#ece9d8; padding:4px; display:flex; gap:4px; align-items:center; }
                .record-count { width:100px; font-size:11px; }
                .mini-btn { font-size:12px; padding:2px 6px; cursor:pointer; background:#c0c0c0; border:1px solid #808080 #dfdfdf #dfdfdf #808080; }
            </style>

            <div class="modal">
                <div class="window">
                    <div class="title-bar">
                        <span>Parámetros</span>
                        <div class="window-buttons">
                            <button class="btn-window close">×</button>
                        </div>
                    </div>
                    <div class="content">
                        <div style="text-align:center;padding:8px;font-weight:bold;">PARÁMETROS</div>
                        <div class="tabs"></div>
                        <div class="table-header">
                            <div class="table-header-cell" style="flex:0.5;">ID</div>
                            <div class="table-header-cell">Descripción</div>
                            <div class="table-header-cell" style="flex:0.5;">Extra</div>
                        </div>
                        <div class="table-body"></div>
                        <div class="footer">
                            <input type="text" class="record-count" value="0">
                            <button class="mini-btn save">✔</button>
                            <button class="mini-btn cancel">✖</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Referencias dentro del shadow DOM
        this.modal = this.shadowRoot.querySelector('.modal');
        this.closeBtn = this.shadowRoot.querySelector('.close');
        this.cancelBtn = this.shadowRoot.querySelector('.cancel');
        this.saveBtn = this.shadowRoot.querySelector('.save');
        this.tabsContainer = this.shadowRoot.querySelector('.tabs');
        this.tableBody = this.shadowRoot.querySelector('.table-body');
        this.recordCount = this.shadowRoot.querySelector('.record-count');

        this.data = {};
        this.currentTab = "";
        this.hasChanges = false;
        this.STORAGE_KEY = 'parametrosData';

        this.attachEvents();
    }

    attachEvents() {
        this.closeBtn.addEventListener('click', () => this.close());
        this.cancelBtn.addEventListener('click', () => this.close());
        this.shadowRoot.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close();
        });
        // Aquí podrías agregar eventos para save, tabs, fila doble click, etc.
    }

    open() { this.modal.style.display = 'flex'; this.loadJSON(); }
    close() { this.modal.style.display = 'none'; }

    async loadJSON() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            this.data = JSON.parse(stored);
        } else {
            const response = await fetch("parametros.json");
            this.data = await response.json();
        }
        this.hasChanges = false;
        this.createTabs();
    }

    createTabs() {
        this.tabsContainer.innerHTML = '';
        Object.keys(this.data).forEach((key, index) => {
            const tab = document.createElement('div');
            tab.classList.add('tab');
            tab.textContent = key;
            if (index === 0) { tab.classList.add('active'); this.currentTab = key; this.renderTable(); }
            tab.addEventListener('click', () => {
                this.shadowRoot.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentTab = key;
                this.renderTable();
            });
            this.tabsContainer.appendChild(tab);
        });
    }

    renderTable() {
        const items = this.data[this.currentTab] || [];
        this.tableBody.innerHTML = items.map(item => {
            let extra = item.foto || '';
            return `
                <div class="table-row" data-id="${item.id}">
                    <div class="cell" style="flex:0.5;">${item.id}</div>
                    <div class="cell descripcion">${item.descripcion}</div>
                    <div class="cell" style="flex:0.5;">${extra}</div>
                </div>
            `;
        }).join('');
        this.recordCount.value = items.length;
        this.activateRowEvents();
    }

    activateRowEvents() {
        const rows = this.shadowRoot.querySelectorAll('.table-row');
        rows.forEach(row => {
            row.addEventListener('click', () => {
                rows.forEach(r => r.classList.remove('selected'));
                row.classList.add('selected');
            });
            row.addEventListener('dblclick', () => {
                const id = parseInt(row.dataset.id);
                const item = this.data[this.currentTab].find(i => i.id === id);
                const descCell = row.querySelector('.descripcion');
                const oldValue = item.descripcion;
                descCell.innerHTML = `<input type="text" value="${oldValue}" class="edit-input">`;
                const input = descCell.querySelector('input');
                input.focus();
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        item.descripcion = input.value;
                        this.hasChanges = true;
                        this.renderTable();
                    }
                    if (e.key === 'Escape') this.renderTable();
                });
            });
        });
    }
}

customElements.define('mi-modal', MiModal);