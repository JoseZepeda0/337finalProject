const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 8080;

// ============================================================
// MIDDLEWARE SETUP
// ============================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.')); // Serve all files from current directory
app.use(session({
    secret: 'ecommerce-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // 1 hour
}));

// ============================================================
// DATA FILE INITIALIZATION
// ============================================================
const USERS_FILE = 'users.json';
const PRODUCTS_FILE = 'products.json';
const ORDERS_FILE = 'orders.json';

// Initialize files if they don't exist
function initFile(filePath, defaultData) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
}

// Initialize users file
initFile(USERS_FILE, []);

// Initialize products file with sample data
initFile(PRODUCTS_FILE, [
    {
        id: 'prod001',
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with 2.4GHz connectivity',
        price: 29.99,
        stock: 50,
        category: 'Electronics',
        imageUrl: "mouse.jpg"
    },
    {
        id: 'prod002',
        name: 'Mechanical Keyboard',
        description: 'RGB mechanical keyboard with blue switches',
        price: 89.99,
        stock: 30,
        category: 'Electronics',
        imageUrl: "keyboard.jpg"
    },
    {
        id: 'prod003',
        name: 'USB-C Cable',
        description: 'Fast charging USB-C cable, 6ft length',
        price: 12.99,
        stock: 100,
        category: 'Accessories',
        imageUrl: "cable.jpg"
    }
]);

// Initialize orders file
initFile(ORDERS_FILE, []);

// ============================================================
// HELPER FUNCTIONS
// ============================================================

// Read JSON file
function readJSON(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Write to JSON file
function writeJSON(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Hash password using SHA-256
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// Generate unique ID
function generateId(prefix) {
    return prefix + Date.now() + Math.random().toString(36).substr(2, 9);
}

// Authentication middleware - checks if user is logged in
function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}

// ============================================================
// USER MODULE ROUTES
// ============================================================

// Register new user
app.post('/api/register', (req, res) => {
    const { username, password, email, address } = req.body;
    
    // Validate required fields
    if (!username || !password || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const users = readJSON(USERS_FILE);
    
    // Check if username already exists
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ error: 'Username already exists' });
    }
    
    // Create new user object
    const newUser = {
        id: generateId('user'),
        username,
        password: hashPassword(password),
        email,
        address: address || '',
        role: 'buyer',
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    writeJSON(USERS_FILE, users);
    
    res.json({ message: 'Registration successful', userId: newUser.id });
});

// Login user
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    const users = readJSON(USERS_FILE);
    const user = users.find(u => u.username === username && u.password === hashPassword(password));
    
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Create session
    req.session.userId = user.id;
    req.session.username = user.username;
    
    res.json({ message: 'Login successful', user: { id: user.id, username: user.username } });
});

// Logout user
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logout successful' });
});

// Get current logged-in user
app.get('/api/user/current', requireAuth, (req, res) => {
    const users = readJSON(USERS_FILE);
    const user = users.find(u => u.id === req.session.userId);
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
});

// Update user profile
app.put('/api/user/profile', requireAuth, (req, res) => {
    const { email, address } = req.body;
    const users = readJSON(USERS_FILE);
    const userIndex = users.findIndex(u => u.id === req.session.userId);
    
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    // Update user information
    if (email) users[userIndex].email = email;
    if (address) users[userIndex].address = address;
    
    writeJSON(USERS_FILE, users);
    res.json({ message: 'Profile updated successfully' });
});

// ============================================================
// PRODUCT MODULE ROUTES
// ============================================================

// Get all products
app.get('/api/products', (req, res) => {
    const products = readJSON(PRODUCTS_FILE);
    res.json(products);
});

// Get single product by ID
app.get('/api/products/:id', (req, res) => {
    const products = readJSON(PRODUCTS_FILE);
    const product = products.find(p => p.id === req.params.id);
    
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
});

// Search products by name, description, or category
app.get('/api/products/search/:query', (req, res) => {
    const products = readJSON(PRODUCTS_FILE);
    const query = req.params.query.toLowerCase();
    
    const results = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
    
    res.json(results);
});

// Add new product (requires authentication)
app.post('/api/products', requireAuth, (req, res) => {
    const { name, description, price, stock, category, imageUrl } = req.body;
    
    // Validate required fields
    if (!name || !price || stock === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const products = readJSON(PRODUCTS_FILE);
    
    // Create new product object
    const newProduct = {
        id: generateId('prod'),
        name,
        description: description || '',
        price: parseFloat(price),
        stock: parseInt(stock),
        category: category || 'General',
        imageUrl: imageUrl || 'default.jpg',
        createdAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    writeJSON(PRODUCTS_FILE, products);
    
    res.json({ message: 'Product added successfully', product: newProduct });
});

// Update existing product
app.put('/api/products/:id', requireAuth, (req, res) => {
    const { name, description, price, stock, category, imageUrl } = req.body;
    const products = readJSON(PRODUCTS_FILE);
    const productIndex = products.findIndex(p => p.id === req.params.id);
    
    if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    // Update product fields if provided
    if (name) products[productIndex].name = name;
    if (description) products[productIndex].description = description;
    if (price) products[productIndex].price = parseFloat(price);
    if (stock !== undefined) products[productIndex].stock = parseInt(stock);
    if (category) products[productIndex].category = category;
    if (imageUrl) products[productIndex].imageUrl = imageUrl;
    
    writeJSON(PRODUCTS_FILE, products);
    res.json({ message: 'Product updated successfully', product: products[productIndex] });
});

// Delete product
app.delete('/api/products/:id', requireAuth, (req, res) => {
    const products = readJSON(PRODUCTS_FILE);
    const filteredProducts = products.filter(p => p.id !== req.params.id);
    
    if (products.length === filteredProducts.length) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    writeJSON(PRODUCTS_FILE, filteredProducts);
    res.json({ message: 'Product deleted successfully' });
});

// ============================================================
// ORDER MODULE ROUTES
// ============================================================

// Create new order
app.post('/api/orders', requireAuth, (req, res) => {
    const { items } = req.body; // items = [{ productId, quantity }]
    
    // Validate order has items
    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'No items in order' });
    }
    
    const products = readJSON(PRODUCTS_FILE);
    const orders = readJSON(ORDERS_FILE);
    
    let totalAmount = 0;
    const orderItems = [];
    
    // Validate each item and calculate total
    for (const item of items) {
        const product = products.find(p => p.id === item.productId);
        
        // Check if product exists
        if (!product) {
            return res.status(404).json({ error: `Product ${item.productId} not found` });
        }
        
        // Check if enough stock available
        if (product.stock < item.quantity) {
            return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
        }
        
        // Add to order items
        orderItems.push({
            productId: product.id,
            productName: product.name,
            quantity: item.quantity,
            priceAtPurchase: product.price
        });
        
        totalAmount += product.price * item.quantity;
        
        // Update product stock
        product.stock -= item.quantity;
    }
    
    // Create new order object
    const newOrder = {
        id: generateId('order'),
        userId: req.session.userId,
        items: orderItems,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        status: 'pending',
        orderDate: new Date().toISOString()
    };
    
    orders.push(newOrder);
    writeJSON(ORDERS_FILE, orders);
    writeJSON(PRODUCTS_FILE, products); // Save updated stock
    
    res.json({ message: 'Order placed successfully', order: newOrder });
});

// Get all orders for current user
app.get('/api/orders', requireAuth, (req, res) => {
    const orders = readJSON(ORDERS_FILE);
    const userOrders = orders.filter(o => o.userId === req.session.userId);
    res.json(userOrders);
});

// Get single order by ID
app.get('/api/orders/:id', requireAuth, (req, res) => {
    const orders = readJSON(ORDERS_FILE);
    const order = orders.find(o => o.id === req.params.id && o.userId === req.session.userId);
    
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
});

// Update order status
app.put('/api/orders/:id/status', requireAuth, (req, res) => {
    const { status } = req.body;
    const orders = readJSON(ORDERS_FILE);
    const orderIndex = orders.findIndex(o => o.id === req.params.id);
    
    if (orderIndex === -1) {
        return res.status(404).json({ error: 'Order not found' });
    }
    
    orders[orderIndex].status = status;
    writeJSON(ORDERS_FILE, orders);
    
    res.json({ message: 'Order status updated', order: orders[orderIndex] });
});

// ============================================================
// SESSION CHECK ROUTE
// ============================================================
app.get('/api/session/check', (req, res) => {
    if (req.session.userId) {
        res.json({ loggedIn: true, userId: req.session.userId, username: req.session.username });
    } else {
        res.json({ loggedIn: false });
    }
});

// ============================================================
// START SERVER
// ============================================================
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});