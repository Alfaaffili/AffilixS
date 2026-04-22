/* =============================================================
   PRODUCT LOGIC ENGINE (v1.0 - Data Injection & Exchange)
   ============================================================= */

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Capture the Product ID from the URL
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id'); 
    
    // 2. Fetch the existing JSON
    const response = await fetch('Data/products.json?v=1.3.1');
    const products = await response.json();
    
    // 3. Initialize Page
    if (productId) {
        renderProduct(productId, products);
    } else {
        // Fallback if no ID is found
        renderProduct(products[0].id, products);
    }
});

function renderProduct(id, allProducts) {
    const product = allProducts.find(p => p.id === id);
    if (!product) return;

    // A. Update Main Hero Content
    document.getElementById('main-img').src = product.image;
    document.getElementById('prod-name').innerText = product.name;
    document.getElementById('prod-brand').innerText = product.brand;
    document.getElementById('prod-price').innerText = `${product.currency} ${product.price}`;
    document.getElementById('buy-btn').href = product.affiliateLink;

    // B. Update Intel/Description Section
    document.getElementById('full-desc').innerText = product.fullDescription || "A premium curated selection by AffilixS.";
    
    // C. Update Specifications List
    const specsContainer = document.getElementById('specs-list');
    specsContainer.innerHTML = "";
    if (product.specifications) {
        Object.entries(product.specifications).forEach(([key, value]) => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${key}</strong> <span>${value}</span>`;
            specsContainer.appendChild(li);
        });
    }

    // D. Update Sibling Exchange Row
    const siblings = allProducts.filter(p => p.category === product.category && p.id !== product.id);
    const row = document.getElementById('sibling-row');
    row.innerHTML = "";
    
    siblings.forEach(s => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.cursor = 'pointer';
        card.innerHTML = `
            <img src="${s.image}" alt="${s.shortName}">
            <div class="card-info" style="padding:10px; text-align:center;">
                <h4 style="font-size:0.8rem;">${s.shortName}</h4>
            </div>
        `;
        
        // --- THE EXCHANGE TRIGGER ---
        card.onclick = () => {
            // Update URL without reloading page
            window.history.pushState({}, '', `?id=${s.id}`);
            // Swap content
            renderProduct(s.id, allProducts);
            // Smooth scroll to top to see the new Hero
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        row.appendChild(card);
    });
}
