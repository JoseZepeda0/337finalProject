// ============================================================
// HOME PAGE FUNCTIONS
// ============================================================

// Load featured products (first 3 products)
async function loadFeaturedProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        
        const container = document.getElementById('featured-products');
        container.innerHTML = '';
        
        // Display first 3 products as featured
        products.slice(0, 3).forEach(product => {
            const productCard = createProductCard(product);
            container.appendChild(productCard);
        });
    } catch (error) {
        console.error('Error loading featured products:', error);
    }
}

// Create product card HTML element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.name}" onerror="this.src='default.jpg'">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-price">${product.price.toFixed(2)}</div>
        <div class="product-stock">Stock: ${product.stock}</div>
        <a href="product-detail.html?id=${product.id}" class="btn btn-primary">View Details</a>
    `;
    
    return card;
}

// ============================================================
// PAGE INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedProducts();
});