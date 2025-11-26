# FitPro - Render Deployment Guide

This guide will help you deploy your FitPro application to Render.

## Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **MongoDB Atlas Account**: For production database (free tier available)

---

## Step 1: Prepare Your Code for Deployment

### 1.1 Create Production Build Script

Your `package.json` needs a production build script. Add these scripts:

```json
"scripts": {
  "start": "node api/server.js",
  "build": "tsc -b && vite build",
  "server:build": "tsc --project tsconfig.server.json"
}
```

### 1.2 Update `.gitignore`

Make sure your `.gitignore` includes:
```
node_modules/
.env
.env.local
dist/
build/
*.log
```

### 1.3 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - FitPro app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fitpro-app.git
git push -u origin main
```

---

## Step 2: Set Up MongoDB Atlas (Production Database)

1. **Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)**
2. **Create a free cluster**:
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

3. **Create Database User**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
   - Set role to "Read and write to any database"

4. **Whitelist IP Addresses**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String**:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/fitpro?retryWrites=true&w=majority`

---

## Step 3: Deploy Backend to Render

### 3.1 Create Web Service

1. **Log in to [Render Dashboard](https://dashboard.render.com/)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service**:

   - **Name**: `fitpro-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave empty (or `.` if needed)
   - **Runtime**: `Node`
   - **Build Command**: 
     ```bash
     npm install && npm run build
     ```
   - **Start Command**: 
     ```bash
     node dist/api/server.js
     ```
   - **Instance Type**: `Free`

### 3.2 Add Environment Variables

In the "Environment" section, add these variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` (Render's default) |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A strong random string (use a password generator) |
| `JWT_EXPIRES_IN` | `7d` |
| `FRONTEND_URL` | `https://fitpro-frontend.onrender.com` (update after frontend deployment) |
| `USE_AI_DETECTION` | `false` (or `true` if using Google Vision) |

**Optional (if using Google Cloud Vision)**:
| Key | Value |
|-----|-------|
| `GOOGLE_CLOUD_PROJECT_ID` | Your Google Cloud project ID |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to credentials JSON |

### 3.3 Deploy

- Click "Create Web Service"
- Wait for the build to complete (5-10 minutes)
- Your backend will be available at: `https://fitpro-backend.onrender.com`

---

## Step 4: Deploy Frontend to Render

### 4.1 Create Static Site

1. **In Render Dashboard, click "New +" → "Static Site"**
2. **Connect the same GitHub repository**
3. **Configure the static site**:

   - **Name**: `fitpro-frontend`
   - **Branch**: `main`
   - **Build Command**: 
     ```bash
     npm install && npm run build
     ```
   - **Publish Directory**: `dist`

### 4.2 Add Environment Variables

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://fitpro-backend.onrender.com/api` |

### 4.3 Deploy

- Click "Create Static Site"
- Wait for build to complete
- Your frontend will be available at: `https://fitpro-frontend.onrender.com`

---

## Step 5: Update Backend CORS Settings

After deploying the frontend, update your backend's `FRONTEND_URL` environment variable:

1. Go to your backend service in Render
2. Navigate to "Environment"
3. Update `FRONTEND_URL` to: `https://fitpro-frontend.onrender.com`
4. Save changes (this will trigger a redeploy)

---

## Step 6: Verify Deployment

1. **Visit your frontend URL**: `https://fitpro-frontend.onrender.com`
2. **Test user registration and login**
3. **Check all features are working**
4. **Monitor logs** in Render dashboard for any errors

---

## Common Issues & Solutions

### Issue 1: Build Fails
**Solution**: Check the build logs in Render. Common causes:
- Missing dependencies in `package.json`
- TypeScript errors
- Environment variables not set

### Issue 2: Backend Can't Connect to MongoDB
**Solution**: 
- Verify MongoDB Atlas connection string
- Check IP whitelist includes 0.0.0.0/0
- Ensure database user has correct permissions

### Issue 3: CORS Errors
**Solution**:
- Verify `FRONTEND_URL` in backend environment variables
- Check CORS configuration in `api/server.ts`

### Issue 4: Frontend Can't Reach Backend
**Solution**:
- Verify `VITE_API_URL` in frontend environment variables
- Check backend service is running
- Test backend API directly: `https://fitpro-backend.onrender.com/api/health`

---

## Free Tier Limitations

**Render Free Tier**:
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month of runtime
- Limited bandwidth

**MongoDB Atlas Free Tier**:
- 512 MB storage
- Shared RAM
- No backups

---

## Upgrading to Paid Plans

For production use, consider:
- **Render**: $7/month for always-on instances
- **MongoDB Atlas**: $9/month for dedicated cluster

---

## Custom Domain (Optional)

1. **Purchase a domain** (e.g., from Namecheap, GoDaddy)
2. **In Render**:
   - Go to your static site
   - Click "Settings" → "Custom Domains"
   - Add your domain
   - Follow DNS configuration instructions
3. **Update environment variables** with your custom domain

---

## Monitoring & Maintenance

- **Check logs regularly** in Render dashboard
- **Monitor MongoDB usage** in Atlas dashboard
- **Set up alerts** for errors and downtime
- **Keep dependencies updated** with `npm update`

---

## Next Steps

1. Set up automated deployments (already enabled with GitHub integration)
2. Add health check endpoints
3. Set up error tracking (e.g., Sentry)
4. Configure CDN for better performance
5. Add SSL certificate (automatic with Render)

---

## Support

- **Render Docs**: https://render.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
- **GitHub Issues**: Create issues in your repository

---

**Congratulations! Your FitPro app is now live! 🎉**
