/* =====================================================
   AFFILIXS MAIN ENGINE
   Handles product loading, preview, modal and scrolling
===================================================== */


/* =====================================================
   SAFETY WRAPPER (CRASH PROTECTION)
===================================================== */

try{


/* =====================================================
   LOAD PRODUCTS FROM JSON
===================================================== */

async function loadProducts(){

const row = document.getElementById("row1");

if(!row){
console.error("Product row container not found");
return;
}

let products = [];

try{

const response = await fetch("Data/products.json");

if(!response.ok){
throw new Error("Products.json failed to load");
}

products = await response.json();

if(!Array.isArray(products)){
throw new Error("Products data is not an array");
}

}catch(error){

console.error("Product loading error:", error);
return;

}



/* =====================================================
   GENERATE PRODUCT CARDS
===================================================== */

products.forEach(product => {

if(!product.image || !product.name){
return;
}

const card = document.createElement("div");
card.className = "product-card";

card.innerHTML = `
<img src="${product.image}" alt="${product.name}">
<h4>${product.name}</h4>
<p>${product.price || ""}</p>
`;

row.appendChild(card);



/* =====================================================
   FLOATING HOVER PREVIEW
===================================================== */

const preview = document.getElementById("floatingPreview");
const previewImg = document.getElementById("previewImage");

if(preview && previewImg){

card.addEventListener("mouseenter", () => {

previewImg.src = product.image;
preview.classList.add("active");

});

card.addEventListener("mouseleave", () => {

preview.classList.remove("active");

});

}



/* =====================================================
   PRODUCT MODAL (CLICK)
===================================================== */

const modal = document.getElementById("productModal");
const modalImg = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");

if(modal && modalImg){

card.addEventListener("click", () => {

modal.style.display = "flex";

modalImg.src = product.image;
modalTitle.innerText = product.name;
modalPrice.innerText = product.price || "";

});

}

});


}



/* =====================================================
   MODAL CLOSE SYSTEM
===================================================== */

const closeBtn = document.querySelector(".close-modal");

if(closeBtn){

closeBtn.addEventListener("click", () => {

const modal = document.getElementById("productModal");

if(modal){
modal.style.display = "none";
}

});

}



/* =====================================================
   PRODUCT ROW ARROWS
===================================================== */

document.querySelectorAll(".row-arrow").forEach(btn => {

btn.addEventListener("click", () => {

const row = document.getElementById(btn.dataset.row);

if(!row){
console.warn("Row not found:", btn.dataset.row);
return;
}

row.scrollBy({
left: btn.classList.contains("left") ? -320 : 320,
behavior: "smooth"
});

});

});



/* =====================================================
   INITIALIZE PAGE
===================================================== */

loadProducts();



}catch(error){

console.error("AffilixS runtime crash prevented:", error);

}