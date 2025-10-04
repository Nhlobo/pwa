// PowerBack Dashboard Common Functionality
// Frontend-only authentication and utilities

// Authentication utilities
const Auth = {
    getToken() {
        return localStorage.getItem('authToken');
    },
    
    setToken(token) {
        localStorage.setItem('authToken', token);
    },
    
    removeToken() {
        localStorage.removeItem('authToken');
    },
    
    getUserData() {
        const data = localStorage.getItem('userData');
        return data ? JSON.parse(data) : null;
    },
    
    setUserData(data) {
        localStorage.setItem('userData', JSON.stringify(data));
    },
    
    isAuthenticated() {
        return !!this.getToken();
    },
    
    logout() {
        this.removeToken();
        localStorage.removeItem('userData');
        window.location.href = '/pwa/index.html';
    }
};

// Initialize dashboard
function initializeDashboard() {
    // Check authentication
    if (!Auth.isAuthenticated()) {
        window.location.href = '/pwa/index.html';
        return;
    }
    
    // Display user info
    const userData = Auth.getUserData();
    if (userData) {
        const userNameElement = document.getElementById('userName');
        const userRoleElement = document.getElementById('userRole');
        const userAvatarElement = document.getElementById('userAvatar');
        
        if (userNameElement) userNameElement.textContent = userData.fullName;
        if (userRoleElement) userRoleElement.textContent = userData.role;
        if (userAvatarElement && userData.fullName) {
            userAvatarElement.textContent = userData.fullName.charAt(0).toUpperCase();
        }
    }
}

// Toast notification
function showToast(title, message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <strong>${title}</strong>
        <p>${message}</p>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Logout handler
function handleLogout() {
    Auth.logout();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeDashboard);
