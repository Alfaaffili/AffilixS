/* =============================================================
   01. HELPERS & SELECTORS
   ============================================================= */
const qs = s => document.querySelector(s);
const qsa = s => document.querySelectorAll(s);

const productSection = qs("#productsContainer");
const productModal = qs("#productModal");
const tooltip = qs("#cursorTooltip");

/* =============================================================
   02. CONFIGURATION (B04 Rules)
   ============================================================= */
const PRODUCTS_PER_ROW = 20;
const MAX_ROWS = 5;
const IS_TOUCH = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

/* =============================================================
   03. DATA INGESTION ENGINE
   ============================================================= */
async function loadProducts() {
    try {
        const res = await fetch("Data/products.json?v=1.3.1");
        const data = await res.json();
        // Sorting by Priority (High to Low)
        data.sort((a, b) => (b.priority || 0) - (a.priority || 0));
        renderProducts(data);
    } catch (e) {
        console.error("Critical: Product Data Load Failed", e);
    }
}

/* =============================================================
   04. ROW DISTRIBUTION LOGIC (Clean 20-20-20 Loop)
   ============================================================= */
function renderProducts(products) {
    if (!productSection) return;
    productSection.innerHTML = "<h2>Featured Products</h2>";

    for (let i = 0; i < MAX_ROWS; i++) {
        // Precise inline slicing for better performance
        const slice = products.slice(i * PRODUCTS_PER_ROW, (i + 1) * PRODUCTS_PER_ROW);
        
        if (slice.length > 0) {
            const { wrapper, row } = createRow();
            slice.forEach(p => row.appendChild(createCard(p)));
            productSection.appendChild(wrapper);
        }
    }
    
    // Re-trigger mobile adjustments after content is ready
    if (typeof updateMobileState === "function") updateMobileState();
}

/* =============================================================
   05. SCROLL ENGINE (Arrows)
   ============================================================= */
function createRow() {
    const wrapper = document.createElement("div");
    wrapper.className = "product-row-wrapper";
    
    const row = document.createElement("div");
    row.className = "product-row";

    const btnL = document.createElement("button");
    btnL.className = "row-arrow left";
    btnL.innerHTML = "❮";
    btnL.onclick = () => row.scrollBy({ left: -400, behavior: "smooth" });

    const btnR = document.createElement("button");
    btnR.className = "row-arrow right";
    btnR.innerHTML = "❯";
    btnR.onclick = () => row.scrollBy({ left: 400, behavior: "smooth" });

    wrapper.append(btnL, row, btnR);
    return { wrapper, row };
}

/* =============================================================
   06. CARD BUILDER ENGINE
   ============================================================= */
function createCard(p) {
    const card = document.createElement("div");
    card.className = "product-card";
    
    // Minimalist Tooltip Data
    card.setAttribute('data-shortname', p.shortName || "Product");
    card.setAttribute('data-price', `${p.currency}${p.price}`);

    const img = document.createElement("img");
    img.src = p.image;
    img.alt = p.name;
      /* img.loading = "lazy"; */
    card.appendChild(img);


    // HOVER COMMANDS
    card.onmouseenter = () => {
        const prev = document.querySelector("#floatingPreview");
        const prevImg = document.querySelector("#previewImage");
        if(prev && prevImg) {
            prevImg.src = p.image;
            prev.classList.add("active");
        }
    };
    card.onmouseleave = () => {
        const prev = document.querySelector("#floatingPreview");
        if(prev) prev.classList.remove("active");
    };

    // Click Command
    card.onclick = () => openProductModal(p);

    return card;
}

/* =============================================================
   07. PRODUCT MODAL CONTROLLER (Fix: Tap & Scroll)
   ============================================================= */
function openProductModal(p) {
    if (!productModal) return;
    
    // Reset Modal internal scroll to top
    const modalBox = document.querySelector(".modal-box");
    if(modalBox) modalBox.scrollTop = 0;

    qs("#modalImage").src = p.image;
    qs("#modalTitle").textContent = p.name;
    qs("#modalPrice").textContent = `${p.currency}${p.price}`;
    qs("#buyButton").href = p.affiliateLink;
    
    productModal.style.display = "flex";
    
    // Lock background scroll to prevent "must scroll to tap" bug
    document.body.style.overflow = "hidden";
}

/* =============================================================
   08. GLOBAL MODAL CONTROLLER (Desktop & Mobile)
   ============================================================ */
document.addEventListener("click", (e) => {
    // 1. OPENING Modals (Header, Footer, or any data-modal button)
    const trigger = e.target.closest("[data-modal]");
    if (trigger) {
        const target = document.getElementById(trigger.dataset.modal);
        if (target) {
            target.classList.add("active");
            target.style.display = "flex";
            document.body.style.overflow = "hidden";
        }
    }

    // 2. CLOSING Modals (Clicking X or the Dark Background)
    if (e.target.classList.contains("close-modal") || e.target.classList.contains("modal") || e.target.classList.contains("text-modal")) {
        const activeModal = e.target.closest(".modal, .text-modal");
        if (activeModal) {
            activeModal.classList.remove("active");
            activeModal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    }
});

/* =============================================================
   09. CATEGORY & PRODUCT ARROW ENGINE (Logic Fix)
   ============================================================= */
function setupArrows() {
    document.querySelectorAll(".row-arrow").forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const row = btn.parentElement.querySelector(".product-row, .categories");
            const direction = btn.classList.contains("left") ? -250 : 250;
            if (row) row.scrollBy({ left: direction, behavior: "smooth" });
        };
    });
}

/* =============================================================
   10. INITIALIZATION
   ============================================================= */
document.addEventListener("DOMContentLoaded", async () => {
    await loadProducts(); // Your 20-20-20 logic runs here
    setupArrows();       // Activates all arrows (Category + Products)
    
    // Final check for Category arrow visibility
    const catCount = document.querySelectorAll(".category").length;
    if (catCount <= 3 && window.innerWidth <= 1024) {
        document.querySelectorAll(".categories-wrapper .row-arrow").forEach(a => a.style.display = "none");
    }
});

/* =============================================================
   11. MOBILE & TABLET DEVICE LOGIC (Touch & Resize)
   ============================================================= */
function updateMobileState() {
    const isMobile = window.innerWidth <= 1024;
    const preview = document.querySelector("#floatingPreview");
    const tooltip = document.querySelector("#cursorTooltip");

    // 1. Disable Desktop-Only UI on Touch Devices
    if (isMobile) {
        if (preview) preview.style.display = "none";
        if (tooltip) tooltip.style.display = "none";
    }

    // 2. Category Arrow Logic (Hide if items <= 3 on Mobile)
    const categoryCards = document.querySelectorAll(".category");
    const categoryArrows = document.querySelectorAll(".categories-wrapper .row-arrow");
    
    if (isMobile && categoryArrows.length > 0) {
        if (categoryCards.length <= 3) {
            categoryArrows.forEach(a => a.style.display = "none");
        } else {
            categoryArrows.forEach(a => a.style.display = "flex");
        }
    }
}

// Ensure it runs after products are fully rendered
window.addEventListener("resize", updateMobileState);

// Append to your DOMContentLoaded or call it at the end of loadProducts
const originalLoadProducts = loadProducts;
loadProducts = async function() {
    await originalLoadProducts();
    updateMobileState();
};

/* --- Update Section 11: Mobile Tap Fix --- */

function applyMobileLogic() {

    const isMobile = window.innerWidth <= 1024;

    

    // Ensure all cards use 'pointer' cursor and responsive heights

    document.querySelectorAll('.product-card').forEach(card => {

        card.style.cursor = "pointer";

        // On mobile, force the card to be the tap target

        card.onclick = (e) => {

            // This prevents "ghost clicks" or scroll interference

            e.stopPropagation();

            const pId = card.getAttribute('data-id');
 
            // The existing data retrieval logic remains same

        };

    });

}