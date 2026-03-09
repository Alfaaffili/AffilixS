document.addEventListener("DOMContentLoaded", function () {

loadProducts();
initArrows();
initModals();

});



function loadProducts(){

fetch("Data/products.json")

.then(response => response.json())

.then(products => {

const row = document.getElementById("row1");

if(!row) return;

products.forEach(product => {

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



function initArrows(){

const arrows = document.querySelectorAll(".row-arrow");

if(!arrows.length) return;

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