================================
TechStore E-Commerce Platform
================================

Authors:
Jose Zepeda
Jonatan Zavala

OVERVIEW
--------
Complete e-commerce web application with user authentication, product browsing,
shopping cart, and order management. Built with Node.js, Express, and vanilla JavaScript.

THREE MODULES
-------------
1. USER MODULE
   - User registration with password hashing
   - Login/logout with session management
   - User profile viewing and editing
   
2. PRODUCT MODULE
   - Product catalog browsing
   - Product search and filtering
   - Detailed product information
   - Stock management
   - Add/edit/delete products (admin)
   
3. ORDER MODULE
   - Shopping cart functionality
   - Checkout process
   - Order placement with stock validation
   - Order history viewing
   - Order status tracking

REQUIREMENTS
------------
- Node.js (version 12 or higher)
- npm (Node Package Manager)

INSTALLATION
------------
1. Extract all files to one folder (no subfolders needed)

2. Open terminal/command prompt in that folder

3. Install required packages:
   npm install express
   npm install express-session

FILE STRUCTURE (all in one folder)
-----------------------------------
server.js           - Backend server
index.html          - Home page
login.html          - Login page
register.html       - Registration page
products.html       - Products listing page
product-detail.html - Single product page
cart.html           - Shopping cart page
checkout.html       - Checkout page
orders.html         - Order history page
profile.html        - User profile page
style.css           - All styles
common.js           - Common functions (cart, auth)
home.js             - Home page logic
login.js            - Login page logic
register.js         - Registration page logic
products.js         - Products page logic
product-detail.js   - Product detail page logic
cart.js             - Cart page logic
checkout.js         - Checkout page logic
orders.js           - Orders page logic
profile.js          - Profile page logic
README.txt          - This file

DATA FILES (created automatically)
----------------------------------
users.json          - User accounts
products.json       - Product catalog
orders.json         - Order history

RUNNING THE APPLICATION
-----------------------
1. Open terminal in project folder

2. Start server:
   node server.js

3. Open browser and go to:
   http://localhost:8080

4. Done! Application is running

USING THE APPLICATION
---------------------
1. Click "Register" to create an account
2. Login with your username and password
3. Browse products on the home page or Products page
4. Click a product to view details
5. Add products to cart
6. View cart and proceed to checkout
7. Place order (must be logged in)
8. View order history in "Orders" page
9. Update profile in "Profile" page

DEFAULT PRODUCTS
----------------
Three sample products are pre-loaded:
- Wireless Mouse ($29.99)
- Mechanical Keyboard ($89.99)
- USB-C Cable ($12.99)

KEY FEATURES
------------
- Password hashing for security (SHA-256)
- Session management (1-hour timeout)
- JSON file data storage
- Shopping cart with localStorage
- Product search functionality
- Stock management
- Order tracking
- Responsive design

TECHNICAL DETAILS
-----------------
Backend:
- Node.js with Express framework
- Session management with express-session
- JSON file-based data storage
- RESTful API endpoints

Frontend:
- HTML5 for structure
- CSS3 for styling
- Vanilla JavaScript (no frameworks)
- localStorage for cart management

Data Storage:
- users.json: Stores user accounts
- products.json: Stores product catalog
- orders.json: Stores order history

Session Management:
- Server-side sessions using express-session
- 1-hour timeout period
- Secure session cookies

TROUBLESHOOTING
---------------
Problem: "Cannot find module 'express'"
Solution: Run: npm install express express-session

Problem: "Port 8080 already in use"
Solution: Either stop other application on port 8080,
         or change PORT in server.js (line 8)

Problem: Cart not working
Solution: Make sure JavaScript is enabled in browser
         and localStorage is not blocked

Problem: Session expired
Solution: Sessions expire after 1 hour. Just login again.

STOPPING THE SERVER
-------------------
Press Ctrl+C in the terminal where server is running

NOTES
-----
- All files must be in the SAME FOLDER
- Do not create subfolders for HTML, CSS, or JS files
- Server automatically creates data files on first run
- Cart data is stored in browser (persists across sessions)
- Sessions are stored in memory (lost on server restart)

SECURITY NOTES
--------------
This is an educational project. For production:
- Use a real database (MongoDB, PostgreSQL)
- Use HTTPS
- Add CSRF protection
- Implement rate limiting
- Use environment variables for secrets
- Add input validation
- Hash passwords with bcrypt (not SHA-256)

PROJECT STRUCTURE
-----------------
Server runs on port 8080
All HTML files served from root directory
API endpoints under /api/*
Static files (CSS, JS, images) served from root

CUSTOMIZATION
-------------
- Change port: Modify PORT in server.js (line 8)
- Add products: Edit products.json or use API
- Session timeout: Modify maxAge in server.js (line 16)
- Styling: Edit style.css
