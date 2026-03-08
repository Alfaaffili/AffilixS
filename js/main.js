document.addEventListener("DOMContentLoaded", function(){

initProducts();
initArrows();
initModals();

});



function initProducts(){

const row = document.getElementById("row1");

if(!row) return;

const products = [

{
name:"Luxury Watch",
price:"$1200",
image:"https://via.placeholder.com/200"
},

{
name:"Premium Bag",
price:"$950",
image:"https://via.placeholder.com/200"
},

{
name:"Designer Shoes",
price:"$780",
image:"https://via.placeholder.com/200"
},

{
name:"Gold Bracelet",
price:"$1100",
image:"https://via.placeholder.com/200"
}

];


products.forEach(product =>{

const card = document.createElement("div");

card.className="product-card";

card.innerHTML=`

<img src="${product.image}">
<h4>${product.name}</h4>
<p>${product.price}</p>

`;

card.addEventListener("click", function(){

openModal(product);

});

row.appendChild(card);

});

}



function initArrows(){

const arrows=document.querySelectorAll(".row-arrow");

if(!arrows.length) return;

arrows.forEach(arrow=>{

arrow.addEventListener("click", function(){

const rowId=this.dataset.row;

const row=document.getElementById(rowId);

if(!row) return;

const direction=this.classList.contains("right") ? 1 : -1;

row.scrollBy({
left: direction * 400,
behavior:"smooth"
});

});

});

}



function initModals(){

const modal=document.getElementById("productModal");

const close=document.querySelector(".close-modal");

if(!modal || !close) return;

close.addEventListener("click", function(){

modal.style.display="none";

});

window.addEventListener("click", function(e){

if(e.target===modal){

modal.style.display="none";

}

});

}



function openModal(product){

const modal=document.getElementById("productModal");

const img=document.getElementById("modalImage");
const title=document.getElementById("modalTitle");
const price=document.getElementById("modalPrice");

if(!modal || !img || !title || !price) return;

img.src=product.image;
title.textContent=product.name;
price.textContent=product.price;

modal.style.display="flex";

}