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

	   data.sort((a,b)=> (b.priority || 0) - (a.priority || 0));
           
	   renderProducts(data);

	}catch(e){
	    console.error(e);
	}
}

/* RENDER */
/* ===============================
ROW DISTRIBUTION ENGINE
=============================== */
function distributeRows(products){
    let rows = [];

    for(let i = 0; i < MAX_ROWS; i++){
        const start = i * PRODUCTS_PER_ROW;
        const end = start + PRODUCTS_PER_ROW;

        const slice = products.slice(start, end);

        if(slice.length > 0){
            rows.push(slice);
        }
    }

    return rows;
}

/* ===============================
RENDER
=============================== */
function renderProducts(products){

if(!productSection) return;

productSection.innerHTML = "<h2>Featured Products</h2>";
const distributedRows = distributeRows(products);

distributedRows.forEach(rowData=>{
    const row = createRow();

    rowData.forEach(p=>{
        row.row.appendChild(createCard(p));
    });

    productSection.appendChild(row.wrapper);
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

    if(!modal) return;

    modal.style.display = "flex";

    if(modalImage) modalImage.src = p.image;
    if(modalTitle) modalTitle.textContent = p.name;
    if(modalPrice) modalPrice.textContent = p.price+" "+p.currency;

    if(buyButton){
        buyButton.href = p.affiliateLink;
    }

});

return card;
}

/* CLOSE MODAL */
if(closeModal){
    closeModal.onclick = ()=> {
        if(modal) modal.style.display="none";
    };
}

window.onclick = e=>{
    if(modal && e.target === modal){
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
document.addEventListener("DOMContentLoaded", () => {
    loadProducts();

    // Move tooltip logic INSIDE here to prevent 'null' errors
    const tooltip = document.getElementById('cursorTooltip');
    if (tooltip) {
        document.addEventListener("mousemove", (e) => {
            const card = e.target.closest(".product-card");
            if (card && window.innerWidth > 1024) {
                const name = card.getAttribute("data-name") || "";
                const price = card.getAttribute("data-price") || "";
                tooltip.innerHTML = `<strong>${name}</strong><br>${price}`;
                tooltip.style.display = "block";
                tooltip.style.left = (e.clientX + 15) + "px";
                tooltip.style.top = (e.clientY - 40) + "px";
            } else {
                tooltip.style.display = "none";
            }
        });
    }
});

/* ===============================
CATEGORY ARROW SCROLL
=============================== */
const categoryWrapper = document.querySelector(".categories-wrapper");
const categoryRow = document.querySelector(".categories");

if(categoryWrapper && categoryRow){

    const leftArrow = categoryWrapper.querySelector(".row-arrow.left");
    const rightArrow = categoryWrapper.querySelector(".row-arrow.right");

    if(leftArrow){
        leftArrow.onclick = ()=>{
            categoryRow.scrollBy({left:-200, behavior:"smooth"});
        };
    }

    if(rightArrow){
        rightArrow.onclick = ()=>{
            categoryRow.scrollBy({left:200, behavior:"smooth"});
        };
    }
}