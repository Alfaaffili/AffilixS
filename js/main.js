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
   04. ROW DISTRIBUTION LOGIC
   ============================================================= */
function renderProducts(products) {
    if (!productSection) return;
    productSection.innerHTML = "<h2>Featured Products</h2>";

    for (let i = 0; i < MAX_ROWS; i++) {
        const start = i * PRODUCTS_PER_ROW;
        const end = start + PRODUCTS_PER_ROW;
        const slice = products.slice(start, end);

        if (slice.length > 0) {
            const { wrapper, row } = createRow();
            slice.forEach(p => row.appendChild(createCard(p)));
            productSection.appendChild(wrapper);
        }
    }
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
   07. PRODUCT MODAL CONTROLLER (The Logic Fix)
   ============================================================= */
function openProductModal(p) {
    if (!productModal) return;
    
    qs("#modalImage").src = p.image;
    qs("#modalTitle").textContent = p.name;
    qs("#modalPrice").textContent = `${p.currency}${p.price}`;
    qs("#buyButton").href = p.affiliateLink;
    
    productModal.style.display = "flex";
}

/* =============================================================
   08. GLOBAL EVENT LISTENERS (Modals)
   ============================================================= */
document.addEventListener("click", (e) => {
    // Close logic for ALL modal types
    if (e.target.classList.contains("close-modal") || 
        e.target.classList.contains("modal") || 
        e.target.classList.contains("text-modal")) {
        
        const activeModal = e.target.closest("#productModal, .text-modal") || e.target;
        if (activeModal) activeModal.style.display = "none";
    }
});

// Triggers for Vision/Contact/Privacy
qsa("[data-modal]").forEach(btn => {
    btn.onclick = () => {
        const target = document.getElementById(btn.dataset.modal);
        if (target) target.style.display = "flex";
    };
});

/* =============================================================
   09. TOOLTIP ENGINE (Fox-tail)
   ============================================================= */
document.addEventListener("mousemove", (e) => {
    if (IS_TOUCH || window.innerWidth <= 1024 || !tooltip) return;
    
    const card = e.target.closest(".product-card");
    if (card) {
        tooltip.innerHTML = `<strong>${card.dataset.shortname}</strong> — ${card.dataset.price}`;
        tooltip.style.display = "block";
        tooltip.style.left = (e.clientX + 15) + "px";
        tooltip.style.top = (e.clientY - 40) + "px";
    } else {
        tooltip.style.display = "none";
    }
});

/* =============================================================
   10. INITIALIZATION (Updated for Category Arrow Logic)
   ============================================================= */
document.addEventListener("DOMContentLoaded", async () => {
    // 1. Load Products
    await loadProducts();

    // 2. Check Categories for Arrows (Hide if 5 or less)
    const categoryCards = document.querySelectorAll(".category");
    const categoryArrows = document.querySelectorAll(".categories-wrapper .row-arrow");
    
    if (categoryCards.length <= 5) {
        categoryArrows.forEach(arrow => arrow.style.display = "none");
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
