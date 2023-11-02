console.log("hello world");
const CompteExpediteur= document.getElementById('compteExpediteur') as HTMLInputElement;
const fullNameExpediteur=document.getElementById('fullNameExpediteur') as HTMLInputElement;
const montant =document.getElementById('Montant') as HTMLInputElement;
const selectfournisseur=document.getElementById('selectfournisseur') as HTMLSelectElement;
const selectTransaction= document.getElementById('selectTransaction') as HTMLSelectElement;
const compteDestinataire = document.getElementById('compteDestinataire') as HTMLInputElement;
const fullNameDestinataire= document.getElementById('fullNameDestinataire')as HTMLInputElement;
const btnValide = document.querySelector('#btn') as HTMLButtonElement;
const hrLabels= document.querySelectorAll('.hr-label') ; 
const Modal = document.querySelector('.Modal') as HTMLElement;
const infos = document.querySelector('.fa-circle-info') as HTMLElement;
const tbody= document.querySelector('.tbody') as HTMLElement ;


enum fournisseur{
  OM="OM",
  Wv="WV",
  WR="WR",
  CB="CB"
}
enum couleur{
  Orange = "#ff6e00",
  Blue = "#185f89",
  Green = "#7FFF00",
  Violet = "#00008B",
}
enum transaction{
  depot="Depot",
  retrait="Retrait",
}

const UrlTransfert='http://127.0.0.1:8000/api/client/';
const URLexped='http://127.0.0.1:8000/api/client/';
const UrlDetail='http://127.0.0.1:8000/api/transaction/client/';
CompteExpediteur.addEventListener('input',()=>{
    let expediteur=CompteExpediteur.value;
    if(expediteur){
      fetchData(URLexped+''+expediteur,fullNameExpediteur)
    }else{
      clearData(fullNameExpediteur);
    }
})
infos.addEventListener('click',()=>{
  let expediteur=CompteExpediteur.value;
  let ELement:string=''
  fetch(UrlDetail+''+expediteur)
  .then(response=>response.json())
  .then(data=>{
    // console.log(data); 
    data.forEach(function (el:any){
      let html=`
      <tr>
      <td>${el.montant}</td>
      <td>${el.type_transfert}</td>
      <td>${el.fournisseur}</td>
      <td>${el.numero_destinataire}</td>
    </tr>`;
    tbody.innerHTML+=html;
    })  
})
})


compteDestinataire.addEventListener('input',()=>{
let destinataire=compteDestinataire.value;
if(destinataire){
  fetchData(URLexped+''+destinataire,fullNameDestinataire);
}else{
  clearData(fullNameDestinataire);
}
})
function fetchData(url:string,nomcomplet:any){
  fetch(url)
  .then(Response=>Response.json())
  .then(data=>{
    console.log(data);
    
   nomcomplet.value=data.prenom+" "+data.nom
   
  })
}
function clearData(nomcomplet:any):void{
  
  nomcomplet.value='';
}

function afficheEnum(fourn:any,select:HTMLElement,message:string,fonction?:any){
  select.innerHTML=""
  let option=document.createElement('option');
  option.innerHTML=message;
  select.appendChild(option);
  let index=0;
  for (let value of Object.values(fourn)) {
    let option1=document.createElement('option');
    select.appendChild(option1);
    option1.innerHTML+=value;
    // option1.value+=value;
    option1.style.color = fonction(index);
    index++;
   
}
}


selectfournisseur.addEventListener("change", function() {
  const choi =selectfournisseur.options[selectfournisseur.selectedIndex];
  const text =choi.textContent;
    hrLabels.forEach(el=>{
      if(el instanceof HTMLElement)
      el.style.color=choi.style.color;

    })
  choi.classList.value="orange";
});

function afficheEnumTransaction(fourn:any,select:HTMLElement,message:string){
  select.innerHTML=""
  let option=document.createElement('option');
  option.innerHTML=message;
  option.value="disabled selected"
  select.appendChild(option);
  let index=0;
  for (let value of Object.values(fourn)) {
    let option1=document.createElement('option');
    option1.innerHTML+=value
    select.appendChild(option1);
  }
}
function couleurFromEnum(index: number): string {
  const colorValues = Object.values(couleur);
  const numColors = colorValues.length;
  const colorIndex = index % numColors;
  return colorValues[colorIndex];
}

afficheEnum(fournisseur,selectfournisseur,"Selectionner un fournisseur",couleurFromEnum);
// afficheEnumTransaction(transaction,selectTransaction,"Selectionner une transaction");

selectfournisseur.addEventListener('change',function(){
  let fourniseur=selectfournisseur.options[selectfournisseur.selectedIndex].value;
  selectTransaction.value='';
  if(fourniseur=="OM" ||fourniseur=="WV"){
    afficheEnumTransaction(transaction,selectTransaction,"Selectionner une transaction");
    
  }else if(fourniseur=="WR"){
    enum wari{retrait='retrait'};
    afficheEnumTransaction(wari,selectTransaction,"Selectionner une transaction");
  }
})
btnValide.addEventListener('click',()=>{
  let tab=[];
  let transaction=selectTransaction.options[selectTransaction.selectedIndex].textContent;
  let fourniss=selectfournisseur.options[selectfournisseur.selectedIndex].textContent;
  let compteExp=CompteExpediteur.value;
  let compteDest=compteDestinataire.value;
  let mont=montant.value;
  let objet={
    transaction,
    fourniss,
    compteExp,
    compteDest,
    mont,
  }
  tab.push(objet);
  console.log(tab);
  fetch(UrlTransfert,{
    method:"POST",
    body:JSON.stringify(objet),
    headers:{"Content-Type":"application/json"}
  })
  .then(response=>response.json)
  .then(data=>{
    console.log(data);
    
  })
//  let transaction=selectTransaction.options[selectTransaction.selectedIndex].value;
//   if(fourniseur=="OM" ||fourniseur=="WV"){
//     if(transaction=="depot"){

//     }
    
//   }else if(fourniseur){

//   }
  selectTransaction.innerHTML=""
  selectfournisseur.innerHTML=""
  CompteExpediteur.value=""
  compteDestinataire.value=""
  fullNameExpediteur.value=""
  fullNameDestinataire.value=""
  montant.value=""
  
 
  
   
})
selectTransaction.addEventListener('change',function($event){
let choice=selectTransaction.options[selectTransaction.selectedIndex].textContent;
if(choice=="Retrait"){
  Modal.style.display="none"
}
else{
  Modal.style.display="block"
}

})
// selectfournisseur.addEventListener('change',()=>{

  
//   let choix=selectfournisseur.selectedIndex;
//   let op=selectfournisseur.options[choix].value
//   if(op=="Wave"){
//     selectfournisseur.style.color=couleur.Orange
//   }
// })