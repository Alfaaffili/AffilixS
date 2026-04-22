/**
 * AffilixS Master Logic - Verified Solid State
 * Includes: 19-char limit, Samsung Arrow Force, and White-Space Fix
 */

const IS_TOUCH = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

async function loadProducts() {
    const container = document.querySelector("#productsContainer");
    
    if (!container) {
        setTimeout(loadProducts, 100);
        return;
    }

    try {
        const v = new Date().getTime();
        const res = await fetch("Data/products.json?v=" + v);
        if (!res.ok) throw new Error("JSON file not found");
        const data = await res.json();
        
        renderProducts(data);
        
        // Slight delay ensures the DOM is ready for the arrow calculations
        setTimeout(setupCategoryArrows, 200);
         
    } catch (e) { 
        console.error("AffilixS Load Error:", e);
    }
}

function renderProducts(products) {
    const container = document.querySelector("#productsContainer");
    
    // GHOST KILLER: Clean start for arrows
    document.querySelectorAll('.row-arrow').forEach(a => a.remove());

    container.innerHTML = '<h2 class="section-title"><span>Featured</span> Products</h2>';

    for (let i = 0; i < 5; i++) {
        const slice = products.slice(i * 20, (i + 1) * 20);
        if (slice.length > 0) {
            const wrapper = document.createElement("div");
            wrapper.className = "product-row-wrapper";
            
            const row = document.createElement("div");
            row.className = "product-row";

            const btnL = document.createElement("button");
            btnL.className = "row-arrow left"; btnL.innerHTML = "❮";
            btnL.onclick = (e) => { e.stopPropagation(); row.scrollBy({left: -400, behavior: "smooth"}); };

            const btnR = document.createElement("button");
            btnR.className = "row-arrow right"; btnR.innerHTML = "❯";
            btnR.onclick = (e) => { e.stopPropagation(); row.scrollBy({left: 400, behavior: "smooth"}); };

            slice.forEach(p => {
                const card = document.createElement("div");
                card.className = "product-card";
                
                const cleanName = p.shortName || "Product";
                const displayName = cleanName.length > 19 ? cleanName.substring(0, 16) + "..." : cleanName;
                
                card.innerHTML = `<img src="${p.image}" alt="${p.name}"><div class="short-name">${displayName}</div>`;
                
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

    const isMobile = window.innerWidth <= 768;
    const categoryCount = row.querySelectorAll(".category").length;

    if (isMobile || categoryCount > 5) {
        if (!wrap.querySelector(".row-arrow")) {
            const btnL = document.createElement("button");
            btnL.className = "row-arrow left"; 
            btnL.innerHTML = "❮";

            const btnR = document.createElement("button");
            btnR.className = "row-arrow right"; 
            btnR.innerHTML = "❯";

            btnL.onclick = () => row.scrollBy({left: -200, behavior: 'smooth'});
            btnR.onclick = () => row.scrollBy({left: 200, behavior: 'smooth'});

            wrap.appendChild(btnL);
            wrap.appendChild(btnR);
            
            // THE FORCE BLOCK: Fixed for White Space
            row.style.marginBottom = "10px"; // Minimized gap
            wrap.style.position = "relative"; 
            wrap.style.overflow = "visible";
            btnL.style.zIndex = "99999";
            btnR.style.zIndex = "99999";
        }
    } else {
        wrap.querySelectorAll(".row-arrow").forEach(a => a.remove());
        row.style.marginBottom = "0px"; 
    }
}

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

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadProducts);
} else {
    loadProducts();
}
