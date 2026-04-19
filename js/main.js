const IS_TOUCH = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

/* REPLACE your old function with this one */

async function loadProducts() {

    try {

        const res = await fetch("Data/products.json?v=1.4");

        const data = await res.json();

        
        // 1. Render the products

                renderProducts(data);

        
        // 2. Apply the golden underline to titles

                setupTitles();
 
        
        // 3. NEW: Setup the category arrows

                 setupCategoryArrows();
 

    } catch (e) {
 
        console.error("Data fail", e);
 
    }

}

function setupTitles() {
    document.querySelectorAll(".section-title").forEach(title => {
        const words = title.innerText.split(" ");
        if (words.length > 0) {
            const first = words.shift();
            title.innerHTML = `<span>${first}</span> ${words.join(" ")}`;
        }
    });
}

function renderProducts(products) {
    const container = document.querySelector("#productsContainer");
    if (!container) return;

    for (let i = 0; i < 5; i++) {
        const slice = products.slice(i * 20, (i + 1) * 20);
        if (slice.length > 0) {
            const wrapper = document.createElement("div");
            wrapper.className = "product-row-wrapper";
            
            const row = document.createElement("div");
            row.className = "product-row";
            
            const btnL = document.createElement("button");
            btnL.className = "row-arrow left"; btnL.innerHTML = "❮";
            btnL.onclick = () => row.scrollBy({left: -300, behavior: 'smooth'});

            const btnR = document.createElement("button");
            btnR.className = "row-arrow right"; btnR.innerHTML = "❯";
            btnR.onclick = () => row.scrollBy({left: 300, behavior: 'smooth'});

            slice.forEach(p => {
                const card = document.createElement("div");
                card.className = "product-card";
                card.innerHTML = `<img src="${p.image}" alt="${p.name}"><div class="short-name">${p.shortName}</div>`;
                
                // Preview Logic
                card.onmouseenter = () => {
                    const prev = document.querySelector("#floatingPreview");
                    const pImg = document.querySelector("#previewImage");
                    if(!IS_TOUCH && prev && pImg) {
                        pImg.src = p.image;
                        prev.classList.add("active");
                    }
                };
                card.onmouseleave = () => document.querySelector("#floatingPreview").classList.remove("active");
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
}

// Modal Global Listener
document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-modal]");
    if (trigger) {
        document.getElementById(trigger.dataset.modal).classList.add("active");
    }
    if (e.target.classList.contains("text-modal") || e.target.classList.contains("close-modal")) {
        document.querySelectorAll(".text-modal").forEach(m => m.classList.remove("active"));
    }
});

document.addEventListener("DOMContentLoaded", loadProducts);

/* ADD this helper function below or above the others */

function setupCategoryArrows() {

    const wrap = document.querySelector(".categories-wrapper");

    const row = document.querySelector("#categoriesRow");

   

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
