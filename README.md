# PowerBack - Community Safety Platform

A comprehensive Progressive Web App (PWA) connecting citizens, law enforcement, NGOs, and community watch groups to create a transparent, efficient system for reporting and responding to incidents.

## 🌟 Features

### For Citizens
- 📱 Report incidents with photos, videos, and location
- 📊 Track status of reported incidents
- 🔔 Real-time notifications on incident updates
- 🗺️ View community safety updates

### For Police
- 🚨 View and manage all incident reports
- 👮 Assign and track cases
- 📝 Update incident status and add notes
- 📈 Analytics dashboard

### For NGOs
- 🤝 Access incident reports to provide support
- 📋 View victim information (with privacy protection)
- 📊 Track support activities

### For Community Watch
- 👁️ Monitor community incidents
- 📢 Share safety updates
- 🔔 Alert members of incidents

## 🏗️ Architecture

### Frontend (PWA)
- **Location**: `/` (GitHub Pages ready)
- **Technology**: HTML5, CSS3, JavaScript (Vanilla)
- **Features**:
  - Progressive Web App with offline support
  - Service Worker for caching
  - Responsive design
  - Real-time updates via WebSocket
  - JWT authentication

### Backend (API)
- **Location**: `/backend`
- **Technology**: Java 17, Spring Boot 3.2
- **Database**: PostgreSQL 15
- **Features**:
  - RESTful API
  - JWT authentication
  - WebSocket support
  - Push notifications (Firebase)
  - Analytics tracking
  - Database migrations (Flyway)

## 🚀 Quick Start

### Prerequisites
- Node.js (for development server)
- Java 17+
- Maven 3.8+
- PostgreSQL 15+
- Docker (optional)

### 1. Clone Repository
```bash
git clone https://github.com/Nhlobo/pwa.git
cd pwa
```

### 2. Setup Backend
```bash
# Start PostgreSQL (Docker)
docker-compose up -d postgres

# Or install PostgreSQL locally and create database
createdb powerback

# Run backend
cd backend
mvn spring-boot:run
```

Backend will be available at `http://localhost:8080`

See [Backend README](backend/README.md) for detailed setup.

### 3. Setup Frontend
```bash
# Serve with a local server (from project root)
npx serve .

# Or use Python
python -m http.server 8000

# Or use any other static file server
```

Frontend will be available at `http://localhost:5000` (or configured port)

### 4. Configure API URLs

Edit `/assets/js/dashboard-common.js`:
```javascript
const API_BASE_URL = 'http://localhost:8080/api'; // For local development
```

Edit `/assets/js/app.js`:
```javascript
const BACKEND_URL = 'http://localhost:8080/api'; // For local development
```

## 📱 Deployment

### Frontend (GitHub Pages)

1. Update URLs in configuration files to point to your production backend
2. Push to main branch
3. GitHub Actions will automatically deploy to GitHub Pages
4. Access at: `https://nhlobo.github.io/pwa/`

### Backend (Render)

1. Create a PostgreSQL database on Render
2. Create a new Web Service connected to your repository
3. Configure environment variables:
   ```
   DATABASE_URL=<Render PostgreSQL URL>
   JWT_SECRET=<Your secure secret key>
   CORS_ALLOWED_ORIGINS=https://nhlobo.github.io
   ```
4. Deploy!

See [Backend README](backend/README.md) for detailed deployment guide.

## 🔧 Configuration

### Required Environment Variables (Backend)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection URL | `jdbc:postgresql://localhost:5432/powerback` |
| `DATABASE_USERNAME` | Database username | `postgres` |
| `DATABASE_PASSWORD` | Database password | `your_password` |
| `JWT_SECRET` | Secret key for JWT tokens (256+ bits) | `your_secure_secret_key` |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origins | `https://nhlobo.github.io` |

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `8080` |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Path to Firebase credentials | - |

### Frontend Configuration

Update these files with your backend URL:
- `/assets/js/dashboard-common.js` - `API_BASE_URL`
- `/assets/js/app.js` - `BACKEND_URL`

## 📚 API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "CITIZEN"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGc...",
  "userId": 1,
  "email": "john@example.com",
  "fullName": "John Doe",
  "role": "CITIZEN"
}
```

### Incident Endpoints

All incident endpoints require authentication (Bearer token in Authorization header).

#### Create Incident
```
POST /api/incidents
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "THEFT",
  "title": "Bicycle stolen from parking lot",
  "description": "My bicycle was stolen...",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "address": "123 Main St, New York, NY",
  "mediaUrls": []
}
```

#### Get My Incidents
```
GET /api/incidents/my
Authorization: Bearer <token>
```

#### Update Incident Status (Police)
```
PUT /api/incidents/{id}/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "IN_PROGRESS",
  "notes": "Investigation ongoing..."
}
```

See full API documentation in [Backend README](backend/README.md).

## 🔐 Security

- JWT-based authentication
- Role-based access control
- Secure password hashing (BCrypt)
- CORS protection
- SQL injection prevention (JPA/Hibernate)
- XSS protection
- HTTPS enforced in production

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Manual Testing
1. Register users with different roles
2. Test incident reporting flow
3. Test police case management
4. Test real-time notifications
5. Verify WebSocket connections

## 📊 Database Schema

### Users Table
- id, fullName, email, password, phone, role, active, fcmToken
- Roles: CITIZEN, POLICE, NGO, WATCH

### Incidents Table
- id, title, description, type, status, priority, latitude, longitude, address
- reporterId, assignedOfficerId, officerNotes
- createdAt, updatedAt, resolvedAt

### Notifications Table
- id, userId, title, message, type, read, relatedIncidentId
- createdAt

See `/backend/src/main/resources/db/migration/` for complete schema.

## 🛠️ Technology Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Service Workers (PWA)
- WebSocket (SockJS + STOMP)
- Local Storage (JWT, user data)

### Backend
- Java 17
- Spring Boot 3.2
- Spring Security (JWT)
- Spring Data JPA
- Spring WebSocket
- PostgreSQL 15
- Flyway (migrations)
- Firebase Admin SDK (notifications)
- Maven

### DevOps
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Render (Backend hosting)
- GitHub Pages (Frontend hosting)

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

- [ ] Mobile apps (iOS/Android)
- [ ] Advanced analytics dashboard
- [ ] Geofencing for location-based alerts
- [ ] Multi-language support
- [ ] Advanced media handling (cloud storage)
- [ ] Integration with emergency services
- [ ] AI-powered incident categorization

## 📸 Screenshots

[Add screenshots of your dashboards here]

## 🙏 Acknowledgments

Built with ❤️ for safer communities.
