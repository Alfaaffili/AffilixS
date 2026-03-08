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
const cursorInfo = document.getElementById("cursor-info");

/* ================= FLOATING PREVIEW =============== */

    const floatingPreview = document.getElementById("floatingPreview");
    const previewImage = document.getElementById("previewImage");

    if (floatingPreview && previewImage) {

/* ================= FLOATING PREVIEW =============== */

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

    rows.forEach((row, rowIndex) => {

        if (!row) return;

        const start = rowIndex * 10;
        const end = start + 10;
        const rowProducts = products.slice(start, end);

 if (rowProducts.length === 0) {

    // hide the row itself
    row.style.display = "none";
    
    // hide arrows
    const leftArrow = document.getElementById("left" + (rowIndex + 1));
    const rightArrow = document.getElementById("right" + (rowIndex + 1));

    if (leftArrow) leftArrow.style.display = "none";
    if (rightArrow) rightArrow.style.display = "none";

    return;
}
        rowProducts.forEach(product => {

            const link = document.createElement("a");
            link.href = "#"; /* changed so as not go to old page product.html?id=" + product.id; */

            const img = document.createElement("img");
            img.src = product.image;
            img.alt = product.name;

            img.addEventListener("mouseenter", () => {

                cursorInfo.innerHTML =
                    product.shortName + "<br>" +
                    product.currency + product.price;

                cursorInfo.style.opacity = "1";

            });

            img.addEventListener("mouseleave", () => {

                cursorInfo.style.opacity = "0";

            });

            link.appendChild(img);
            row.appendChild(link);

        });

    });

});
/* ===================================================== */
/* ================= CURSOR TOOLTIP ==================== */
/* ===================================================== */

document.addEventListener("mousemove", e => {
    if (!cursorInfo) return;

    cursorInfo.style.left = (e.clientX + 15) + "px";
    cursorInfo.style.top = (e.clientY + 15) + "px";
});

/* ================= AUTO YEAR UPDATE =============== */

    const yearElement = document.getElementById("year");
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

});