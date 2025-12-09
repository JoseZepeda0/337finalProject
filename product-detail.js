// ============================================================
// PRODUCT DETAIL PAGE FUNCTIONS
// ============================================================

// Load product details from server
async function loadProductDetail() {
    // Get product ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        // No product ID - redirect to products page
        window.location.href = 'products.html';
        return;
    }
    
    try {
        // Fetch product from server
        const response = await fetch(`/api/products/${productId}`);
        
        if (!response.ok) {
            throw new Error('Product not found');
        }
        
        const product = await response.json();
        displayProductDetail(product);
    } catch (error) {
        console.error('Error loading product:', error);
        // Show error message
        document.getElementById('product-detail').innerHTML = `
            <div class="error-message" style="display: block;">
                Product not found. <a href="products.html">Back to products</a>
            </div>
        `;
    }
}

// Display product details on page
function displayProductDetail(product) {
    const container = document.getElementById('product-detail');
    
    container.innerHTML = `
        <div>
            <img src="${product.imageUrl}" alt="${product.name}" class="product-image-large" onerror="this.src='default.jpg'">
        </div>
        <div class="product-info">
            <h1>${product.name}</h1>
            <div class="price">${product.price.toFixed(2)}</div>
            <p class="description">${product.description}</p>
            <p><strong>Category:</strong> ${product.category}</p>
            <p><strong>Available Stock:</strong> ${product.stock}</p>
            
            ${product.stock > 0 ? `
                <div class="quantity-selector">
                    <label for="quantity">Quantity:</label>
                    <input type="number" id="quantity" min="1" max="${product.stock}" value="1">
                </div>
                <button id="add-to-cart-btn" class="btn btn-primary">Add to Cart</button>
            ` : `
                <p style="color: #e74c3c; font-weight: bold;">Out of Stock</p>
            `}
            
            <div id="cart-message" class="success-message" style="margin-top: 15px;"></div>
        </div>
    `;
    
    // Add to cart button event listener
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const quantity = parseInt(document.getElementById('quantity').value);
            
            // Validate quantity
            if (quantity > product.stock) {
                alert('Quantity exceeds available stock');
                return;
            }
            
            // Add to cart
            addToCart(product, quantity);
            
            // Show success message
            const cartMessage = document.getElementById('cart-message');
            cartMessage.textContent = `Added ${quantity} item(s) to cart!`;
            cartMessage.style.display = 'block';
            
            // Hide message after 3 seconds
            setTimeout(() => {
                cartMessage.style.display = 'none';
            }, 3000);
        });
    }
}

// ============================================================
// PAGE INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    loadProductDetail();
});