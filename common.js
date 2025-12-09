
// ============================================================
// SESSION MANAGEMENT FUNCTIONS
// ============================================================

// Check if user is logged in and update navigation UI
async function checkSession() {
    try {
        const response = await fetch('/api/session/check');
        const data = await response.json();
        
        if (data.loggedIn) {
            // User is logged in - show user links, hide auth links
            document.getElementById('auth-links')?.style.setProperty('display', 'none');
            document.getElementById('user-links')?.style.setProperty('display', 'flex');
            return true;
        } else {
            // User is NOT logged in - show auth links, hide user links
            document.getElementById('auth-links')?.style.setProperty('display', 'flex');
            document.getElementById('user-links')?.style.setProperty('display', 'none');
            return false;
        }
    } catch (error) {
        console.error('Error checking session:', error);
        return false;
    }
}

// Logout user
async function logout() {
    try {
        const response = await fetch('/api/logout', {
            method: 'POST'
        });
        
        if (response.ok) {
            // Clear cart and redirect to home page
            localStorage.removeItem('cart');
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

// ============================================================
// SHOPPING CART FUNCTIONS (using localStorage)
// ============================================================

// Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Add product to cart
function addToCart(product, quantity = 1) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        // Product already in cart - increase quantity
        existingItem.quantity += quantity;
    } else {
        // New product - add to cart
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: quantity
        });
    }
    
    saveCart(cart);
    return true;
}

// Remove product from cart
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
}

// Update product quantity in cart
function updateCartQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
            // Remove item if quantity is 0 or less
            removeFromCart(productId);
        } else {
            saveCart(cart);
        }
    }
}

// Clear entire cart
function clearCart() {
    localStorage.removeItem('cart');
    updateCartCount();
}

// Update cart count badge in navigation
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

// ============================================================
// PAGE INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
    // Check session status
    await checkSession();
    
    // Update cart count
    updateCartCount();
    
    // Add logout event listener
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
});