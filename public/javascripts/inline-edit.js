/**
 * @file public/javascripts/inline-edit.js
 * @description Bascule simple entre texte et input pour l'édition.
 */

function toggleEdit(id) {
    const container = document.getElementById('cell-' + id);
    const currentValue = document.getElementById('text-' + id).innerText;
    
    // Remplace le contenu par un input simple
    container.innerHTML = `
        <input type="text" id="input-${id}" value="${currentValue}">
        <button onclick="saveState('${id}')" class="btn btn-ok">OK</button>
        <button onclick="location.reload()" class="btn btn-cancel">Annuler</button>
    `;
}

async function saveState(id) {
    const newState = document.getElementById('input-' + id).value;
    
    const response = await fetch('/catways/updateState/' + id, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'catwayState=' + encodeURIComponent(newState)
    });
    
    if (response.ok) {
        // Remet le texte à jour sans recharger
        document.getElementById('cell-' + id).innerHTML = `
            <span id="text-${id}">${newState}</span>
            <a onclick="toggleEdit('${id}')" class="action-link">(Modifier)</a>
        `;
    }
}