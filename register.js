// ============================================================
// REGISTRATION FORM HANDLER
// ============================================================
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form values
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const address = document.getElementById('address').value;
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    
    // Clear previous messages
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
    successMessage.textContent = '';
    successMessage.style.display = 'none';
    
    try {
        // Send registration request to server
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password, address })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Registration successful - show message and redirect
            successMessage.textContent = 'Registration successful! Redirecting to login...';
            successMessage.style.display = 'block';
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            // Registration failed - show error message
            errorMessage.textContent = data.error || 'Registration failed';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        errorMessage.textContent = 'An error occurred. Please try again.';
        errorMessage.style.display = 'block';
        console.error('Registration error:', error);
    }
});