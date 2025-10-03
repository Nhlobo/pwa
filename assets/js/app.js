// Register Service Worker (adjusted for GitHub Pages)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/pwa/sw.js")
    .then(() => console.log("Service Worker registered"))
    .catch(err => console.error("Service Worker registration failed:", err));
}

// PWA Install Prompt
let deferredPrompt;
const installPrompt = document.getElementById("installPrompt");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installPrompt) {
    installPrompt.style.display = "block";
  }
});

if (installPrompt) {
  installPrompt.addEventListener("click", async () => {
    if (installPrompt) {
      installPrompt.style.display = "none";
    }
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log("User choice:", outcome);
      deferredPrompt = null;
    }
  });
}

const BACKEND_URL = "https://your-backend-url.onrender.com/api"; // PLACEHOLDER: Replace with your Render backend URL

// Dark Mode Toggle
document.querySelector('.dark-mode-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// Section Navigation with Smooth Scroll
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    updateUIForSection(sectionId);
}

// Update UI based on active section
function updateUIForSection(sectionId) {
    const profileAvatar = document.getElementById('profileAvatar');
    const navIcons = document.querySelector('.nav-icons');
    const footerLinks = document.getElementById('footerLinks');

    if (sectionId === 'dashboard' || sectionId === 'report') {
        profileAvatar.classList.add('logged-in');
    } else {
        profileAvatar.classList.remove('logged-in');
    }

    if (sectionId === 'dashboard' || sectionId === 'report') {
        navIcons.innerHTML = `
            <button class="dark-mode-toggle" aria-label="Toggle dark mode">
                <i class="fas fa-moon"></i>
            </button>
            <i class="fas fa-bell icon"></i>
            <div class="profile-avatar logged-in" id="profileAvatar"></div>
        `;
    } else {
        navIcons.innerHTML = `
            <button class="dark-mode-toggle" aria-label="Toggle dark mode">
                <i class="fas fa-moon"></i>
            </button>
            <i class="fas fa-bell icon"></i>
            <i class="fas fa-user icon" onclick="showSection('login')"></i>
            <div class="profile-avatar" id="profileAvatar"></div>
        `;
    }

    if (sectionId === 'about') {
        footerLinks.style.display = 'none';
    } else {
        footerLinks.style.display = 'flex';
    }

    // Reattach dark mode toggle event
    document.querySelector('.dark-mode-toggle').addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });
}

// Form Submission Handling
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const sectionId = form.closest('section').id;
        
        if (sectionId === 'login') {
            await handleLogin(form);
        } else if (sectionId === 'register') {
            await handleRegister(form);
        }
    });
});

// Handle login
async function handleLogin(form) {
    const email = form.querySelector('#email')?.value;
    const password = form.querySelector('#password')?.value;
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    try {
        const response = await fetch(`${BACKEND_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) throw new Error('Login failed');
        
        const data = await response.json();
        
        // Store token and user data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify({
            userId: data.userId,
            email: data.email,
            fullName: data.fullName,
            role: data.role
        }));
        
        // Redirect to appropriate dashboard
        window.location.href = `dashboard/${data.role.toLowerCase()}.html`;
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please check your credentials.');
    }
}

// Handle registration
async function handleRegister(form) {
    const fullName = form.querySelector('#fullname')?.value;
    const email = form.querySelector('#regemail')?.value;
    const password = form.querySelector('#regpassword')?.value;
    const phone = form.querySelector('#phone')?.value;
    const role = form.querySelector('#role')?.value;
    
    if (!fullName || !email || !password || !role) {
        alert('Please fill in all required fields');
        return;
    }
    
    try {
        const response = await fetch(`${BACKEND_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName,
                email,
                password,
                phone,
                role: role.toUpperCase()
            })
        });
        
        if (!response.ok) throw new Error('Registration failed');
        
        const data = await response.json();
        
        // Store token and user data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify({
            userId: data.userId,
            email: data.email,
            fullName: data.fullName,
            role: data.role
        }));
        
        // Redirect to appropriate dashboard
        window.location.href = `dashboard/${data.role.toLowerCase()}.html`;
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
    }
}

// Initialize
showSection('home');
