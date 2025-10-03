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

const BACKEND_URL = "https://backend-note-pwa-1.onrender.com/";

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
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Form submitted!');
        // Redirect to dashboard based on role
        const role = document.getElementById('role') ? document.getElementById('role').value : 'citizen';
        if (form.closest('section').id === 'login' || form.closest('section').id === 'register') {
            window.location.href = `dashboard/${role}.html`;
        }
    });
});

// Initialize
showSection('home');
