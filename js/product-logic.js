/**
 * AFFILIXS PRODUCT PAGE LOGIC
 * Purpose: Handles hero updates, similar products row, and navigation.
 */

async function initProductPage() {
    try {
        // 1. Fetch the data with a cache-buster
        const response = await fetch("Data/products.json?v=" + Date.now());
        const allProducts = await response.json();

        // 2. Identify the product from the URL (or default to first product)
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        const currentProduct = allProducts.find(p => p.id == productId) || allProducts[0];

        // 3. Initial Load
        updateProductUI(currentProduct);
        renderSimilarProducts(allProducts, currentProduct);

    } catch (error) {
        console.error("AffilixS Error: Could not initialize product page.", error);
    }
}

/**
 * Updates the Hero Image, Description, and Stats
 */
function updateProductUI(product) {
    // Basic Details
    document.getElementById("heroImage").src = product.image;
    document.getElementById("pName").innerText = product.name;
    document.getElementById("pDesc").innerText = product.fullDescription;
    
    // Stats & Price
    // Ensure these IDs exist in your HTML sidebar-action-col
    const priceElem = document.getElementById("pPrice");
    if (priceElem) priceElem.innerText = (product.currency || "$") + product.price;
    
    const buyBtn = document.getElementById("buyBtn");
    if (buyBtn) buyBtn.href = product.affiliateLink;

    // RULE: Follow the action - Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update URL without reloading page
    const newUrl = window.location.pathname + '?id=' + product.id;
    window.history.pushState({ path: newUrl }, '', newUrl);
}

/**
 * Renders the "Similar Discoveries" Row
 */
function renderSimilarProducts(allProducts, currentProduct) {
    const container = document.getElementById("productRowsContainer");
    if (!container) return;

    // Filter for same category, excluding the one currently being viewed
    const similar = allProducts.filter(p => p.category === currentProduct.category && p.id !== currentProduct.id);

    if (similar.length > 0) {
        container.innerHTML = `
            <div class="row-wrapper">
                <h2 class="row-title">Similar Discoveries</h2>
                <div class="product-row" id="relRow"></div>
                <!-- RED ARROWS - Pinned via CSS -->
                <button class="arrow-btn l" onclick="scrollRow(-350)">←</button>
                <button class="arrow-btn r" onclick="scrollRow(350)">→</button>
            </div>`;

        const row = document.getElementById("relRow");
        similar.forEach(item => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <img src="${item.image}" alt="${item.shortName}">
                <div class="short-name">${item.shortName}</div>
            `;
            card.onclick = () => updateProductUI(item);
            row.appendChild(card);
        });
    } else {
        container.innerHTML = ""; // Clear if no similar products found
    }
}

/**
 * Helper: Manual Scroll for Red Arrows
 */
function scrollRow(distance) {
    const row = document.getElementById("relRow");
    if (row) {
        row.scrollBy({ left: distance, behavior: 'smooth' });
    }
}

// Initialize on load
document.addEventListener("DOMContentLoaded", initProductPage);
