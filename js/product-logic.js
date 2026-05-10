/**
 * AFFILIXS PRODUCT PAGE LOGIC - REPAIRED
 */

async function initProductPage() {
    try {
        const response = await fetch("Data/products.json?v=" + Date.now());
        const allProducts = await response.json();

        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        const currentProduct = allProducts.find(p => p.id == productId) || allProducts[0];

        updateProductUI(currentProduct);
        renderSimilarProducts(allProducts, currentProduct);

    } catch (error) {
        console.error("AffilixS Error: Could not initialize product page.", error);
    }
}

function updateProductUI(product) {
    // 1. Text Details - Fixed the overwrite bug
    // Make sure you have separate IDs in your HTML: pShortName and pFullName
    const shortNameElem = document.getElementById("pShortName");
    const fullNameElem = document.getElementById("pFullName");
    
    if (shortNameElem) shortNameElem.innerText = product.shortName;
    if (fullNameElem) fullNameElem.innerText = product.name;
    
    document.getElementById("heroImage").src = product.image;
    document.getElementById("pDesc").innerText = product.fullDescription;
    
    // 2. Stats & Price
    const priceElem = document.getElementById("pPrice");
    if (priceElem) priceElem.innerText = (product.currency || "$") + product.price;
    
    const buyBtn = document.getElementById("buyBtn");
    if (buyBtn) buyBtn.href = product.affiliateLink;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    const newUrl = window.location.pathname + '?id=' + product.id;
    window.history.pushState({ path: newUrl }, '', newUrl);
}

function renderSimilarProducts(allProducts, currentProduct) {
    const container = document.getElementById("productRowsContainer");
    if (!container) return;

    const similar = allProducts.filter(p => p.category === currentProduct.category && p.id !== currentProduct.id);

    if (similar.length > 0) {
        container.innerHTML = `
            <div class="row-wrapper">
                <h2 class="row-title">Similar Discoveries</h2>
                <div class="product-row" id="relRow"></div>
                <button class="arrow-btn l" onclick="scrollRow(-350)">&lt;</button>
                <button class="arrow-btn r" onclick="scrollRow(350)">&gt;</button>
            </div>`;

        const row = document.getElementById("relRow");
        similar.forEach(item => {
            const card = document.createElement("div");
            card.className = "product-card";
            
            // Image is back! Text is removed per your Point 4.
            card.innerHTML = `<img src="${item.image}" alt="${item.shortName}">`;
            
            card.onclick = () => updateProductUI(item);
            row.appendChild(card);
        });

        // Initialize Drag-to-Scroll AFTER row is created
        initDragScroll();
    } else {
        container.innerHTML = ""; 
    }
}

function scrollRow(distance) {
    const row = document.getElementById("relRow");
    if (row) {
        row.scrollBy({ left: distance, behavior: 'smooth' });
    }
}

function initDragScroll() {
    const slider = document.getElementById('relRow');
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.style.cursor = 'grabbing';
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => { isDown = false; slider.style.cursor = 'grab'; });
    slider.addEventListener('mouseup', () => { isDown = false; slider.style.cursor = 'grab'; });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2.5; 
        slider.scrollLeft = scrollLeft - walk;
    });
}

document.addEventListener("DOMContentLoaded", initProductPage);
