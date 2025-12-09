// ============================================================
// PROFILE PAGE FUNCTIONS
// ============================================================

let currentUser = null; // Store current user data

// Load user profile from server
async function loadProfile() {
    const isLoggedIn = await checkSession();
    
    if (!isLoggedIn) {
        // User not logged in - redirect to login
        window.location.href = 'login.html';
        return;
    }
    
    try {
        // Fetch user profile from server
        const response = await fetch('/api/user/current');
        currentUser = await response.json();
        
        displayProfile(currentUser);
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Display user profile information
function displayProfile(user) {
    const profileInfo = document.getElementById('profile-info');
    
    profileInfo.innerHTML = `
        <div class="form-group">
            <strong>Username:</strong> ${user.username}
        </div>
        <div class="form-group">
            <strong>Email:</strong> ${user.email}
        </div>
        <div class="form-group">
            <strong>Address:</strong> ${user.address || 'Not provided'}
        </div>
        <div class="form-group">
            <strong>Member Since:</strong> ${new Date(user.createdAt).toLocaleDateString()}
        </div>
    `;
}

// Show edit form
function showEditForm() {
    document.getElementById('profile-info').style.display = 'none';
    document.getElementById('edit-btn').style.display = 'none';
    document.getElementById('profile-form').style.display = 'block';
    
    // Pre-fill form with current data
    document.getElementById('email').value = currentUser.email;
    document.getElementById('address').value = currentUser.address || '';
}

// Hide edit form
function hideEditForm() {
    document.getElementById('profile-info').style.display = 'block';
    document.getElementById('edit-btn').style.display = 'block';
    document.getElementById('profile-form').style.display = 'none';
}

// Update profile - send changes to server
async function updateProfile(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    
    // Clear previous messages
    successMessage.textContent = '';
    successMessage.style.display = 'none';
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
    
    try {
        // Send update request to server
        const response = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, address })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Update successful - show message and reload
            successMessage.textContent = 'Profile updated successfully!';
            successMessage.style.display = 'block';
            
            setTimeout(() => {
                loadProfile();
                hideEditForm();
            }, 1500);
        } else {
            // Update failed - show error
            errorMessage.textContent = data.error || 'Failed to update profile';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        errorMessage.textContent = 'An error occurred. Please try again.';
        errorMessage.style.display = 'block';
        console.error('Update profile error:', error);
    }
}

// ============================================================
// PAGE INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    
    // Edit button event listener
    document.getElementById('edit-btn').addEventListener('click', showEditForm);
    
    // Cancel button event listener
    document.getElementById('cancel-btn').addEventListener('click', hideEditForm);
    
    // Form submit event listener
    document.getElementById('profile-form').addEventListener('submit', updateProfile);
});
