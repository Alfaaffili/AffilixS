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
   07. PRODUCT MODAL ENGINE (Opening Logic)
   ============================================================= */
function openProductModal(p) {
    const modal = document.querySelector("#productModal");
    if (!modal) return;

    // Reset internal scroll of the box to the top
    const modalBox = document.querySelector(".modal-box");
    if (modalBox) modalBox.scrollTop = 0;

    // Inject Data
    document.querySelector("#modalImage").src = p.image;
    document.querySelector("#modalTitle").textContent = p.name;
    document.querySelector("#modalPrice").textContent = `${p.currency}${p.price}`;
    document.querySelector("#buyButton").href = p.affiliateLink;
    
    // Activate
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent background scroll
}

/* =============================================================
   08. GLOBAL MODAL CONTROLLER (Stabilized)
   ============================================================= */
document.addEventListener("click", (e) => {
    // 1. OPENING (Header/Footer Nav)
    const trigger = e.target.closest("[data-modal]");
    if (trigger) {
        const target = document.getElementById(trigger.dataset.modal);
        if (target) {
            target.classList.add("active");
            target.style.display = "flex";
            document.body.style.overflow = "hidden";
        }
    }

    // 2. CLOSING (X button or clicking outside the box)
    if (e.target.classList.contains("close-modal") || e.target.id === "productModal" || e.target.classList.contains("text-modal")) {
        const activeModal = document.querySelector(".modal.active, .text-modal.active");
        if (activeModal) {
            activeModal.classList.remove("active");
            activeModal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    }
});

/* =============================================================
   09. SCROLL ARROW ENGINE (Setup)
   ============================================================= */
function setupArrows() {
    document.querySelectorAll(".row-arrow").forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation(); // Stop tap from hitting cards behind arrow
            const row = btn.parentElement.querySelector(".product-row, .categories");
            const direction = btn.classList.contains("left") ? -300 : 300;
            if (row) row.scrollBy({ left: direction, behavior: "smooth" });
        };
    });
}

/* =============================================================
   10. INITIALIZATION (Mobile Touch & Arrow Logic)
   ============================================================= */
document.addEventListener("DOMContentLoaded", async () => {
    await loadProducts();
    setupArrows();

    const isMobile = window.innerWidth <= 1024;

    // THE TOUCH FIX: Remove Hover Engine on Mobile entirely
    if (isMobile) {
        const preview = document.querySelector("#floatingPreview");
        if (preview) preview.remove(); 
    }

    // Desktop Category Arrow Logic (Hide if <= 5)
    const catCount = document.querySelectorAll(".category").length;
    const catArrows = document.querySelectorAll(".categories-wrapper .row-arrow");

    if (!isMobile && catCount <= 5) {
        catArrows.forEach(a => a.style.display = "none");
    }
    
    // Mobile Arrow Logic (Always show if scrollable)
    if (isMobile && catCount > 1) {
        catArrows.forEach(a => a.style.display = "flex");
    }
});
