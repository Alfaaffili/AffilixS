/* =====================================================
AFFILIXS CORE ENGINE (STABLE VERSION)
===================================================== */

/* HELPERS */
function qs(s){ return document.querySelector(s); }
function qsa(s){ return document.querySelectorAll(s); }

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
const res = await fetch("Data/products.json?v=3");
const products = await res.json();
renderProducts(products);
}catch(e){
console.error("Product loading error:", e);
}
}

/* RENDER */
function renderProducts(products){

if(!productSection) return;

productSection.innerHTML = "<h2>Featured Products</h2>";

let rows = {};

products.forEach((p,i)=>{

const rowIndex = Math.floor(i / PRODUCTS_PER_ROW) + 1;
if(rowIndex > MAX_ROWS) return;

if(!rows[rowIndex]){
rows[rowIndex] = createRow();
productSection.appendChild(rows[rowIndex].wrapper);
}

const card = createProductCard(p);
rows[rowIndex].row.appendChild(card);

});
}

/* ROW */
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

left.onclick = ()=> row.scrollBy({left:-400, behavior:"smooth"});
right.onclick = ()=> row.scrollBy({left:400, behavior:"smooth"});

wrapper.appendChild(left);
wrapper.appendChild(row);
wrapper.appendChild(right);

return {wrapper,row};
}

/* PRODUCT CARD */
function createProductCard(p){

const card = document.createElement("div");
card.className = "product-card";

/* IMAGE */
const img = document.createElement("img");
img.src = p.image;
img.onerror = ()=> img.src = "images/placeholder.jpg";

/* META (rating only) */
const meta = document.createElement("div");
meta.className = "card-meta";
meta.innerText = "⭐ " + (p.rating || "4.5");

card.appendChild(img);
card.appendChild(meta);

/* HOVER PREVIEW (DESKTOP) */
card.addEventListener("mouseenter", ()=>{
if(previewPanel){
previewImage.src = p.image;
previewPanel.classList.add("active");
}
});

card.addEventListener("mouseleave", ()=>{
if(previewPanel){
previewPanel.classList.remove("active");
}
});

/* CLICK MODAL */
card.onclick = ()=>{

if(!modal) return;

/* hide preview */
if(previewPanel){
previewPanel.classList.remove("active");
}

/* show modal */
modal.style.display = "flex";

/* fill content */
modalImage.src = p.image;
modalTitle.textContent = p.name;
modalPrice.textContent = p.price + " " + p.currency;

if(buyButton){
buyButton.href = p.affiliateLink;
}

};

return card;
}

/* CLOSE MODAL */
if(closeModal){

closeModal.onclick = ()=>{
modal.style.display = "none";
};

window.onclick = (e)=>{
if(e.target === modal){
modal.style.display = "none";
}
};

}

/* TEXT MODALS */
qsa(".text-modal").forEach(m=>{

m.addEventListener("click", (e)=>{

if(e.target === m){
m.style.display = "none";
}

});

});

/* INIT */
document.addEventListener("DOMContentLoaded", loadProducts);