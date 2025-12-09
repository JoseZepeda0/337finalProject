// ============================================================
// CART PAGE FUNCTIONS
// ============================================================

// Display cart items on page
function displayCart() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    const cartSummary = document.getElementById('cart-summary');
    
    if (cart.length === 0) {
        // Cart is empty - show empty message
        cartItemsContainer.style.display = 'none';
        cartSummary.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }
    
    // Cart has items - display them
    cartItemsContainer.style.display = 'block';
    cartSummary.style.display = 'block';
    emptyCart.style.display = 'none';
    
    cartItemsContainer.innerHTML = '';
    
    let totalItems = 0;
    let totalPrice = 0;
    
    // Create HTML for each cart item
    cart.forEach(item => {
        const itemElement = createCartItem(item);
        cartItemsContainer.appendChild(itemElement);
        
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;
    });
    
    // Update summary
    document.getElementById('total-items').textContent = totalItems;
    document.getElementById('total-price').textContent = totalPrice.toFixed(2);
}

// Create cart item HTML element
function createCartItem(item) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    
    div.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='default.jpg'">
        <div class="cart-item-details">
            <h3>${item.name}</h3>
            <div class="cart-item-price">${item.price.toFixed(2)}</div>
            <div>
                <label>Quantity: </label>
                <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
            </div>
            <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
        </div>
        <div class="cart-item-actions">
            <button class="btn btn-danger remove-btn" data-id="${item.id}">Remove</button>
        </div>
    `;
    
    // Quantity change event listener
    const quantityInput = div.querySelector('.quantity-input');
    quantityInput.addEventListener('change', (e) => {
        const newQuantity = parseInt(e.target.value);
        if (newQuantity > 0) {
            updateCartQuantity(item.id, newQuantity);
            displayCart();
        }
    });
    
    // Remove button event listener
    const removeBtn = div.querySelector('.remove-btn');
    removeBtn.addEventListener('click', () => {
        removeFromCart(item.id);
        displayCart();
    });
    
    return div;
}

// Proceed to checkout - check if user is logged in first
async function proceedToCheckout() {
    const isLoggedIn = await checkSession();
    
    if (!isLoggedIn) {
        alert('Please login to proceed with checkout');
        window.location.href = 'login.html';
        return;
    }
    
    window.location.href = 'checkout.html';
}

// ============================================================
// PAGE INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    displayCart();
    
    // Checkout button event listener
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
});