// ============================================================
// CHECKOUT PAGE FUNCTIONS
// ============================================================

// Initialize checkout page - verify user is logged in and has items in cart
async function initCheckout() {
    const isLoggedIn = await checkSession();
    
    if (!isLoggedIn) {
        // User not logged in - redirect to login
        window.location.href = 'login.html';
        return;
    }
    
    const cart = getCart();
    
    if (cart.length === 0) {
        // Cart is empty - redirect to cart page
        window.location.href = 'cart.html';
        return;
    }
    
    displayOrderReview(cart);
}

// Display order review (items to be ordered)
function displayOrderReview(cart) {
    const orderItemsContainer = document.getElementById('order-items');
    let totalPrice = 0;
    
    orderItemsContainer.innerHTML = '';
    
    // Display each cart item
    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'order-item';
        itemDiv.innerHTML = `
            <div>
                <strong>${item.name}</strong> x ${item.quantity}
            </div>
            <div>${(item.price * item.quantity).toFixed(2)}</div>
        `;
        orderItemsContainer.appendChild(itemDiv);
        
        totalPrice += item.price * item.quantity;
    });
    
    document.getElementById('order-total').textContent = totalPrice.toFixed(2);
}

// Place order - send to server
async function placeOrder() {
    const cart = getCart();
    const placeOrderBtn = document.getElementById('place-order-btn');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    
    // Clear previous messages
    successMessage.textContent = '';
    successMessage.style.display = 'none';
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
    
    // Disable button while processing
    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = 'Processing...';
    
    // Format cart items for API
    const items = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity
    }));
    
    try {
        // Send order to server
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ items })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Order successful - clear cart and redirect
            clearCart();
            successMessage.textContent = `Order placed successfully! Order ID: ${data.order.id}`;
            successMessage.style.display = 'block';
            
            setTimeout(() => {
                window.location.href = 'orders.html';
            }, 2000);
        } else {
            // Order failed - show error
            errorMessage.textContent = data.error || 'Failed to place order';
            errorMessage.style.display = 'block';
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = 'Place Order';
        }
    } catch (error) {
        errorMessage.textContent = 'An error occurred. Please try again.';
        errorMessage.style.display = 'block';
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = 'Place Order';
        console.error('Checkout error:', error);
    }
}

// ============================================================
// PAGE INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    initCheckout();
    
    // Place order button event listener
    const placeOrderBtn = document.getElementById('place-order-btn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', placeOrder);
    }
});