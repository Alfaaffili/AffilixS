/* =====================================================
AFFILIXS CORE ENGINE (STABLE BASELINE)
===================================================== */

function qs(sel){ return document.querySelector(sel); }
function qsa(sel){ return document.querySelectorAll(sel); }

const isTouchDevice =
'ontouchstart' in window ||
navigator.maxTouchPoints > 0;

/* ELEMENTS */

const productSection = qs(".products-section");

const previewPanel = qs("#floatingPreview");
const previewImage = qs("#previewImage");

const modal = qs("#productModal");
const modalImage = qs("#modalImage");
const modalTitle = qs("#modalTitle");
const modalPrice = qs("#modalPrice");
const buyButton = qs("#buyButton");
const closeModal = qs(".close-modal");

/* CONFIG */

const PRODUCTS_PER_ROW = 20;
const MAX_ROWS = 5;

/* LOAD PRODUCTS */

async function loadProducts(){

try{

const res = await fetch("./Data/products.json");

if(!res.ok){
throw new Error("HTTP error " + res.status);
}

const products = await res.json();

renderProducts(products);

}catch(err){

console.error("Product loading error:", err);

}

}

/* RENDER PRODUCTS */

function renderProducts(products){

if(!productSection) return;

productSection.innerHTML = "<h2>Featured Products</h2>";

let rows = {};

products.forEach((product,index)=>{

const rowIndex = Math.floor(index / PRODUCTS_PER_ROW) + 1;

if(rowIndex > MAX_ROWS) return;

if(!rows[rowIndex]){

rows[rowIndex] = createRow();
productSection.appendChild(rows[rowIndex].wrapper);

}

const card = createProductCard(product);
rows[rowIndex].row.appendChild(card);

});

}

/* CREATE ROW */

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

left.onclick = () => row.scrollBy({left:-400, behavior:"smooth"});
right.onclick = () => row.scrollBy({left:400, behavior:"smooth"});

wrapper.append(left, row, right);

return {wrapper, row};

}

/* CREATE PRODUCT CARD (SAFE + CLEAN) */

function createProductCard(product){

const card = document.createElement("div");
card.className = "product-card";

/* IMAGE */

const img = document.createElement("img");
img.src = product.image;
img.onerror = () => img.src = "images/placeholder.jpg";

/* META (RATING ONLY) */

const meta = document.createElement("div");
meta.className = "card-meta";
meta.innerText = "⭐ " + (product.rating || "4.5");

card.appendChild(img);
card.appendChild(meta);

/* PREVIEW PANEL (DESKTOP ONLY) */

if(previewPanel && !isTouchDevice){

card.addEventListener("mouseenter",()=>{

previewImage.src = product.image;
previewPanel.classList.add("active");

});

card.addEventListener("mouseleave",()=>{

previewPanel.classList.remove("active");

});

}

/* MODAL */

if(modal){

card.addEventListener("click",()=>{

modal.style.display = "flex";

modalImage.src = product.image;
modalTitle.textContent = product.name;
modalPrice.textContent =
product.price + " " + product.currency;

if(buyButton){
buyButton.href = product.affiliateLink;
}

});

}

return card;

}

/* CLOSE MODAL */

if(closeModal){

closeModal.onclick = ()=> modal.style.display = "none";

window.onclick = (e)=>{
if(e.target === modal){
modal.style.display = "none";
}
};

}

/* INIT */

document.addEventListener("DOMContentLoaded",()=>{

loadProducts();

});
