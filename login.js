// ============================================================
// LOGIN FORM HANDLER
// ============================================================
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    
    // Clear previous error messages
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
    
    try {
        // Send login request to server
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Login successful - redirect to home page
            window.location.href = 'index.html';
        } else {
            // Login failed - show error message
            errorMessage.textContent = data.error || 'Login failed';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        errorMessage.textContent = 'An error occurred. Please try again.';
        errorMessage.style.display = 'block';
        console.error('Login error:', error);
    }
});