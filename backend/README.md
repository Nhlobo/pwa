# PowerBack Backend - Deployment Guide

## Overview
Production-ready Spring Boot backend with PostgreSQL, JWT authentication, WebSocket support, and real-time notifications.

## Features
- ✅ RESTful API with JWT authentication
- ✅ PostgreSQL database with Flyway migrations
- ✅ WebSocket for real-time updates
- ✅ Push notifications (Firebase)
- ✅ Analytics tracking
- ✅ Role-based access control (Citizen, Police, NGO, Watch)
- ✅ Dockerized deployment
- ✅ CI/CD ready

## Prerequisites
- Java 17+
- Maven 3.8+
- PostgreSQL 15+
- Docker (optional)

## Local Development

### 1. Setup PostgreSQL Database
```bash
# Create database
createdb powerback

# Or use Docker
docker run --name powerback-db \
  -e POSTGRES_DB=powerback \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### 2. Configure Application
Edit `backend/src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/powerback
spring.datasource.username=postgres
spring.datasource.password=postgres

# JWT Secret (REPLACE WITH YOUR OWN - at least 256 bits)
jwt.secret=YOUR_SECURE_SECRET_KEY_HERE_AT_LEAST_256_BITS_LONG
```

### 3. Run Backend
```bash
cd backend
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

### 4. Test API
```bash
# Register a new user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "CITIZEN"
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Docker Deployment

### Build and Run with Docker Compose
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

## Render Deployment

### 1. Create PostgreSQL Database
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Create a new PostgreSQL database
3. Copy the Internal Database URL

### 2. Create Web Service
1. Create a new Web Service
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `cd backend && mvn clean package -DskipTests`
   - **Start Command**: `java -jar backend/target/powerback-backend-1.0.0.jar`
   - **Environment**: Docker or Native

### 3. Environment Variables
Add these environment variables in Render:

```
DATABASE_URL=<Your PostgreSQL Internal URL>
DATABASE_USERNAME=<Your DB Username>
DATABASE_PASSWORD=<Your DB Password>
JWT_SECRET=<Your Secure Secret Key - at least 256 bits>
CORS_ALLOWED_ORIGINS=https://nhlobo.github.io
PORT=8080
```

### 4. Deploy
Push to main branch to trigger auto-deployment.

## Firebase Push Notifications Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Add a new Web App
4. Download the service account key JSON

### 2. Configure Firebase
Add the service account key to `backend/src/main/resources/firebase-service-account.json`

Update `application.properties`:
```properties
firebase.service-account-key=classpath:firebase-service-account.json
```

**IMPORTANT**: Never commit the service account key to version control!

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Incidents
- `GET /api/incidents` - Get all incidents (requires auth)
- `GET /api/incidents/my` - Get user's incidents
- `GET /api/incidents/assigned` - Get assigned incidents (Police)
- `GET /api/incidents/pending` - Get pending incidents
- `POST /api/incidents` - Create incident
- `PUT /api/incidents/{id}/status` - Update incident status
- `PUT /api/incidents/{id}/assign` - Assign incident

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/{id}/read` - Mark as read

### Analytics
- `POST /api/analytics/track` - Track event
- `GET /api/analytics/dashboard` - Get dashboard stats

### WebSocket
- Connect to: `ws://localhost:8080/ws` (or wss:// for production)
- Topics:
  - `/topic/incidents` - All incident updates
  - `/queue/notifications` - Personal notifications

## Database Migrations

Flyway automatically runs migrations on startup. Migration files are in:
`backend/src/main/resources/db/migration/`

## Security Notes

1. **JWT Secret**: Always use a strong, unique secret key (at least 256 bits)
2. **CORS**: Configure allowed origins properly in production
3. **HTTPS**: Always use HTTPS in production
4. **Firebase Keys**: Never commit service account keys
5. **Database**: Use strong passwords and restrict access

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
psql -h localhost -U postgres -d powerback

# Test connection from Java
mvn test
```

### Port Already in Use
```bash
# Change port in application.properties
server.port=8081
```

### Build Errors
```bash
# Clean and rebuild
mvn clean install
```

## Production Checklist

- [ ] Set strong JWT secret
- [ ] Configure CORS with actual frontend URL
- [ ] Set up PostgreSQL database
- [ ] Configure Firebase (if using push notifications)
- [ ] Set up SSL/HTTPS
- [ ] Configure environment variables
- [ ] Test all API endpoints
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline

## Support

For issues or questions, please open an issue on GitHub.
