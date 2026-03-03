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

        document.addEventListener("mouseover", function (e) {
            const img = e.target.closest(".product-row img");
            if (img) {
                previewImage.src = img.src;
                floatingPreview.classList.add("active");
            }
        });

        document.addEventListener("mouseout", function (e) {
            const img = e.target.closest(".product-row img");
            if (img) {
                floatingPreview.classList.remove("active");
            }
        });
    }


    /* =========== AUTO DISTRIBUTE DEMO PRODUCTS ======== */
    /* ======= (Temporary – replace with real data) ===== */

    const rows = ["row1", "row2", "row3"];

    rows.forEach(rowId => {
        const row = document.getElementById(rowId);

        if (row && row.children.length === 0) {
            for (let i = 1; i <= 10; i++) {
                const link = document.createElement("a");
                link.href = "#";

                const img = document.createElement("img");
                img.src = "images/p" + i + ".jpg";
                img.alt = "Product " + i;

                link.appendChild(img);
                row.appendChild(link);
            }
        }
    });


    /* ================= AUTO YEAR UPDATE =============== */

    const yearElement = document.getElementById("year");
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

});