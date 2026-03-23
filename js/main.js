/* HELPERS */
const qs = s => document.querySelector(s);
const qsa = s => document.querySelectorAll(s);

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

/* LOAD */
async function loadProducts(){
try{
const res = await fetch("Data/products.json?v=5");
const data = await res.json();
renderProducts(data);
}catch(e){
console.error(e);
}
}

/* RENDER */
function renderProducts(products){

productSection.innerHTML = "<h2>Featured Products</h2>";

let rows = {};

products.forEach((p,i)=>{

let rowIndex = Math.floor(i/PRODUCTS_PER_ROW)+1;
if(rowIndex>MAX_ROWS) return;

if(!rows[rowIndex]){
rows[rowIndex] = createRow();
productSection.appendChild(rows[rowIndex].wrapper);
}

rows[rowIndex].row.appendChild(createCard(p));

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

left.onclick = ()=>row.scrollBy({left:-400,behavior:"smooth"});
right.onclick = ()=>row.scrollBy({left:400,behavior:"smooth"});

wrapper.append(left,row,right);

return {wrapper,row};
}

/* CARD */
function createCard(p){
    const card = document.createElement("div");
    card.className = "product-card";

    // 🔥 ADD THESE TWO LINES HERE:

    card.setAttribute('data-name', p.name);

    card.setAttribute('data-price', p.price + " " + p.currency);

    const img = document.createElement("img");
    img.src = p.image;
    card.appendChild(img);

    // ... rest of your hover/click code ...

    return card;

}

/* HOVER */
card.addEventListener("mouseenter",()=>{
if(previewPanel){
previewImage.src = p.image;
previewPanel.classList.add("active");
}
});

card.addEventListener("mouseleave",()=>{
if(previewPanel){
previewPanel.classList.remove("active");
}
});

/* CLICK */
card.addEventListener("click",()=>{

modal.style.display = "flex";

modalImage.src = p.image;
modalTitle.textContent = p.name;
modalPrice.textContent = p.price+" "+p.currency;

if(buyButton){
buyButton.href = p.affiliateLink;
}

});

return card;
}

/* CLOSE MODAL */
closeModal.onclick = ()=> modal.style.display="none";

window.onclick = e=>{
if(e.target === modal){
modal.style.display="none";
}
};

/* TEXT MODALS */
qsa("[data-modal]").forEach(btn=>{
btn.onclick = ()=>{
const m = document.getElementById(btn.dataset.modal);
if(m) m.style.display="flex";
};
});

qsa(".text-modal").forEach(m=>{
m.onclick = e=>{
if(e.target===m) m.style.display="none";
};
});

/* INIT */
document.addEventListener("DOMContentLoaded", loadProducts);

/* FOX-TAIL TOOLTIP ENGINE */
const tooltip = qs("#cursorTooltip");

document.addEventListener("mousemove", (e) => {
    const card = e.target.closest(".product-card");
    // Check if card exists before trying to get attributes
    if (card && window.innerWidth > 1024) { 
        const name = card.getAttribute("data-name") || "Product";
        const price = card.getAttribute("data-price") || "";
        
        tooltip.innerHTML = `<strong>${name}</strong><br>${price}`;
        tooltip.style.display = "block";
        tooltip.style.left = (e.clientX + 15) + "px";
        tooltip.style.top = (e.clientY - 40) + "px";
    } else {
        if(tooltip) tooltip.style.display = "none";
    }
}); // Ensure there is no 'return' sitting alone below this line!
