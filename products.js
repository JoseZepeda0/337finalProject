// ============================================================
// PRODUCTS PAGE FUNCTIONS
// ============================================================

let allProducts = []; // Store all products for filtering

// Load all products from server
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        allProducts = await response.json();
        displayProducts(allProducts);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Display products on the page
function displayProducts(products) {
    const container = document.getElementById('products-container');
    const noProducts = document.getElementById('no-products');
    
    container.innerHTML = '';
    
    if (products.length === 0) {
        // No products found - show message
        container.style.display = 'none';
        noProducts.style.display = 'block';
        return;
    }
    
    // Products found - display them
    container.style.display = 'grid';
    noProducts.style.display = 'none';
    
    products.forEach(product => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
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

// Search products by query
async function searchProducts(query) {
    if (!query.trim()) {
        // Empty search - show all products
        displayProducts(allProducts);
        return;
    }
    
    try {
        // Send search request to server
        const response = await fetch(`/api/products/search/${encodeURIComponent(query)}`);
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error searching products:', error);
    }
}

// ============================================================
// PAGE INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    
    // Search button click handler
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    
    searchBtn.addEventListener('click', () => {
        searchProducts(searchInput.value);
    });
    
    // Search on Enter key press
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchProducts(searchInput.value);
        }
    });
    
    // Check for category filter in URL (from home page categories)
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (category) {
        searchProducts(category);
    }
});