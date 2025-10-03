# PowerBack - Configuration Guide

## Environment-Specific Configuration

### Local Development

#### Backend Configuration
**File**: `backend/src/main/resources/application.properties`

```properties
# Database - Local PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/powerback
spring.datasource.username=postgres
spring.datasource.password=postgres

# JWT Secret - Use a development secret (NEVER use in production)
jwt.secret=dev_secret_key_for_local_testing_only_change_for_production

# CORS - Allow localhost for development
cors.allowed-origins=http://localhost:5000,http://localhost:8000,http://127.0.0.1:5000

# Server Port
server.port=8080
```

#### Frontend Configuration
**File**: `assets/js/dashboard-common.js`
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
const WS_URL = 'ws://localhost:8080/ws';
```

**File**: `assets/js/app.js`
```javascript
const BACKEND_URL = 'http://localhost:8080/api';
```

### Production (Render + GitHub Pages)

#### Backend Configuration (Environment Variables in Render)
```properties
# Database - Render PostgreSQL (automatically provided)
DATABASE_URL=<Render provides this>
DATABASE_USERNAME=<Render provides this>
DATABASE_PASSWORD=<Render provides this>

# JWT Secret - MUST be strong and unique
# Generate with: openssl rand -base64 64
JWT_SECRET=<Your secure 256+ bit secret>

# CORS - Your GitHub Pages domain
CORS_ALLOWED_ORIGINS=https://nhlobo.github.io

# Port
PORT=8080
```

#### Frontend Configuration
**File**: `assets/js/dashboard-common.js`
```javascript
const API_BASE_URL = 'https://YOUR-BACKEND.onrender.com/api';
const WS_URL = 'wss://YOUR-BACKEND.onrender.com/ws';
```

**File**: `assets/js/app.js`
```javascript
const BACKEND_URL = 'https://YOUR-BACKEND.onrender.com/api';
```

## API Keys and Secrets Configuration

### JWT Secret Key

**Purpose**: Sign and verify JSON Web Tokens for authentication

**Security Requirements**:
- Minimum 256 bits (32 bytes)
- Cryptographically random
- Never commit to version control
- Different for each environment

**How to Generate**:
```bash
# Linux/Mac
openssl rand -base64 64

# Or use online generator (for development only)
# https://www.grc.com/passwords.htm
```

**Where to Configure**:
- **Local**: `backend/src/main/resources/application.properties`
- **Production**: Render Dashboard → Environment Variables → `JWT_SECRET`

### Firebase Service Account (Push Notifications)

**Purpose**: Send push notifications to users

**Setup Steps**:
1. Create Firebase project at https://console.firebase.google.com
2. Go to Project Settings → Service Accounts
3. Click "Generate new private key"
4. Download JSON file

**Where to Configure**:
- **Local**: Save as `backend/src/main/resources/firebase-service-account.json`
- **Production**: Render Dashboard → Environment → Secret Files → Upload JSON

**IMPORTANT**: 
- Add to `.gitignore` (already done)
- Never commit service account keys
- Use environment variables or secret files

### Database Credentials

**Local Development**:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/powerback
spring.datasource.username=postgres
spring.datasource.password=postgres
```

**Production (Render)**:
Render automatically provides:
- `DATABASE_URL` (includes username, password, host, port)
- Separate `DATABASE_USERNAME` and `DATABASE_PASSWORD` if needed

## Feature Flags

Enable/disable features via configuration:

### Backend Features

**File**: `backend/src/main/resources/application.properties`

```properties
# Enable/Disable Firebase notifications
firebase.enabled=true

# Enable/Disable analytics tracking
analytics.enabled=true

# Enable/Disable real-time WebSocket
websocket.enabled=true

# Log level (DEBUG for development, INFO for production)
logging.level.com.powerback=INFO
```

### Frontend Features

**File**: `assets/js/dashboard-common.js`

```javascript
// Feature flags
const FEATURES = {
    WEBSOCKET: true,           // Real-time updates
    PUSH_NOTIFICATIONS: true,  // Browser push notifications
    ANALYTICS: true,           // Event tracking
    GEOLOCATION: true,         // Auto-detect location
    OFFLINE_MODE: true         // Service worker caching
};
```

## Database Configuration

### Connection Pool Settings

**File**: `backend/src/main/resources/application.properties`

```properties
# Connection pool (HikariCP)
spring.datasource.hikari.maximum-pool-size=5
spring.datasource.hikari.minimum-idle=2
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000
```

### Flyway Migration

**Enable/Disable**:
```properties
# Enable migrations
spring.flyway.enabled=true

# Disable for testing with in-memory database
spring.flyway.enabled=false
```

**Custom Migration Location**:
```properties
spring.flyway.locations=classpath:db/migration,classpath:db/seeds
```

## Security Configuration

### CORS (Cross-Origin Resource Sharing)

**File**: `backend/src/main/resources/application.properties`

```properties
# Development - Allow multiple origins
cors.allowed-origins=http://localhost:5000,http://localhost:8000,http://127.0.0.1:5000

# Production - Single origin
cors.allowed-origins=https://nhlobo.github.io

# Multiple production origins (comma-separated)
cors.allowed-origins=https://nhlobo.github.io,https://powerback.com
```

### Password Encryption

**Configured in**: `SecurityConfig.java`

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(); // Strength: 10 (default)
}

// For higher security (slower):
return new BCryptPasswordEncoder(12);
```

### Session Management

**File**: `backend/src/main/resources/application.properties`

```properties
# JWT expiration (milliseconds)
jwt.expiration=86400000  # 24 hours (default)
jwt.expiration=3600000   # 1 hour (high security)
jwt.expiration=604800000 # 7 days (convenience)
```

## Frontend Configuration

### Service Worker Cache

**File**: `sw.js`

```javascript
// Cache version - increment to force update
const CACHE_NAME = "powerback-v2";

// URLs to cache
const urlsToCache = [
  '/pwa/',
  '/pwa/index.html',
  // Add more URLs as needed
];
```

### Local Storage Keys

Application uses these localStorage keys:
- `authToken` - JWT authentication token
- `userData` - User profile information
- `darkMode` - Dark mode preference

To clear all app data:
```javascript
localStorage.clear();
```

## API Rate Limiting (Future Enhancement)

**Recommended Configuration**:
```properties
# Requests per minute per IP
rate-limit.requests-per-minute=100

# Requests per hour per user
rate-limit.requests-per-hour=1000
```

## Logging Configuration

### Log Levels

**File**: `backend/src/main/resources/application.properties`

```properties
# Application logging
logging.level.com.powerback=DEBUG  # Development
logging.level.com.powerback=INFO   # Production

# Spring Security
logging.level.org.springframework.security=DEBUG  # See auth issues
logging.level.org.springframework.security=WARN   # Production

# Hibernate/JPA
logging.level.org.hibernate.SQL=DEBUG           # See SQL queries
logging.level.org.hibernate.type.descriptor=TRACE  # See parameters
```

### Log Format

```properties
# Console output pattern
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %msg%n

# File output (if needed)
logging.file.name=logs/powerback.log
logging.file.max-size=10MB
logging.file.max-history=30
```

## Monitoring Configuration

### Spring Boot Actuator

**File**: `backend/src/main/resources/application.properties`

```properties
# Expose endpoints
management.endpoints.web.exposure.include=health,info,metrics

# Health check details
management.endpoint.health.show-details=when-authorized

# Info endpoint
management.info.env.enabled=true
```

### Custom Health Indicators

Add to `application.properties`:
```properties
# Custom health checks
management.health.db.enabled=true
management.health.diskspace.enabled=true
```

## Testing Configuration

### Test Database

**File**: `backend/src/test/resources/application-test.properties`

```properties
# H2 in-memory database for tests
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.hibernate.ddl-auto=create-drop

# Disable Flyway for tests
spring.flyway.enabled=false

# Test JWT secret
jwt.secret=test_secret_key
```

## Configuration Checklist

### Before First Run (Development)
- [ ] PostgreSQL installed and running
- [ ] Database `powerback` created
- [ ] Backend `application.properties` configured
- [ ] Frontend API URLs point to `localhost:8080`
- [ ] JWT secret set (even dev secret)

### Before Production Deploy
- [ ] Strong JWT secret generated and set
- [ ] Database credentials configured in Render
- [ ] CORS set to actual frontend URL
- [ ] Frontend URLs updated with production backend
- [ ] Firebase credentials added (if using notifications)
- [ ] Log level set to INFO or WARN
- [ ] Health check endpoint tested
- [ ] SSL/HTTPS verified

### Security Checklist
- [ ] JWT secret is 256+ bits and random
- [ ] JWT secret different from development
- [ ] No secrets in git repository
- [ ] CORS allows only specific origins
- [ ] HTTPS enforced (Render does this automatically)
- [ ] Database password is strong
- [ ] Firebase keys in secret files, not code

## Troubleshooting

### Configuration Not Loading

**Check**:
1. File location: `backend/src/main/resources/application.properties`
2. No syntax errors (properties format)
3. Environment variables override file values

### Database Connection Failed

**Verify**:
1. PostgreSQL is running
2. Database exists
3. Username/password correct
4. Port is 5432 (default)
5. Host is `localhost` (development)

### CORS Errors

**Fix**:
1. Check `cors.allowed-origins` includes your frontend URL
2. Include protocol: `https://` not just domain
3. No trailing slash on URLs
4. Restart backend after changes

---

For more help, see:
- [Backend README](backend/README.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Main README](README.md)
