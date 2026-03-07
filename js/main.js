/* ===================================================== */
/* ======================= SLIDER ====================== */
/* ===================================================== */

function slideRight(rowId) {
    const row = document.getElementById(rowId);
    if (row) {
        row.scrollLeft += row.clientWidth;
    }
}

function slideLeft(rowId) {
    const row = document.getElementById(rowId);
    if (row) {
        row.scrollLeft -= row.clientWidth;
    }
}


/* ===================================================== */
/* ======================== MODALS ===================== */
/* ===================================================== */

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = "block";
    }
}

function closeAll() {
    document.querySelectorAll('.modal')
        .forEach(modal => modal.style.display = "none");
}

function closeModal(event) {
    if (event.target.classList.contains('modal')) {
        closeAll();
    }
}


/* ===================================================== */
/* =================== INITIALIZATION ================== */
/* ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ================= FLOATING PREVIEW =============== */

    const floatingPreview = document.getElementById("floatingPreview");
    const previewImage = document.getElementById("previewImage");

    if (floatingPreview && previewImage) {

        /* ================= FLOATING PREVIEW =============== */

const floatingPreview = document.getElementById("floatingPreview");
const previewImage = document.getElementById("previewImage");

if (floatingPreview && previewImage) {

    const isTouchDevice = window.matchMedia("(hover: none)").matches;

    // DESKTOP HOVER BEHAVIOR
    if (!isTouchDevice) {

        document.addEventListener("mouseover", function (e) {
            const img = e.target.closest(".product-row img");
            if (img) {
                previewImage.src = img.src;
                floatingPreview.classList.add("active");
            }
        });

        document.addEventListener("mouseout", function (e) {
        document.addEventListener("click", function (e) {
           const insideProduct = e.target.closest(".product-row img");
           const insidePreview = e.target.closest("#floatingPreview");

    if (!insideProduct && !insidePreview) {
        floatingPreview.classList.remove("active");
    }
});
            const img = e.target.closest(".product-row img");
            if (img) {
                floatingPreview.classList.remove("active");
            }
        });

    }

    // TOUCH DEVICES (Mobile / Tablet)
    if (isTouchDevice) {

        document.addEventListener("click", function (e) {
            const img = e.target.closest(".product-row img");

            if (img) {
            if (img.parentElement.tagName === "A") {
                e.preventDefault();
            } /* this line code: e.preventDefault(); was replaced by the preceeding code */
            
                previewImage.src = img.src;
                floatingPreview.classList.add("active");
            } else {
                floatingPreview.classList.remove("active");
            }
        });

        window.addEventListener("scroll", function () {
            floatingPreview.classList.remove("active");
        });
    }
}
    }


    /* =========== AUTO DISTRIBUTE DEMO PRODUCTS ======== */
/* ================= LOAD PRODUCTS ================= */

fetch("Data/products.json")
.then(response => response.json())
.then(data => {

    const products = data.products;

    const rows = [
        document.getElementById("row1"),
        document.getElementById("row2"),
        document.getElementById("row3")
    ];

    products.forEach((product, index) => {

        const row = rows[Math.floor(index / 20)];

        if (!row) return;

        const link = document.createElement("a");
        link.href = "product.html?id=" + product.id;

        const img = document.createElement("img");
        img.src = product.image;
        img.alt = product.name;

        link.appendChild(img);
        row.appendChild(link);

    });

});  


    /* ================= AUTO YEAR UPDATE =============== */

    const yearElement = document.getElementById("year");
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

});