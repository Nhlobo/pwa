// PowerBack Dashboard Common Functionality
// JWT Authentication, WebSocket, API calls

// PLACEHOLDER: Replace with your actual backend URL (Render deployment URL)
const API_BASE_URL = 'https://your-backend-url.onrender.com/api';
const WS_URL = 'wss://your-backend-url.onrender.com/ws';

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

// API client with JWT
const API = {
    async request(endpoint, options = {}) {
        const token = Auth.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers
            });
            
            if (response.status === 401) {
                Auth.logout();
                throw new Error('Unauthorized');
            }
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'API request failed');
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    
    async get(endpoint) {
        return this.request(endpoint);
    },
    
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }
};

// WebSocket connection for real-time updates
class WebSocketManager {
    constructor() {
        this.socket = null;
        this.stompClient = null;
        this.connected = false;
        this.messageHandlers = new Map();
    }
    
    connect(onConnect) {
        if (this.connected) return;
        
        try {
            // Using SockJS and STOMP for WebSocket connection
            const socket = new SockJS(`${API_BASE_URL.replace('/api', '')}/ws`);
            this.stompClient = Stomp.over(socket);
            
            this.stompClient.connect({
                'Authorization': `Bearer ${Auth.getToken()}`
            }, (frame) => {
                console.log('WebSocket Connected:', frame);
                this.connected = true;
                if (onConnect) onConnect();
            }, (error) => {
                console.error('WebSocket Error:', error);
                this.connected = false;
                // Retry connection after 5 seconds
                setTimeout(() => this.connect(onConnect), 5000);
            });
        } catch (error) {
            console.error('WebSocket Connection Error:', error);
        }
    }
    
    subscribe(topic, handler) {
        if (!this.connected || !this.stompClient) {
            console.warn('WebSocket not connected. Attempting to connect...');
            this.connect(() => this.subscribe(topic, handler));
            return;
        }
        
        const subscription = this.stompClient.subscribe(topic, (message) => {
            const data = JSON.parse(message.body);
            handler(data);
        });
        
        this.messageHandlers.set(topic, subscription);
    }
    
    unsubscribe(topic) {
        const subscription = this.messageHandlers.get(topic);
        if (subscription) {
            subscription.unsubscribe();
            this.messageHandlers.delete(topic);
        }
    }
    
    disconnect() {
        if (this.stompClient && this.connected) {
            this.stompClient.disconnect();
            this.connected = false;
        }
    }
}

const wsManager = new WebSocketManager();

// Notification manager
const NotificationManager = {
    notifications: [],
    unreadCount: 0,
    
    async fetch() {
        try {
            this.notifications = await API.get('/notifications');
            this.unreadCount = this.notifications.filter(n => !n.read).length;
            this.updateUI();
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    },
    
    async markAsRead(notificationId) {
        try {
            await API.put(`/notifications/${notificationId}/read`);
            const notification = this.notifications.find(n => n.id === notificationId);
            if (notification) {
                notification.read = true;
                this.unreadCount = this.notifications.filter(n => !n.read).length;
                this.updateUI();
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    },
    
    updateUI() {
        const badge = document.getElementById('notificationBadge');
        const list = document.getElementById('notificationList');
        
        if (badge) {
            badge.textContent = this.unreadCount;
            badge.style.display = this.unreadCount > 0 ? 'block' : 'none';
        }
        
        if (list) {
            this.renderNotifications(list);
        }
    },
    
    renderNotifications(container) {
        if (this.notifications.length === 0) {
            container.innerHTML = '<div class="empty-state">No notifications</div>';
            return;
        }
        
        container.innerHTML = this.notifications.map(notification => `
            <div class="notification-item ${notification.read ? 'read' : 'unread'}" 
                 onclick="NotificationManager.markAsRead(${notification.id})">
                <div class="notification-header">
                    <strong>${notification.title}</strong>
                    <span class="notification-time">${this.formatTime(notification.createdAt)}</span>
                </div>
                <p>${notification.message}</p>
            </div>
        `).join('');
    },
    
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    }
};

// Analytics tracking
const Analytics = {
    track(eventType, eventData = {}) {
        try {
            API.post('/analytics/track', {
                eventType,
                eventData: JSON.stringify(eventData)
            }).catch(err => console.error('Analytics error:', err));
        } catch (error) {
            console.error('Analytics tracking error:', error);
        }
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
        
        if (userNameElement) userNameElement.textContent = userData.fullName;
        if (userRoleElement) userRoleElement.textContent = userData.role;
    }
    
    // Fetch notifications
    NotificationManager.fetch();
    
    // Connect WebSocket for real-time updates
    wsManager.connect(() => {
        console.log('WebSocket connected successfully');
        
        // Subscribe to personal notifications
        wsManager.subscribe(`/queue/notifications`, (notification) => {
            NotificationManager.notifications.unshift(notification);
            NotificationManager.unreadCount++;
            NotificationManager.updateUI();
            showToast(notification.title, notification.message);
        });
        
        // Subscribe to incident updates
        wsManager.subscribe('/topic/incidents', (incident) => {
            console.log('New incident update:', incident);
            if (typeof onIncidentUpdate === 'function') {
                onIncidentUpdate(incident);
            }
        });
    });
    
    // Track page view
    Analytics.track('page_view', { page: window.location.pathname });
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
    wsManager.disconnect();
    Auth.logout();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeDashboard);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    wsManager.disconnect();
});
