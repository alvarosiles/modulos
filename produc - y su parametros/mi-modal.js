// mi-modal.js
class MiModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.defaultTabs = ["Marca","Grupo","SubGrupo","Origen","Industria","Medida","Tipo"];

        this.shadowRoot.innerHTML = `
            <style>
                *{margin:0;padding:0;box-sizing:border-box;}
                .modal{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.3);justify-content:center;align-items:center;z-index:1000;}
                .window{background-color:#ece9d8;border:2px solid;border-color:#dfdfdf #808080 #808080 #dfdfdf;box-shadow:1px 1px 0 #fff inset,-1px -1px 0 #808080 inset;width:90%;max-width:950px;}
                .title-bar{background:linear-gradient(90deg,#000080,#1084d7);color:white;padding:2px 4px;display:flex;justify-content:space-between;align-items:center;font-size:11px;font-weight:bold;}
                .window-buttons{display:flex;gap:2px;}
                .btn-window{width:16px;height:14px;background-color:#c0c0c0;border:1px solid;border-color:#dfdfdf #808080 #808080 #dfdfdf;cursor:pointer;font-size:8px;}
                .content{padding:6px;}
                .tabs{display:flex;gap:2px;margin-bottom:4px;border-bottom:2px solid #c0c0c0;}
                .tab{background-color:#c0c0c0;border:1px solid;border-color:#dfdfdf #808080 #808080 #dfdfdf;padding:4px 16px;cursor:pointer;font-size:11px;}
                .tab.active{background-color:#ece9d8;border-bottom:2px solid #ece9d8;}
                .table-header{display:flex;background-color:#c0c0c0;border:1px solid;border-color:#dfdfdf #808080 #808080 #dfdfdf;}
                .table-header-cell{flex:1;padding:4px 6px;font-size:11px;font-weight:bold;}
                .table-body{background-color:white;border:1px solid;border-color:#808080 #dfdfdf #dfdfdf #808080;height:400px;overflow-y:auto;font-size:11px;}
                .table-row{display:flex;border-bottom:1px solid #eee;cursor:pointer;}
                .table-row:hover{background-color:#dbe8ff;}
                .table-row.selected{background-color:#a8c0ff;}
                .cell{flex:1;padding:4px;display:flex;align-items:center;gap:4px;}
                .footer{background-color:#ece9d8;padding:4px;display:flex;gap:4px;align-items:center;}
                .record-count{width:80px;font-size:11px;}
                .mini-btn{font-size:12px;padding:2px 6px;cursor:pointer;background:#c0c0c0;border:1px solid #808080 #dfdfdf #dfdfdf #808080;}
                .edit-input{width:100%;box-sizing:border-box;font-size:11px;}
                .export-btn{margin-left:auto;background:#1084d7;color:white;border:none;padding:2px 6px;font-size:11px;cursor:pointer;}
                .import-btn{margin-left:4px;background:#28a745;color:white;border:none;padding:2px 6px;font-size:11px;cursor:pointer;}
                .foto-thumb{max-width:40px;max-height:20px;border:1px solid #ccc;}
            </style>

            <div class="modal" tabindex="0">
                <div class="window">
                    <div class="title-bar">
                        <span>Parámetros</span>
                        <div class="window-buttons">
                            <button class="btn-window close">×</button>
                        </div>
                    </div>
                    <div class="content">
                        <div class="tabs"></div>
                        <div class="table-header">
                            <div class="table-header-cell" style="flex:0.5;">Código</div>
                            <div class="table-header-cell">Descripción</div>
                            <div class="table-header-cell" style="flex:0.5;">Foto</div>
                        </div>
                        <div class="table-body"></div>
                        <div class="footer">
                            <input type="text" class="record-count" value="0" readonly>
                            <button class="mini-btn save">✔</button>
                            <button class="mini-btn cancel">✖</button>
                            <button class="export-btn">Exportar JSON</button>
                            <button class="import-btn">Importar JSON</button>
                            <input type="file" accept=".json" style="display:none" class="file-input">
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Referencias
        this.modal = this.shadowRoot.querySelector('.modal');
        this.closeBtn = this.shadowRoot.querySelector('.close');
        this.cancelBtn = this.shadowRoot.querySelector('.cancel');
        this.saveBtn = this.shadowRoot.querySelector('.save');
        this.tabsContainer = this.shadowRoot.querySelector('.tabs');
        this.tableBody = this.shadowRoot.querySelector('.table-body');
        this.recordCount = this.shadowRoot.querySelector('.record-count');
        this.exportBtn = this.shadowRoot.querySelector('.export-btn');
        this.importBtn = this.shadowRoot.querySelector('.import-btn');
        this.fileInput = this.shadowRoot.querySelector('.file-input');

        this.data = {};
        this.currentTab = "";
        this.hasChanges = false;
        this.STORAGE_KEY = 'parametrosData';
        this.selectedRow = null;

        this.attachEvents();
    }

    attachEvents() {
        this.closeBtn.addEventListener('click',()=>this.close());
        this.cancelBtn.addEventListener('click',()=>this.close());
        this.modal.addEventListener('keydown',e=>{ 
            if(e.key==='Escape') this.close();
            if(this.selectedRow && (e.key==='Delete' || e.key==='Suprimir')) this.deleteRow();
        });
        this.modal.addEventListener('click',e=>{if(e.target===this.modal)this.close();});
        this.saveBtn.addEventListener('click',()=>this.saveChanges());
        this.exportBtn.addEventListener('click',()=>this.exportJSON());
        this.importBtn.addEventListener('click',()=>this.fileInput.click());
        this.fileInput.addEventListener('change',e=>this.importJSON(e));
    }

    open(){ this.modal.style.display='flex'; this.modal.focus(); this.loadJSON(); }
    close(){ this.modal.style.display='none'; this.selectedRow=null; }

    async loadJSON(){
        try{
            const response = await fetch("parametros.json");
            if(response.ok) this.data = await response.json();
            else this.data={};
        }catch{ this.data={}; }

        // Inicializar tabs si no existen
        this.defaultTabs.forEach(tab=>{ if(!this.data[tab]) this.data[tab]=[]; });

        this.createTabs();
    }

    createTabs(){
        this.tabsContainer.innerHTML='';
        this.defaultTabs.forEach((tab,index)=>{
            const div=document.createElement('div');
            div.classList.add('tab');
            div.textContent=tab;
            if(index===0){div.classList.add('active'); this.currentTab=tab;}
            div.addEventListener('click',()=>{
                this.shadowRoot.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
                div.classList.add('active');
                this.currentTab=tab;
                this.renderTable();
            });
            this.tabsContainer.appendChild(div);
        });
        this.renderTable();
    }

    renderTable(){
        const items=this.data[this.currentTab]||[];
        let rows = items.map(i=>this.createRow(i));
        // siempre agregar fila vacía editable al final
        const nextCode = items.length>0 ? Math.max(...items.map(i=>i.codigo))+1 : 1;
        rows.push(this.createEmptyRow(true, nextCode));
        this.tableBody.innerHTML = rows.join('');
        this.recordCount.value = items.length;
        this.activateRowEvents();
    }

    createRow(item){
        const imgHTML = item.foto ? `<img src="${item.foto}" class="foto-thumb">` : '';
        return `
            <div class="table-row" data-id="${item.codigo}">
                <div class="cell" style="flex:0.5;">${item.codigo}</div>
                <div class="cell descripcion"><input type="text" class="edit-input" value="${item.descripcion}"></div>
                <div class="cell" style="flex:0.5;">
                    <input type="text" class="edit-input foto-input" value="${item.foto || ''}" placeholder="URL">
                    ${imgHTML}
                </div>
            </div>
        `;
    }

    createEmptyRow(editable=false, code=1){
        return `
            <div class="table-row new-row" data-id="">
                <div class="cell" style="flex:0.5;">${code}</div>
                <div class="cell descripcion">
                    ${editable?'<input type="text" class="edit-input" placeholder="Descripción">':''}
                </div>
                <div class="cell" style="flex:0.5;">
                    ${editable?'<input type="text" class="edit-input foto-input" placeholder="URL">':''}
                </div>
            </div>
        `;
    }

    activateRowEvents(){
        const rows=this.shadowRoot.querySelectorAll('.table-row');
        rows.forEach(row=>{
            row.addEventListener('click',()=>{
                rows.forEach(r=>r.classList.remove('selected'));
                row.classList.add('selected');
                this.selectedRow=row;
            });
        });
    }

    deleteRow(){
        if(!this.selectedRow) return;
        if(!confirm('¿Seguro que quieres eliminar esta fila?')) return;
        const id=this.selectedRow.dataset.id;
        if(id){
            this.data[this.currentTab]=this.data[this.currentTab].filter(i=>i.codigo!=id);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
        }
        this.selectedRow=null;
        this.renderTable();
    }

    saveChanges(){
        const rows=this.shadowRoot.querySelectorAll('.table-row');
        rows.forEach(row=>{
            const descInput=row.querySelector('.descripcion input');
            const fotoInput=row.querySelector('.foto-input');
            let id=row.dataset.id;
            const codeCell = row.querySelector('.cell:first-child');
            const codeValue = parseInt(codeCell.textContent);

            if(descInput && (descInput.value.trim()!=='' || (fotoInput && fotoInput.value.trim()!==''))){
                if(!id){ // nueva fila
                    id=codeValue;
                    row.dataset.id=id;
                    this.data[this.currentTab].push({codigo:id, descripcion:descInput.value, foto:fotoInput.value});
                }else{
                    const item=this.data[this.currentTab].find(i=>i.codigo==id);
                    if(item){
                        item.descripcion=descInput.value;
                        item.foto=fotoInput.value;
                    }
                }
            }
        });
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
        alert('Cambios guardados ✔');
        this.renderTable();
    }

    exportJSON(){
        const dataStr="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(this.data,null,2));
        const dl=document.createElement('a');
        dl.setAttribute('href',dataStr);
        dl.setAttribute('download','parametros.json');
        dl.click();
    }

    importJSON(e){
        const file=e.target.files[0];
        if(!file) return;
        const reader=new FileReader();
        reader.onload=(evt)=>{
            try{
                const json=JSON.parse(evt.target.result);
                this.data=json;
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(json));
                this.createTabs();
                alert('JSON importado correctamente ✔');
            }catch(err){ alert('Error al leer JSON'); }
        };
        reader.readAsText(file);
    }
}

customElements.define('mi-modal',MiModal);