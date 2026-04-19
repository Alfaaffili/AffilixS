/* =============================================================
   01. CONFIGURATION & SELECTORS
   ============================================================= */
const IS_TOUCH = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

/* =============================================================
   02. DATA INGESTION (The Engine)
   ============================================================= */
async function loadProducts() {
    try {
        const res = await fetch("Data/products.json?v=1.4");
        const data = await res.json();
        
        // Render the product rows
        renderProducts(data);
        
        // Set up the category arrows
        setupCategoryArrows(); 

    } catch (e) { 
        console.error("Critical: Data Load Failed", e); 
    }
}

/* =============================================================
   03. PRODUCT RENDERING (Fixes Ghost Arrows)
   ============================================================= */
function renderProducts(products) {
    const container = document.querySelector("#productsContainer");
    if (!container) return;
    
    // Clear container and add the gold-underline-ready title
    container.innerHTML = '<h2 class="section-title"><span>Featured</span> Products</h2>';

    // Loop through 5 rows max
    for (let i = 0; i < 5; i++) {
        const slice = products.slice(i * 20, (i + 1) * 20);
        
        if (slice.length > 0) {
            const { wrapper, row } = createRow();
            
            slice.forEach(p => {
                const card = document.createElement("div");
                card.className = "product-card";
                card.innerHTML = `
                    <img src="${p.image}" alt="${p.name}">
                    <div class="short-name">${p.shortName || "Product"}</div>
                `;
                
                // --- PREVIEW LOGIC (Fixed Dimensions in CSS) ---
                card.onmouseenter = () => {
                    const prev = document.querySelector("#floatingPreview");
                    const pImg = document.querySelector("#previewImage");
                    if(!IS_TOUCH && prev && pImg) {
                        pImg.src = p.image;
                        prev.classList.add("active");
                    }
                };
                
                card.onmouseleave = () => {
                    const prev = document.querySelector("#floatingPreview");
                    if(prev) prev.classList.remove("active");
                };

                card.onmousemove = (e) => {
                    const prev = document.querySelector("#floatingPreview");
                    if(prev && !IS_TOUCH) {
                        prev.style.left = (e.clientX + 15) + "px";
                        prev.style.top = (e.clientY - 200) + "px";
                    }
                };

                // --- REDIRECT LOGIC ---
                card.onclick = () => {
                    window.location.href = `product.html?id=${p.id}`;
                };
                
                row.appendChild(card);
            });

            container.appendChild(wrapper);
        }
    }
    // Apply golden underline to the first word of all titles
    setupTitles(); 
}

/* =============================================================
   04. ROW CREATOR (Arrows pinned to corners)
   ============================================================= */
function createRow() {
    const wrapper = document.createElement("div");
    wrapper.className = "product-row-wrapper";
    
    const row = document.createElement("div");
    row.className = "product-row";

    // Create Left Arrow
    const btnL = document.createElement("button");
    btnL.className = "row-arrow left"; 
    btnL.innerHTML = "❮";
    btnL.onclick = (e) => { 
        e.stopPropagation(); 
        row.scrollBy({left: -400, behavior: "smooth"}); 
    };

    // Create Right Arrow
    const btnR = document.createElement("button");
    btnR.className = "row-arrow right"; 
    btnR.innerHTML = "❯";
    btnR.onclick = (e) => { 
        e.stopPropagation(); 
        row.scrollBy({left: 400, behavior: "smooth"}); 
    };

    wrapper.append(btnL, row, btnR);
    return { wrapper, row };
}

/* =============================================================
   05. UI HELPERS (Titles, Categories, Modals)
   ============================================================= */

// Wraps the first word in a span for the golden underline CSS
function setupTitles() {
    document.querySelectorAll(".section-title").forEach(title => {
        const text = title.innerText.trim();
        const words = text.split(" ");
        if (words.length > 0) {
            const first = words.shift();
            title.innerHTML = `<span>${first}</span> ${words.join(" ")}`;
        }
    });
}

function setupCategoryArrows() {
    const wrap = document.querySelector(".categories-wrapper");
    const row = document.querySelector("#categoriesRow");
    
    // Safety check: Don't add arrows twice
    if (wrap && row && !wrap.querySelector(".row-arrow")) {
        const btnL = document.createElement("button");
        btnL.className = "row-arrow left"; 
        btnL.innerHTML = "❮";
        btnL.onclick = () => row.scrollBy({left: -300, behavior: 'smooth'});

        const btnR = document.createElement("button");
        btnR.className = "row-arrow right"; 
        btnR.innerHTML = "❯";
        btnR.onclick = () => row.scrollBy({left: 300, behavior: 'smooth'});

        wrap.appendChild(btnL);
        wrap.appendChild(btnR);
    }
}

// Global Modal Controller
document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-modal]");
    if (trigger) {
        const modal = document.getElementById(trigger.dataset.modal);
        if (modal) {
            modal.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    }
    if (e.target.classList.contains("text-modal") || e.target.classList.contains("close-modal")) {
        document.querySelectorAll(".text-modal").forEach(m => m.classList.remove("active"));
        document.body.style.overflow = "auto";
    }
});

/* =============================================================
   06. INITIALIZATION
   ============================================================= */
document.addEventListener("DOMContentLoaded", loadProducts);
