// Register Service Worker (adjusted for GitHub Pages)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/pwa/service-worker.js")
    .then(() => console.log("Service Worker registered"));
}

// PWA Install Prompt
let deferredPrompt;
const installPrompt = document.getElementById("installPrompt");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installPrompt.style.display = "block";
});

installPrompt.addEventListener("click", async () => {
  installPrompt.style.display = "none";
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log("User choice:", outcome);
  deferredPrompt = null;
});

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

// Handle login (Frontend only - for demonstration)
async function handleLogin(form) {
    const email = form.querySelector('#email')?.value;
    const password = form.querySelector('#password')?.value;
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Frontend-only demo: Store user data locally
    // In a real application, this would authenticate with a backend
    const userData = {
        userId: 'demo-user-' + Date.now(),
        email: email,
        fullName: email.split('@')[0],
        role: 'CITIZEN'
    };
    
    localStorage.setItem('authToken', 'demo-token-' + Date.now());
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Redirect to citizen dashboard
    window.location.href = 'dashboard/citizen.html';
}

// Handle registration (Frontend only - for demonstration)
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
    
    // Frontend-only demo: Store user data locally
    // In a real application, this would register with a backend
    const userData = {
        userId: 'demo-user-' + Date.now(),
        email: email,
        fullName: fullName,
        role: role.toUpperCase()
    };
    
    localStorage.setItem('authToken', 'demo-token-' + Date.now());
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Redirect to appropriate dashboard
    window.location.href = `dashboard/${role.toLowerCase()}.html`;
}

// Initialize
showSection('home');
