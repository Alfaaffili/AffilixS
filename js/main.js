/* =====================================================
AFFILIXS CORE ENGINE
main.js
Production Stable Version
===================================================== */


/* =====================================================
SAFETY SYSTEM
Prevents crashes if elements are missing
===================================================== */

function safeQuery(selector){
return document.querySelector(selector);
}

function safeQueryAll(selector){
return document.querySelectorAll(selector);
}



/* =====================================================
GLOBAL ELEMENT REFERENCES
===================================================== */

const productSection = safeQuery(".products-section");
const previewPanel = safeQuery("#floatingPreview");
const previewImage = safeQuery("#previewImage");

const modal = safeQuery("#productModal");
const modalImage = safeQuery("#modalImage");
const modalTitle = safeQuery("#modalTitle");
const modalPrice = safeQuery("#modalPrice");
const closeModal = safeQuery(".close-modal");



/* =====================================================
CONFIGURATION
===================================================== */

const PRODUCTS_PER_ROW = 20;
const MAX_ROWS = 5;



/* =====================================================
LOAD PRODUCTS
===================================================== */

async function loadProducts(){

try{

const response = await fetch("Data/products.json?v=1");
const products = await response.json();

renderProducts(products);

}catch(error){

console.error("Product loading error:", error);

}

}



/* =====================================================
RENDER PRODUCTS
Dynamic Row Engine
===================================================== */

function renderProducts(products){

if(!productSection) return;

productSection.innerHTML = "<h2>Featured Products</h2>";

let rows = {};

products.forEach((product,index)=>{

const rowIndex = Math.floor(index/PRODUCTS_PER_ROW)+1;

if(rowIndex>MAX_ROWS) return;

if(!rows[rowIndex]){

rows[rowIndex] = createRow(rowIndex);

productSection.appendChild(rows[rowIndex].wrapper);

}

const card = createProductCard(product);

rows[rowIndex].row.appendChild(card);

});

}



/* =====================================================
CREATE ROW
===================================================== */

function createRow(rowNumber){

const wrapper = document.createElement("div");
wrapper.className = "product-row-wrapper";

const leftArrow = document.createElement("button");
leftArrow.className = "row-arrow left";
leftArrow.innerHTML = "❮";

const rightArrow = document.createElement("button");
rightArrow.className = "row-arrow right";
rightArrow.innerHTML = "❯";

const row = document.createElement("div");
row.className = "product-row";
row.id = "row"+rowNumber;



/* Arrow Scroll */

leftArrow.addEventListener("click",()=>{

row.scrollBy({left:-400,behavior:"smooth"});

});

rightArrow.addEventListener("click",()=>{

row.scrollBy({left:400,behavior:"smooth"});

});


wrapper.appendChild(leftArrow);
wrapper.appendChild(row);
wrapper.appendChild(rightArrow);

return {wrapper,row};

}



/* =====================================================
CREATE PRODUCT CARD
===================================================== */

function createProductCard(product){

const card = document.createElement("div");
card.className = "product-card";

const img = document.createElement("img");
img.src = product.image;
img.onerror = ()=>{img.src="images/placeholder.jpg"};

const title = document.createElement("h4");
title.textContent = product.shortName || "Product";

const price = document.createElement("p");
price.textContent = product.price+" "+product.currency;

card.appendChild(img);
card.appendChild(title);
card.appendChild(price);



/* =====================================================
TOOLTIP PREVIEW
===================================================== */

if(previewPanel){

card.addEventListener("mouseenter",()=>{

previewImage.src = product.image;

previewPanel.classList.add("active");

});

card.addEventListener("mouseleave",()=>{

previewPanel.classList.remove("active");

});

}



/* =====================================================
MODAL SYSTEM
===================================================== */

if(modal){

card.addEventListener("click",()=>{

modal.style.display = "flex";

modalImage.src = product.image;
modalTitle.textContent = product.name;
modalPrice.textContent = product.price+" "+product.currency;

});

}



return card;

}



/* =====================================================
MODAL CLOSE
===================================================== */

if(closeModal){

closeModal.addEventListener("click",()=>{

modal.style.display="none";

});

window.addEventListener("click",(e)=>{

if(e.target===modal){

modal.style.display="none";

}

});

}



/* =====================================================
INITIALIZE ENGINE
===================================================== */

document.addEventListener("DOMContentLoaded",()=>{

loadProducts();

});