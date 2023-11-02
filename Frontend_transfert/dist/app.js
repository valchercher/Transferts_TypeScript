"use strict";
console.log("hello world");
const CompteExpediteur = document.getElementById('compteExpediteur');
const fullNameExpediteur = document.getElementById('fullNameExpediteur');
const montant = document.getElementById('Montant');
const selectfournisseur = document.getElementById('selectfournisseur');
const selectTransaction = document.getElementById('selectTransaction');
const compteDestinataire = document.getElementById('compteDestinataire');
const fullNameDestinataire = document.getElementById('fullNameDestinataire');
const btnValide = document.querySelector('#btn');
const hrLabels = document.querySelectorAll('.hr-label');
const Modal = document.querySelector('.Modal');
const infos = document.querySelector('.fa-circle-info');
const tbody = document.querySelector('.tbody');
var fournisseur;
(function (fournisseur) {
    fournisseur["OM"] = "OM";
    fournisseur["Wv"] = "WV";
    fournisseur["WR"] = "WR";
    fournisseur["CB"] = "CB";
})(fournisseur || (fournisseur = {}));
var couleur;
(function (couleur) {
    couleur["Orange"] = "#ff6e00";
    couleur["Blue"] = "#185f89";
    couleur["Green"] = "#7FFF00";
    couleur["Violet"] = "#00008B";
})(couleur || (couleur = {}));
var transaction;
(function (transaction) {
    transaction["depot"] = "Depot";
    transaction["retrait"] = "Retrait";
})(transaction || (transaction = {}));
const UrlTransfert = 'http://127.0.0.1:8000/api/client/';
const URLexped = 'http://127.0.0.1:8000/api/client/';
const UrlDetail = 'http://127.0.0.1:8000/api/transaction/client/';
CompteExpediteur.addEventListener('input', () => {
    let expediteur = CompteExpediteur.value;
    if (expediteur) {
        fetchData(URLexped + '' + expediteur, fullNameExpediteur);
    }
    else {
        clearData(fullNameExpediteur);
    }
});
infos.addEventListener('click', () => {
    let expediteur = CompteExpediteur.value;
    let ELement = '';
    fetch(UrlDetail + '' + expediteur)
        .then(response => response.json())
        .then(data => {
        // console.log(data); 
        data.forEach(function (el) {
            let html = `
      <tr>
      <td>${el.montant}</td>
      <td>${el.type_transfert}</td>
      <td>${el.fournisseur}</td>
      <td>${el.numero_destinataire}</td>
    </tr>`;
            tbody.innerHTML += html;
        });
    });
});
compteDestinataire.addEventListener('input', () => {
    let destinataire = compteDestinataire.value;
    if (destinataire) {
        fetchData(URLexped + '' + destinataire, fullNameDestinataire);
    }
    else {
        clearData(fullNameDestinataire);
    }
});
function fetchData(url, nomcomplet) {
    fetch(url)
        .then(Response => Response.json())
        .then(data => {
        console.log(data);
        nomcomplet.value = data.prenom + " " + data.nom;
    });
}
function clearData(nomcomplet) {
    nomcomplet.value = '';
}
function afficheEnum(fourn, select, message, fonction) {
    select.innerHTML = "";
    let option = document.createElement('option');
    option.innerHTML = message;
    select.appendChild(option);
    let index = 0;
    for (let value of Object.values(fourn)) {
        let option1 = document.createElement('option');
        select.appendChild(option1);
        option1.innerHTML += value;
        // option1.value+=value;
        option1.style.color = fonction(index);
        index++;
    }
}
selectfournisseur.addEventListener("change", function () {
    const choi = selectfournisseur.options[selectfournisseur.selectedIndex];
    const text = choi.textContent;
    hrLabels.forEach(el => {
        if (el instanceof HTMLElement)
            el.style.color = choi.style.color;
    });
    choi.classList.value = "orange";
});
function afficheEnumTransaction(fourn, select, message) {
    select.innerHTML = "";
    let option = document.createElement('option');
    option.innerHTML = message;
    option.value = "disabled selected";
    select.appendChild(option);
    let index = 0;
    for (let value of Object.values(fourn)) {
        let option1 = document.createElement('option');
        option1.innerHTML += value;
        select.appendChild(option1);
    }
}
function couleurFromEnum(index) {
    const colorValues = Object.values(couleur);
    const numColors = colorValues.length;
    const colorIndex = index % numColors;
    return colorValues[colorIndex];
}
afficheEnum(fournisseur, selectfournisseur, "Selectionner un fournisseur", couleurFromEnum);
// afficheEnumTransaction(transaction,selectTransaction,"Selectionner une transaction");
selectfournisseur.addEventListener('change', function () {
    let fourniseur = selectfournisseur.options[selectfournisseur.selectedIndex].value;
    selectTransaction.value = '';
    if (fourniseur == "OM" || fourniseur == "WV") {
        afficheEnumTransaction(transaction, selectTransaction, "Selectionner une transaction");
    }
    else if (fourniseur == "WR") {
        let wari;
        (function (wari) {
            wari["retrait"] = "retrait";
        })(wari || (wari = {}));
        ;
        afficheEnumTransaction(wari, selectTransaction, "Selectionner une transaction");
    }
});
btnValide.addEventListener('click', () => {
    let tab = [];
    let transaction = selectTransaction.options[selectTransaction.selectedIndex].textContent;
    let fourniss = selectfournisseur.options[selectfournisseur.selectedIndex].textContent;
    let compteExp = CompteExpediteur.value;
    let compteDest = compteDestinataire.value;
    let mont = montant.value;
    let objet = {
        transaction,
        fourniss,
        compteExp,
        compteDest,
        mont,
    };
    tab.push(objet);
    console.log(tab);
    fetch(UrlTransfert, {
        method: "POST",
        body: JSON.stringify(objet),
        headers: { "Content-Type": "application/json" }
    })
        .then(response => response.json)
        .then(data => {
        console.log(data);
    });
    //  let transaction=selectTransaction.options[selectTransaction.selectedIndex].value;
    //   if(fourniseur=="OM" ||fourniseur=="WV"){
    //     if(transaction=="depot"){
    //     }
    //   }else if(fourniseur){
    //   }
    selectTransaction.innerHTML = "";
    selectfournisseur.innerHTML = "";
    CompteExpediteur.value = "";
    compteDestinataire.value = "";
    fullNameExpediteur.value = "";
    fullNameDestinataire.value = "";
    montant.value = "";
});
selectTransaction.addEventListener('change', function ($event) {
    let choice = selectTransaction.options[selectTransaction.selectedIndex].textContent;
    if (choice == "Retrait") {
        Modal.style.display = "none";
    }
    else {
        Modal.style.display = "block";
    }
});
// selectfournisseur.addEventListener('change',()=>{
//   let choix=selectfournisseur.selectedIndex;
//   let op=selectfournisseur.options[choix].value
//   if(op=="Wave"){
//     selectfournisseur.style.color=couleur.Orange
//   }
// })
