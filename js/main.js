/* =====================================================
AFFILIXS CORE ENGINE
Production Stable Version
===================================================== */


/* =====================================================
SAFETY HELPERS
===================================================== */

function qs(sel){ return document.querySelector(sel); }
function qsa(sel){ return document.querySelectorAll(sel); }


/* =====================================================
DEVICE DETECTION
===================================================== */

const isTouchDevice =
'ontouchstart' in window ||
navigator.maxTouchPoints > 0;


/* =====================================================
ELEMENT REFERENCES
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
CONFIGURATION
===================================================== */

const PRODUCTS_PER_ROW = 20;
const MAX_ROWS = 5;


/* =====================================================
LOAD PRODUCTS
===================================================== */

async function loadProducts(){

try{

const res = await fetch("Data/products.json?v=2");
const products = await res.json();

renderProducts(products);

}catch(err){

console.error("Product loading error:",err);

}

}


/* =====================================================
RENDER PRODUCTS
===================================================== */

function renderProducts(products){

if(!productSection) return;

productSection.innerHTML = "<h2>Featured Products</h2>";

let rows = {};

products.forEach((product,index)=>{

const rowIndex = Math.floor(index/PRODUCTS_PER_ROW)+1;

if(rowIndex>MAX_ROWS) return;

if(!rows[rowIndex]){

rows[rowIndex] = createRow(product.category);
productSection.appendChild(rows[rowIndex].wrapper);

}

const card = createProductCard(product);

rows[rowIndex].row.appendChild(card);

});

}


/* =====================================================
CREATE ROW
===================================================== */

function createRow(category){

const wrapper = document.createElement("div");
wrapper.className="product-row-wrapper";

const title = document.createElement("h3");
title.className="row-title";
title.textContent = category;

const left=document.createElement("button");
left.className="row-arrow left";
left.innerHTML="❮";

const right=document.createElement("button");
right.className="row-arrow right";
right.innerHTML="❯";

const row=document.createElement("div");
row.className="product-row";

left.onclick=()=>row.scrollBy({left:-400,behavior:"smooth"});
right.onclick=()=>row.scrollBy({left:400,behavior:"smooth"});

wrapper.appendChild(title);
wrapper.appendChild(left);
wrapper.appendChild(row);
wrapper.appendChild(right);

return {wrapper,row};

}


/* =====================================================
CREATE PRODUCT CARD
===================================================== */

function createProductCard(product){

const card=document.createElement("div");
card.className="product-card";

const img=document.createElement("img");
img.src=product.image;
img.onerror=()=>img.src="images/placeholder.jpg";

const title=document.createElement("h4");
title.textContent=product.shortName;

const price=document.createElement("p");
price.textContent=product.price+" "+product.currency;

card.appendChild(img);
card.appendChild(title);
card.appendChild(price);


/* =====================================================
DESKTOP TOOLTIP PREVIEW
===================================================== */

if(previewPanel && !isTouchDevice){

card.addEventListener("mouseenter",()=>{

previewImage.src=product.image;
previewPanel.classList.add("active");

document.body.classList.add("preview-active");

});

card.addEventListener("mouseleave",()=>{

previewPanel.classList.remove("active");

document.body.classList.remove("preview-active");

});

}


/* =====================================================
PRODUCT MODAL
===================================================== */

if(modal){

card.addEventListener("click",()=>{

if(previewPanel){
previewPanel.classList.remove("active");
document.body.classList.remove("preview-active");
}

modal.style.display="flex";

modalImage.src=product.image;
modalTitle.textContent=product.name;
modalPrice.textContent=product.price+" "+product.currency;

if(buyButton){
buyButton.href = product.affiliateLink;
}

});

}

return card;

}


/* =====================================================
CLOSE PRODUCT MODAL
===================================================== */

if(closeModal){

closeModal.onclick=()=>modal.style.display="none";

window.onclick=(e)=>{

if(e.target===modal){
modal.style.display="none";
}

};

}


/* =====================================================
CATEGORY SCROLL ENGINE
===================================================== */

const catRow = qs(".categories");
const catLeft = qs(".cat-arrow.left");
const catRight = qs(".cat-arrow.right");

if(catRow && catLeft && catRight){

catLeft.onclick=()=>catRow.scrollBy({left:-200,behavior:"smooth"});
catRight.onclick=()=>catRow.scrollBy({left:200,behavior:"smooth"});

}


/* =====================================================
TEXT MODAL SYSTEM
(Header + Footer)
===================================================== */

const modalTriggers=qsa("[data-modal]");

modalTriggers.forEach(btn=>{

btn.addEventListener("click",()=>{

const id=btn.getAttribute("data-modal");
const box=document.getElementById(id);

if(box){
box.style.display="flex";
}

});

});


const textModals=qsa(".text-modal");

textModals.forEach(modal=>{

modal.addEventListener("click",(e)=>{

if(e.target===modal){
modal.style.display="none";
}

});

});


/* =====================================================
INITIALIZE ENGINE
===================================================== */

document.addEventListener("DOMContentLoaded",()=>{

loadProducts();

});
