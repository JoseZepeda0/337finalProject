// ============================================================
// ORDERS PAGE FUNCTIONS
// ============================================================

// Load user orders from server
async function loadOrders() {
    const isLoggedIn = await checkSession();
    
    if (!isLoggedIn) {
        // User not logged in - redirect to login
        window.location.href = 'login.html';
        return;
    }
    
    try {
        // Fetch orders from server
        const response = await fetch('/api/orders');
        const orders = await response.json();
        
        displayOrders(orders);
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

// Display orders on page
function displayOrders(orders) {
    const ordersContainer = document.getElementById('orders-container');
    const noOrders = document.getElementById('no-orders');
    
    if (orders.length === 0) {
        // No orders - show message
        ordersContainer.style.display = 'none';
        noOrders.style.display = 'block';
        return;
    }
    
    // Orders exist - display them
    ordersContainer.style.display = 'block';
    noOrders.style.display = 'none';
    
    ordersContainer.innerHTML = '';
    
    // Sort orders by date (newest first)
    orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    
    // Create HTML for each order
    orders.forEach(order => {
        const orderCard = createOrderCard(order);
        ordersContainer.appendChild(orderCard);
    });
}

// Create order card HTML element
function createOrderCard(order) {
    const card = document.createElement('div');
    card.className = 'order-card';
    
    const orderDate = new Date(order.orderDate).toLocaleDateString();
    
    // Create HTML for order items
    let itemsHTML = '';
    order.items.forEach(item => {
        itemsHTML += `
            <div class="order-item">
                <div>
                    <strong>${item.productName}</strong> x ${item.quantity}
                </div>
                <div>${(item.priceAtPurchase * item.quantity).toFixed(2)}</div>
            </div>
        `;
    });
    
    // Complete order card HTML
    card.innerHTML = `
        <div class="order-header">
            <div>
                <strong>Order ID:</strong> ${order.id}<br>
                <strong>Date:</strong> ${orderDate}
            </div>
            <div>
                <span class="order-status ${order.status}">${order.status.toUpperCase()}</span>
            </div>
        </div>
        ${itemsHTML}
        <div class="order-total">
            Total: ${order.totalAmount.toFixed(2)}
        </div>
    `;
    
    return card;
}

// ============================================================
// PAGE INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
});