export function renderWarehouses(list, selectedId, onSelect) {
    list.innerHTML = "";

    list.forEach;
}

export function renderTable(body, data) {
    body.innerHTML = "";

    if (data.length === 0) {
        body.innerHTML = `<tr><td colspan="8">Sin resultados</td></tr>`;
        return;
    }

    body.innerHTML = data.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.grupo}</td>
            <td>${p.disponible}</td>
            <td>${p.vendidos}</td>
            <td>${p.comprado}</td>
            <td>${p.vencimiento}</td>
            <td>$${p.valor}</td>
        </tr>
    `).join("");
}
