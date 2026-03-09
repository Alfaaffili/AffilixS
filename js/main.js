document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    initArrows();
    initModals();
});



/* =========================
   PRODUCT LOADER
========================= */

function loadProducts() {

    fetch("Data/products.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("products.json not found");
        }
        return response.json();
    })

    .then(data => {

        // Support both JSON structures
        let products = Array.isArray(data) ? data : data.products;

        if (!Array.isArray(products)) {
            throw new Error("products.json format invalid");
        }

        const row = document.getElementById("row1");
        if (!row) return;

        row.innerHTML = "";

        products.forEach(product => {

            const card = document.createElement("div");
            card.className = "product-card";

            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h4>${product.name}</h4>
                <p>${product.price} ${product.currency}</p>
            `;

            card.addEventListener("click", () => openModal(product));

            row.appendChild(card);

        });

    })

    .catch(error => {
        console.error("Product loading error:", error);
    });

}



/* =========================
   SCROLL ARROWS
========================= */

function initArrows(){

    const arrows = document.querySelectorAll(".row-arrow");
    if(!arrows.length) return;

    arrows.forEach(arrow => {

        arrow.addEventListener("click", () => {

            const rowId = arrow.dataset.row;
            const row = document.getElementById(rowId);
            if(!row) return;

            const direction = arrow.classList.contains("right") ? 1 : -1;

            row.scrollBy({
                left: direction * 400,
                behavior: "smooth"
            });

        });

    });

}



/* =========================
   MODAL SYSTEM
========================= */

function initModals(){

    const modal = document.getElementById("productModal");
    const close = document.querySelector(".close-modal");

    if(!modal || !close) return;

    close.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", e => {

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