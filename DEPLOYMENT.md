# PowerBack - Complete Deployment Guide

## Overview
This guide walks you through deploying PowerBack to production with frontend on GitHub Pages and backend on Render.

## Prerequisites
- GitHub account
- Render account (free tier available)
- Git installed locally

## Part 1: Deploy Backend to Render

### Option A: One-Click Deploy (Recommended)

1. **Fork this repository** to your GitHub account

2. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Sign up or log in

3. **Create New Blueprint**
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will detect `render.yaml` and create resources automatically

4. **Configure Environment Variables**
   After deployment, update these in Render dashboard:
   
   - `JWT_SECRET`: Replace auto-generated value with your own secure secret (at least 256 bits)
     ```
     Example: Use this command to generate one:
     openssl rand -base64 64
     ```
   
   - `CORS_ALLOWED_ORIGINS`: Update with your GitHub Pages URL
     ```
     https://YOUR_USERNAME.github.io
     ```

5. **Note Your Backend URL**
   Render will provide a URL like: `https://powerback-backend.onrender.com`
   Save this for frontend configuration.

### Option B: Manual Deploy

1. **Create PostgreSQL Database**
   - In Render dashboard, click "New" → "PostgreSQL"
   - Name: `powerback-db`
   - Plan: Free
   - Click "Create Database"
   - Copy the "Internal Database URL"

2. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `powerback-backend`
     - **Region**: Choose closest to your users
     - **Branch**: `main`
     - **Root Directory**: Leave empty
     - **Environment**: Docker
     - **Dockerfile Path**: `backend/Dockerfile`
     - **Docker Build Context Directory**: `backend`

3. **Set Environment Variables**
   ```
   DATABASE_URL=<Paste Internal Database URL>
   JWT_SECRET=<Your secure secret - use openssl rand -base64 64>
   CORS_ALLOWED_ORIGINS=https://YOUR_USERNAME.github.io
   PORT=8080
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for build and deployment (5-10 minutes)

## Part 2: Deploy Frontend to GitHub Pages

### 1. Update Frontend Configuration

Edit these files with your Render backend URL:

**File: `assets/js/dashboard-common.js`**
```javascript
// Line 6: Replace with your actual Render backend URL
const API_BASE_URL = 'https://powerback-backend.onrender.com/api';
const WS_URL = 'wss://powerback-backend.onrender.com/ws';
```

**File: `assets/js/app.js`**
```javascript
// Line 25: Replace with your actual Render backend URL
const BACKEND_URL = "https://powerback-backend.onrender.com/api";
```

### 2. Commit and Push Changes

```bash
git add .
git commit -m "Update backend URLs for production"
git push origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" → "Pages"
3. Under "Source":
   - Branch: `main`
   - Folder: `/ (root)`
4. Click "Save"

5. GitHub will build and deploy (takes 1-2 minutes)
6. Your site will be available at: `https://YOUR_USERNAME.github.io/pwa/`

### 4. Update CORS in Backend

Go back to Render dashboard and update `CORS_ALLOWED_ORIGINS`:
```
https://YOUR_USERNAME.github.io
```

## Part 3: Firebase Push Notifications (Optional)

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name: `PowerBack`
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2. Get Service Account Key

1. In Firebase Console, click gear icon → "Project settings"
2. Go to "Service accounts" tab
3. Click "Generate new private key"
4. Download the JSON file

### 3. Add to Render

1. In Render dashboard, go to your backend service
2. Click "Environment" tab
3. Add file as secret file:
   - Key: `FIREBASE_SERVICE_ACCOUNT_KEY`
   - Upload the JSON file

### 4. Update Backend Code

The code already has placeholders for Firebase. The service account will be loaded from the environment.

## Part 4: Testing Your Deployment

### 1. Test Backend API

```bash
# Replace with your backend URL
curl https://powerback-backend.onrender.com/actuator/health

# Should return: {"status":"UP"}
```

### 2. Test Frontend

1. Visit: `https://YOUR_USERNAME.github.io/pwa/`
2. Click "Sign In" or "Get Started"
3. Register a new account
4. Try creating an incident report

### 3. Test Real-Time Features

1. Open your app in two browser windows
2. Login as different users (one citizen, one police)
3. Report an incident as citizen
4. Check if it appears in police dashboard (may take a few seconds)

## Part 5: Monitoring and Maintenance

### Render Dashboard
- Monitor logs: Render Dashboard → Your Service → "Logs"
- Check metrics: Render Dashboard → Your Service → "Metrics"
- View deployments: Render Dashboard → Your Service → "Events"

### Database Backups
Free tier databases are not automatically backed up. Consider:
1. Upgrading to paid plan for automatic backups
2. Setting up manual backup script

### Updating the Application

1. Make changes to your code
2. Commit and push to GitHub
3. Render automatically detects changes and redeploys
4. GitHub Pages automatically updates frontend

## Troubleshooting

### Backend Not Starting

**Check Logs**:
1. Go to Render Dashboard
2. Click on your service
3. Click "Logs" tab
4. Look for error messages

**Common Issues**:
- Database connection failed: Check DATABASE_URL
- Port binding error: Ensure PORT=8080
- Build failed: Check Java version and Maven build

### Frontend Can't Connect to Backend

**Check CORS**:
1. Open browser console (F12)
2. Look for CORS errors
3. Verify CORS_ALLOWED_ORIGINS in Render matches your GitHub Pages URL
4. Include protocol: `https://` not `http://`

**Check URLs**:
1. Verify backend URL in `dashboard-common.js` and `app.js`
2. Ensure it matches your Render backend URL
3. Include `/api` at the end

### Database Connection Issues

**Free Tier Limitations**:
- Render free databases sleep after 90 days inactivity
- May have connection limits

**Solutions**:
1. Restart the database in Render dashboard
2. Check DATABASE_URL is correct
3. Verify database is running: Render Dashboard → Database → Status

### WebSocket Not Connecting

**Check Protocol**:
- Use `wss://` for HTTPS backends, not `ws://`
- Verify WebSocket endpoint: `/ws`

**Firewall/Network**:
- Some networks block WebSocket
- Test on different network
- Check browser console for connection errors

## Security Best Practices

1. **JWT Secret**
   - Use strong, random secret (256+ bits)
   - Never commit to version control
   - Rotate periodically

2. **Database Password**
   - Render generates strong passwords automatically
   - Don't change unless necessary
   - Store securely if you do

3. **CORS**
   - Only allow your actual frontend domain
   - Never use `*` in production

4. **HTTPS**
   - Render provides HTTPS automatically
   - GitHub Pages uses HTTPS automatically
   - Never use HTTP in production

5. **Environment Variables**
   - Use Render's environment variable feature
   - Never commit secrets to git
   - Use secret files for credentials

## Performance Optimization

### Backend
1. Enable response compression in application.properties
2. Add database indexes for frequently queried fields (already done)
3. Configure connection pooling
4. Enable caching for static data

### Frontend
1. Service Worker caches assets (already implemented)
2. Minimize API calls
3. Use WebSocket for real-time updates (already implemented)
4. Compress images before uploading

## Scaling

### When to Upgrade

**Backend (Render)**:
- Free tier: 512MB RAM, shared CPU
- Upgrade when:
  - Response times > 2 seconds
  - Memory usage > 400MB consistently
  - CPU usage > 80% consistently

**Database (Render)**:
- Free tier: 256MB RAM, 1GB storage
- Upgrade when:
  - Storage > 800MB
  - Need automatic backups
  - Need point-in-time recovery

### Upgrade Path
1. Render Dashboard → Service → "Settings"
2. Choose paid plan (starts at $7/month)
3. Better performance, more resources, automatic backups

## Support Resources

- **Render Documentation**: https://render.com/docs
- **GitHub Pages**: https://docs.github.com/pages
- **Spring Boot**: https://spring.io/guides
- **Firebase**: https://firebase.google.com/docs

## Checklist

- [ ] Backend deployed to Render
- [ ] Database created and connected
- [ ] Environment variables configured
- [ ] JWT secret set (strong, secure)
- [ ] CORS configured with GitHub Pages URL
- [ ] Frontend updated with backend URL
- [ ] GitHub Pages enabled
- [ ] Registration tested
- [ ] Login tested
- [ ] Incident reporting tested
- [ ] Real-time updates tested
- [ ] WebSocket connection verified
- [ ] Mobile responsive tested
- [ ] Firebase configured (if using push notifications)

## Next Steps

1. Customize the app for your specific needs
2. Add your own branding/logo
3. Configure email notifications
4. Set up monitoring and alerts
5. Create admin dashboard
6. Add analytics tracking
7. Implement backup strategy

---

**Congratulations!** 🎉 Your PowerBack application is now live!

Visit your app at: `https://YOUR_USERNAME.github.io/pwa/`
