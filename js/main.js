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
    if (modal) modal.style.display = "block";
}

function closeAll() {
    document.querySelectorAll(".modal")
        .forEach(modal => modal.style.display = "none");
}

function closeModal(event) {
    if (event.target.classList.contains("modal")) {
        closeAll();
    }
}


/* ===================================================== */
/* =================== INITIALIZATION ================== */
/* ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

const cursorInfo = document.getElementById("cursor-info");
const floatingPreview = document.getElementById("floatingPreview");
const previewImage = document.getElementById("previewImage");


/* ===================================================== */
/* ================= FLOATING PREVIEW ================== */
/* ===================================================== */

if (floatingPreview && previewImage) {

    const isTouchDevice = window.matchMedia("(hover: none)").matches;

    /* DESKTOP HOVER */

    if (!isTouchDevice) {

        document.addEventListener("mouseover", function (e) {

            const img = e.target.closest(".product-row img");

            if (!img) return;

            previewImage.src = img.src;
            floatingPreview.classList.add("active");

        });

        document.addEventListener("mouseout", function (e) {

            const img = e.target.closest(".product-row img");

            if (!img) return;

            floatingPreview.classList.remove("active");

        });

        document.addEventListener("click", function (e) {

            const insideProduct = e.target.closest(".product-row img");
            const insidePreview = e.target.closest("#floatingPreview");

            if (!insideProduct && !insidePreview) {
                floatingPreview.classList.remove("active");
            }

        });

    }

    /* MOBILE / TOUCH DEVICES */

    if (isTouchDevice) {

        document.addEventListener("click", function (e) {

            const img = e.target.closest(".product-row img");

            if (img) {

                if (img.parentElement.tagName === "A") {
                    e.preventDefault();
                }

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


/* ===================================================== */
/* =================== LOAD PRODUCTS =================== */
/* ===================================================== */

fetch("Data/products.json")

.then(response => response.json())

.then(data => {

const products = data.products || [];

const rows = [
document.getElementById("row1"),
document.getElementById("row2"),
document.getElementById("row3")
];


rows.forEach((row, rowIndex) => {

if (!row) return;

const start = rowIndex * 10;
const end = start + 10;

const rowProducts = products.slice(start, end);


/* Hide empty rows */

if (rowProducts.length === 0) {

row.style.display = "none";

const leftArrow = document.getElementById("left" + (rowIndex + 1));
const rightArrow = document.getElementById("right" + (rowIndex + 1));

if (leftArrow) leftArrow.style.display = "none";
if (rightArrow) rightArrow.style.display = "none";

return;
}


/* Render products */

rowProducts.forEach(product => {

const link = document.createElement("a");
link.href = "#";

const img = document.createElement("img");
img.src = product.image;
img.alt = product.name;


/* Tooltip */

img.addEventListener("mouseenter", () => {

if (!cursorInfo) return;

cursorInfo.innerHTML =
product.shortName + "<br>" +
product.currency + product.price;

cursorInfo.style.opacity = "1";

});

img.addEventListener("mouseleave", () => {

if (!cursorInfo) return;

cursorInfo.style.opacity = "0";

});


link.appendChild(img);
row.appendChild(link);

});

});

})

.catch(error => {
console.error("Product loading error:", error);
});


/* ===================================================== */
/* ================= CURSOR TOOLTIP ==================== */
/* ===================================================== */

document.addEventListener("mousemove", function (e) {

if (!cursorInfo) return;

cursorInfo.style.left = (e.clientX + 15) + "px";
cursorInfo.style.top = (e.clientY + 15) + "px";

});


/* ===================================================== */
/* ================= AUTO YEAR UPDATE ================== */
/* ===================================================== */

const yearElement = document.getElementById("year");

if (yearElement) {
yearElement.textContent = new Date().getFullYear();
}

});