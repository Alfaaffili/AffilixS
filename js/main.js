/* ===================================================== */
/* ======================= START ======================= */
/* ===================================================== */

document.addEventListener("DOMContentLoaded", startApp);

function startApp(){
loadProducts();
}



/* ===================================================== */
/* ==================== LOAD PRODUCTS ================== */
/* ===================================================== */

function loadProducts(){

fetch("Data/products.json")

.then(response => response.json())

.then(data => {

const products = data.products || data;

const row = document.getElementById("row1");

if(!row) return;

products.slice(0,20).forEach(product => {

const card = document.createElement("div");
card.className = "product-card";

card.innerHTML = `
<img src="${product.image}" alt="${product.name}">
<h4>${product.name}</h4>
<p>${product.price} ${product.currency}</p>
`;

card.dataset.product = JSON.stringify(product);

row.appendChild(card);

});

})

.catch(error => console.log("Product loading error:", error));

}



/* ===================================================== */
/* ==================== GLOBAL CLICK =================== */
/* ===================================================== */

document.addEventListener("click", function(e){

/* ================= ARROW CONTROLS ================= */

if(e.target.classList.contains("row-arrow")){

const rowId = e.target.dataset.row;
const row = document.getElementById(rowId);

if(!row) return;

const direction = e.target.classList.contains("right") ? 1 : -1;

row.scrollBy({
left: direction * 400,
behavior: "smooth"
});

}



/* ================= PRODUCT MODAL ================= */

const card = e.target.closest(".product-card");

if(card){

const product = JSON.parse(card.dataset.product);

openModal(product);

}



/* ================= CLOSE MODAL ================= */

if(e.target.classList.contains("close-modal")){
closeModal();
}

if(e.target.id === "productModal"){
closeModal();
}

});



/* ===================================================== */
/* ===================== OPEN MODAL ==================== */
/* ===================================================== */

function openModal(product){

const modal = document.getElementById("productModal");
const img = document.getElementById("modalImage");
const title = document.getElementById("modalTitle");
const price = document.getElementById("modalPrice");

if(!modal || !img || !title || !price) return;

img.src = product.image;
title.textContent = product.name;
price.textContent = product.price + " " + product.currency;

modal.style.display = "flex";

}



/* ===================================================== */
/* ==================== CLOSE MODAL ==================== */
/* ===================================================== */

function closeModal(){

const modal = document.getElementById("productModal");

if(modal){
modal.style.display = "none";
}

}