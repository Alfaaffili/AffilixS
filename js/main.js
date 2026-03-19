/* =====================================================
HELPERS
===================================================== */

function qs(s){ return document.querySelector(s); }
function qsa(s){ return document.querySelectorAll(s); }

/* =====================================================
ELEMENTS
===================================================== */

const productSection = qs(".products-section");

const previewPanel = qs("#floatingPreview");
const previewImage = qs("#previewImage");

const modal = qs("#productModal");
const modalImage = qs("#modalImage");
const modalTitle = qs("#modalTitle");
const modalPrice = qs("#modalPrice");
const buyButton = qs("#buyButton");

const closeModal = qs(".close-modal");

/* =====================================================
CONFIG
===================================================== */

const PRODUCTS_PER_ROW = 20;
const MAX_ROWS = 5;

/* =====================================================
LOAD PRODUCTS
===================================================== */

async function loadProducts(){

const res = await fetch("Data/products.json?v=3");
const products = await res.json();

renderProducts(products);

}

/* =====================================================
RENDER
===================================================== */

function renderProducts(products){

productSection.innerHTML = "<h2>Featured Products</h2>";

let rows = {};

products.forEach((p,i)=>{

const rowIndex = Math.floor(i/PRODUCTS_PER_ROW)+1;
if(rowIndex>MAX_ROWS) return;

if(!rows[rowIndex]){
rows[rowIndex] = createRow();
productSection.appendChild(rows[rowIndex].wrapper);
}

rows[rowIndex].row.appendChild(createCard(p));

});

}

/* =====================================================
ROW
===================================================== */

function createRow(){

const wrapper = document.createElement("div");
wrapper.className = "product-row-wrapper";

const left = document.createElement("button");
left.className = "row-arrow left";
left.innerHTML = "❮";

const right = document.createElement("button");
right.className = "row-arrow right";
right.innerHTML = "❯";

const row = document.createElement("div");
row.className = "product-row";

left.onclick = ()=>row.scrollBy({left:-400,behavior:"smooth"});
right.onclick = ()=>row.scrollBy({left:400,behavior:"smooth"});

wrapper.append(left,row,right);

return {wrapper,row};

}

/* =====================================================
CARD
===================================================== */

function createCard(p){

const card = document.createElement("div");
card.className = "product-card";

/* image */
const img = document.createElement("img");
img.src = p.image;

card.appendChild(img);

/* hover preview */
card.onmouseenter = ()=>{
if(previewPanel){
previewImage.src = p.image;
previewPanel.classList.add("active");
}
};

card.onmouseleave = ()=>{
if(previewPanel){
previewPanel.classList.remove("active");
}
};

/* click modal */
card.onclick = ()=>{

if(!modal) return;

/* hide preview */
if(previewPanel){
previewPanel.classList.remove("active");
}

/* open modal */
modal.classList.add("active");

modalImage.src = p.image;
modalTitle.textContent = p.name;
modalPrice.textContent = p.price + " " + p.currency;

if(buyButton){
buyButton.href = p.affiliateLink;
}

};

/* =====================================================
MODAL CLOSE
===================================================== */

if(closeModal){

closeModal.onclick = ()=> modal.classList.remove("active");

window.onclick = (e)=>{
if(e.target === modal){
modal.classList.remove("active");
}
};

}

/* =====================================================
TEXT MODALS
===================================================== */

const modalTriggers = qsa("[data-modal]");

modalTriggers.forEach(btn=>{
btn.onclick = ()=>{
const id = btn.getAttribute("data-modal");
const box = document.getElementById(id);
if(box) box.classList.add("active");
};
});

qsa(".text-modal").forEach(m=>{
m.onclick = (e)=>{
if(e.target === m){
m.classList.remove("active");
}
};
});

/* =====================================================
INIT
===================================================== */

document.addEventListener("DOMContentLoaded",loadProducts);
