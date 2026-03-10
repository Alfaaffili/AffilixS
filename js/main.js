/* ===================================================== */
/* ======================= START ======================= */
/* ===================================================== */

document.addEventListener("DOMContentLoaded", startApp);

function startApp(){

loadProducts();

initArrows();

initModals();

}



/* ===================================================== */
/* =================== LOAD PRODUCTS =================== */
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

card.addEventListener("click", function(){
openModal(product);
});

row.appendChild(card);

});

})

.catch(error => console.log("Product loading error:", error));

}



/* ===================================================== */
/* ====================== ARROWS ======================= */
/* ===================================================== */

function initArrows(){

const arrows = document.querySelectorAll(".row-arrow");

if(arrows.length === 0) return;

arrows.forEach(arrow => {

arrow.addEventListener("click", function(){

const rowId = this.dataset.row;

const row = document.getElementById(rowId);

if(!row) return;

const direction = this.classList.contains("right") ? 1 : -1;

row.scrollBy({

left: direction * 400,

behavior: "smooth"

});

});

});

}



/* ===================================================== */
/* ======================= MODAL ======================= */
/* ===================================================== */

function initModals(){

const modal = document.getElementById("productModal");

const close = document.querySelector(".close-modal");

if(!modal || !close) return;

close.addEventListener("click", function(){
modal.style.display = "none";
});

window.addEventListener("click", function(e){

if(e.target === modal){
modal.style.display = "none";
}

});

}



/* ===================================================== */
/* ==================== OPEN MODAL ===================== */
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