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
        if (sectionId === 'login' || sectionId === 'register') {
            window.location.href = `dashboard/${role}.html`;
        }
    });
});

// PWA Install Prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('installPrompt').style.display = 'block';
});

document.getElementById('installPrompt').addEventListener('click', () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
        document.getElementById('installPrompt').style.display = 'none';
    });
});

// Initialize
showSection('home');
