# PowerBack - Community Safety Platform

A Progressive Web App (PWA) demonstrating a community safety platform interface for citizens, law enforcement, NGOs, and community watch groups. This is a **frontend-only demonstration** that uses local storage for data persistence.

> **Note**: This is a frontend prototype without a backend. All data is stored locally in the browser using localStorage. For production use, integrate with your own backend API.

## 🌟 Features

### For Citizens
- 📱 Report incidents with photos, videos, and location
- 📊 Track status of reported incidents (stored locally)
- 🗺️ View community safety updates

### For Police
- 🚨 View and manage incident reports
- 👮 Assign and track cases
- 📝 Update incident status and add notes

### For NGOs
- 🤝 Access incident reports to provide support
- 📋 View incident information

### For Community Watch
- 👁️ Monitor community incidents
- 📢 Share safety updates

> **Note**: All features work offline using local browser storage. Data is not synchronized across devices or users in this frontend-only version.

## 🏗️ Architecture

This is a **frontend-only Progressive Web App (PWA)** that demonstrates the user interface and interactions for a community safety platform.

### Frontend (PWA)
- **Location**: `/` (GitHub Pages ready)
- **Technology**: HTML5, CSS3, JavaScript (Vanilla)
- **Data Storage**: localStorage (browser-based, not synced)
- **Features**:
  - Progressive Web App with offline support
  - Service Worker for caching
  - Responsive design
  - Demo authentication interface
  - Role-based dashboards (Citizen, Police, NGO, Community Watch)

### Backend Integration
This application is designed to work standalone as a frontend prototype. To make it fully functional:
1. Implement a backend API (Node.js, Python, Java, etc.)
2. Replace localStorage calls with API requests
3. Add real authentication and authorization
4. Implement database storage (PostgreSQL, MongoDB, etc.)
5. Add WebSocket support for real-time updates

## 🚀 Quick Start

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A web server or static file server for local development

### 1. Clone Repository
```bash
git clone https://github.com/Nhlobo/pwa.git
cd pwa
```

### 2. Serve the Frontend
```bash
# Option 1: Using npx (Node.js required)
npx serve .

# Option 2: Using Python
python -m http.server 8000

# Option 3: Using PHP
php -S localhost:8000

# Option 4: Use any other static file server
```

### 3. Open in Browser
Navigate to `http://localhost:8000` (or the configured port)

### 4. Try the Demo
- Register a new account (data stored locally)
- Select a role (Citizen, Police, NGO, or Community Watch)
- Explore the role-specific dashboard
- Report incidents and manage them

> **Important**: All data is stored in your browser's localStorage and will be cleared when you clear browser data.

## 📱 Deployment

### GitHub Pages (Recommended for Demo)

1. Push to main branch
2. GitHub Actions will automatically deploy to GitHub Pages
3. Access at: `https://nhlobo.github.io/pwa/`

### Other Static Hosting Options

This PWA can be deployed to any static hosting service:
- **Netlify**: Drag and drop the folder or connect to GitHub
- **Vercel**: Import the GitHub repository
- **GitHub Pages**: Already configured
- **Firebase Hosting**: `firebase deploy`
- **Cloudflare Pages**: Connect to GitHub repository

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with responsive design
- **JavaScript (ES6+)** - Vanilla JavaScript, no frameworks
- **Service Workers** - PWA offline functionality
- **localStorage** - Client-side data persistence

### PWA Features
- Offline support with Service Workers
- Add to Home Screen capability
- Responsive design for all devices
- Fast loading with caching strategies

### Development Tools
- Git for version control
- GitHub Actions for CI/CD
- GitHub Pages for hosting

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📧 Support

For issues or questions:
- Open an issue on GitHub
- Contact: [Your Contact Information]

## 🎯 Roadmap

- [x] Frontend prototype with all role dashboards
- [x] PWA with offline support
- [x] localStorage-based demo functionality
- [ ] Backend API integration
- [ ] Real-time WebSocket notifications
- [ ] Database integration
- [ ] User authentication and authorization
- [ ] Mobile apps (iOS/Android)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Integration with emergency services

## 📸 Screenshots

[Add screenshots of your dashboards here]

## 🙏 Acknowledgments

Built with ❤️ for safer communities.
