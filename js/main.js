/* =============================================================
   01. HELPERS & SELECTORS (The Controller)
   ============================================================= */
const qs = s => document.querySelector(s);
const qsa = s => document.querySelectorAll(s);

const productSection = qs("#productsContainer");
const previewPanel = qs("#floatingPreview");
const previewImage = qs("#previewImage");
const tooltip = qs("#cursorTooltip");

const modal = qs("#productModal");
const modalImage = qs("#modalImage");
const modalTitle = qs("#modalTitle");
const modalPrice = qs("#modalPrice");
const buyButton = qs("#buyButton");

/* =============================================================
   02. CONFIGURATION (B04 Algorithm Rules)
   ============================================================= */
const PRODUCTS_PER_ROW = 20;
const MAX_ROWS = 5;
const IS_TOUCH = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

/* =============================================================
   03. PRODUCT ENGINE (Data Ingestion)
   ============================================================= */
async function loadProducts() {
    try {
        // Fetching with cache-busting versioning
        const res = await fetch("Data/products.json?v=1.3");
        if (!res.ok) throw new Error("Product data not found");
        const data = await res.json();

        // Sort by Priority Score (B04 Rule)
        data.sort((a, b) => (b.priority || 0) - (a.priority || 0));
        
        renderProducts(data);
    } catch (e) {
        console.error("Product Engine Error:", e);
    }
}

/* =============================================================
   04. ROW DISTRIBUTION ENGINE (B04 Logic)
   ============================================================= */
function distributeRows(products) {
    let rows = [];
    // Start from index 1 to respect "Featured Product [0]" if needed later, 
    // but here we follow the 20-item block rule.
    for (let i = 0; i < MAX_ROWS; i++) {
        const start = i * PRODUCTS_PER_ROW;
        const end = start + PRODUCTS_PER_ROW;
        const slice = products.slice(start, end);
        if (slice.length > 0) rows.push(slice);
    }
    return rows;
}

function renderProducts(products) {
    if (!productSection) return;
    productSection.innerHTML = "<h2>Featured Products</h2>";
    
    const distributedRows = distributeRows(products);
    distributedRows.forEach(rowData => {
        const { wrapper, row } = createRow();
        rowData.forEach(p => {
            row.appendChild(createCard(p));
        });
        productSection.appendChild(wrapper);
    });
}

/* =============================================================
   05. SCROLL ENGINE (Navigation Arrows)
   ============================================================= */
function createRow() {
    const wrapper = document.createElement("div");
    wrapper.className = "product-row-wrapper";

    const left = document.createElement("button");
    left.className = "row-arrow left";
    left.innerHTML = "❮";

    const right = document.createElement("button");
    right.className = "row-arrow right";
    right.innerHTML = "❯";

    const row = document.createElement("div");
    row.className = "product-row";

    left.onclick = () => row.scrollBy({ left: -400, behavior: "smooth" });
    right.onclick = () => row.scrollBy({ left: 400, behavior: "smooth" });

    wrapper.append(left, row, right);
    return { wrapper, row };
}

/* =============================================================
   06. PREVIEW & CARD ENGINE (Minimalist Fox-tail)
   ============================================================= */
function createCard(p) {
    const card = document.createElement("div");
    card.className = "product-card";
    
    // We store ONLY the minimalist data for the Tooltip here
    // This keeps the DOM light and the preview fast
    card.setAttribute('data-shortname', p.shortName || "Product");
    card.setAttribute('data-price', `${p.currency}${p.price}`);

    const img = document.createElement("img");
    img.src = p.image;
    img.alt = p.name;
    img.loading = "lazy"; 
    card.appendChild(img);

    // Desktop Hover Logic (Preview Panel)
    if (!IS_TOUCH) {
        card.addEventListener("mouseenter", () => {
            if (previewPanel && previewImage) {
                previewImage.src = p.image;
                previewPanel.classList.add("active");
            }
        });
        card.addEventListener("mouseleave", () => {
            if (previewPanel) previewPanel.classList.remove("active");
        });
    }

    // Modal Click Logic (Remains full-detail)
    card.addEventListener("click", () => {
        if (!modal) return;
        modal.style.display = "flex";
        if (modalImage) modalImage.src = p.image;
        if (modalTitle) modalTitle.textContent = p.name; // Full Name
        if (modalPrice) modalPrice.textContent = `${p.currency}${p.price}`;
        if (buyButton) buyButton.href = p.affiliateLink;
    });

    return card;
}

/* =============================================================
   07. MODAL ENGINE (Unified Closer)
   ============================================================= */
document.addEventListener('click', (e) => {
    // Close on 'X' click
    if (e.target.classList.contains('close-modal')) {
        const m = e.target.closest('#productModal, .text-modal');
        if (m) m.style.display = 'none';
    }
    // Close on Background click
    if (e.target.classList.contains('modal') || e.target.classList.contains('text-modal')) {
        e.target.style.display = "none";
    }
});

// Navigation & Footer Modals
qsa("[data-modal]").forEach(btn => {
    btn.onclick = () => {
        const m = document.getElementById(btn.dataset.modal);
        if (m) m.style.display = "flex";
    };
});

/* =============================================================
   08. TOOLTIP ENGINE (Refined for Short Name + Symbol)
   ============================================================= */
document.addEventListener("mousemove", (e) => {
    // Safety check: Disable on mobile/tablet to prevent overlapping
    if (IS_TOUCH || window.innerWidth <= 1024 || !tooltip) return;
    
    const card = e.target.closest(".product-card");
    
    if (card) {
        const sName = card.getAttribute("data-shortname");
        const price = card.getAttribute("data-price");
        
        // Output: Short Name — $189
        tooltip.innerHTML = `<strong>${sName}</strong> — ${price}`;
        tooltip.style.display = "block";
        
        // Offsetting the tooltip so it doesn't flicker under the cursor
        tooltip.style.left = (e.clientX + 15) + "px";
        tooltip.style.top = (e.clientY - 40) + "px";
    } else {
        tooltip.style.display = "none";
    }
});

/* =============================================================
   09. CATEGORY ENGINE (Mobile Arrow Support)
   ============================================================= */
const catWrapper = qs(".categories-wrapper");
const catRow = qs(".categories");

if (catWrapper && catRow) {
    const leftBtn = catWrapper.querySelector(".row-arrow.left");
    const rightBtn = catWrapper.querySelector(".row-arrow.right");

    if (leftBtn) leftBtn.onclick = () => catRow.scrollBy({ left: -240, behavior: "smooth" });
    if (rightBtn) rightBtn.onclick = () => catRow.scrollBy({ left: 240, behavior: "smooth" });
}

/* =============================================================
   10. INITIALIZATION
   ============================================================= */
document.addEventListener("DOMContentLoaded", loadProducts);