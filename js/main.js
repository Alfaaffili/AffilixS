/**
 * AffilixS Master Logic
 * Combined Fixes: Golden Underline, Pinned Arrows, Left Footer, Auto-Refresh
 */

const IS_TOUCH = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

async function loadProducts() {
    const container = document.querySelector("#productsContainer");
    
    // SAFETY RETRY: If the HTML isn't ready, wait 100ms and try again.
    if (!container) {
        setTimeout(loadProducts, 100);
        return;
    }

    try {
        // Cache-buster for the JSON data
        const v = new Date().getTime();
        const res = await fetch("Data/products.json?v=" + v);
        if (!res.ok) throw new Error("JSON file not found");
        const data = await res.json();
        
        renderProducts(data);
        setupCategoryArrows(); 
    } catch (e) { 
        console.error("AffilixS Load Error:", e);
    }
}

function renderProducts(products) {
    const container = document.querySelector("#productsContainer");
    
    // GHOST KILLER: Remove any old arrows before building new ones
    document.querySelectorAll('.row-arrow').forEach(a => a.remove());

    // CLEAR & REBUILD: Re-add the title with the golden underline span
    container.innerHTML = '<h2 class="section-title"><span>Featured</span> Products</h2>';

    // Loop through up to 5 rows
    for (let i = 0; i < 5; i++) {
        const slice = products.slice(i * 20, (i + 1) * 20);
        if (slice.length > 0) {
            const wrapper = document.createElement("div");
            wrapper.className = "product-row-wrapper";
            
            const row = document.createElement("div");
            row.className = "product-row";

            // PINNED ARROWS: Only one pair per row, pinned to corners
            const btnL = document.createElement("button");
            btnL.className = "row-arrow left"; btnL.innerHTML = "❮";
            btnL.onclick = (e) => { e.stopPropagation(); row.scrollBy({left: -400, behavior: "smooth"}); };

            const btnR = document.createElement("button");
            btnR.className = "row-arrow right"; btnR.innerHTML = "❯";
            btnR.onclick = (e) => { e.stopPropagation(); row.scrollBy({left: 400, behavior: "smooth"}); };

            slice.forEach(p => {
                const card = document.createElement("div");
                card.className = "product-card";
                card.innerHTML = `<img src="${p.image}" alt="${p.name}"><div class="short-name">${p.shortName || "Product"}</div>`;
                
                // PREVIEW LOGIC: Fixed size handled by CSS, logic here
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
                    if(prev) { 
                        prev.style.left = (e.clientX + 15) + "px"; 
                        prev.style.top = (e.clientY - 200) + "px"; 
                    }
                };

                card.onclick = () => window.location.href = `product.html?id=${p.id}`;
                row.appendChild(card);
            });

            wrapper.append(btnL, row, btnR);
            container.appendChild(wrapper);
        }
    }
    // RE-APPLY GOLDEN UNDERLINES: To all section titles
    setupTitles(); 
}

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
    if (!wrap || !row) return;

    const categoryCount = row.querySelectorAll(".category").length;
    const isMobile = window.innerWidth <= 768;

    // RULE: Show if > 5 on Desktop OR show ALWAYS on Mobile
    if (categoryCount > 5 || isMobile) {
        if (!wrap.querySelector(".row-arrow")) {
            const btnL = document.createElement("button");
            btnL.className = "row-arrow left"; 
            btnL.innerHTML = "❮";
            btnL.onclick = () => row.scrollBy({left: -200, behavior: 'smooth'});

            const btnR = document.createElement("button");
            btnR.className = "row-arrow right"; 
            btnR.innerHTML = "❯";
            btnR.onclick = () => row.scrollBy({left: 200, behavior: 'smooth'});

            wrap.appendChild(btnL);
            wrap.appendChild(btnR);
        }
    } else {
        // Only remove if it's Desktop and count is low
        wrap.querySelectorAll(".row-arrow").forEach(a => a.remove());
    }
}

// MODAL CONTROLLER: Centered and handles background scroll
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

// STARTUP: Double-check that it fires regardless of how fast the page loads
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadProducts);
} else {
    loadProducts();
}
