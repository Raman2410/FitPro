# FitPro Deployment Troubleshooting Guide

## Common Issues and Solutions

### 1. Build Fails on Render

#### Symptom
```
Build failed with exit code 1
npm ERR! code ELIFECYCLE
```

#### Solutions

**A. Missing Dependencies**
```bash
# Check package.json includes all dependencies
# Make sure devDependencies needed for build are listed
```

**B. TypeScript Errors**
```bash
# Run locally first
npm run check
npm run build:server

# Fix all TypeScript errors before deploying
```

**C. Out of Memory**
```yaml
# Add to render.yaml
env:
  NODE_OPTIONS: --max-old-space-size=4096
```

---

### 2. Backend Won't Start

#### Symptom
```
Error: Cannot find module 'dist/api/server.js'
```

#### Solutions

**A. Wrong Start Command**
```bash
# Correct start command in Render:
node dist/api/server.js

# NOT:
npm start  # (unless package.json is correct)
```

**B. Build Command Missing**
```bash
# Correct build command:
npm install && npm run build:server
```

**C. Check tsconfig.server.json**
```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "module": "commonjs"  // Important!
  }
}
```

---

### 3. MongoDB Connection Failed

#### Symptom
```
MongooseServerSelectionError: Could not connect to any servers
```

#### Solutions

**A. Check Connection String**
```bash
# Correct format:
mongodb+srv://username:password@cluster.mongodb.net/fitpro?retryWrites=true&w=majority

# Common mistakes:
# - Forgot to replace <password>
# - Special characters in password not URL-encoded
# - Wrong database name
```

**B. IP Whitelist**
```
1. Go to MongoDB Atlas
2. Network Access → IP Access List
3. Add: 0.0.0.0/0 (Allow from anywhere)
4. Wait 2-3 minutes for changes to propagate
```

**C. Database User Permissions**
```
1. Go to Database Access
2. Ensure user has "Read and write to any database" role
3. Verify username and password are correct
```

---

### 4. CORS Errors in Browser

#### Symptom
```
Access to fetch at 'https://backend.onrender.com/api/...' 
from origin 'https://frontend.onrender.com' has been blocked by CORS policy
```

#### Solutions

**A. Update FRONTEND_URL**
```bash
# In Render backend environment variables:
FRONTEND_URL=https://fitpro-frontend.onrender.com

# Make sure there's NO trailing slash
```

**B. Check CORS Configuration**
```typescript
// api/server.ts
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

**C. Redeploy Backend**
```
After changing FRONTEND_URL, Render will auto-redeploy
Wait for deployment to complete before testing
```

---

### 5. Frontend Shows Blank Page

#### Symptom
- White screen
- No errors in Render logs
- Browser console shows errors

#### Solutions

**A. Check VITE_API_URL**
```bash
# In Render frontend environment variables:
VITE_API_URL=https://fitpro-backend.onrender.com/api

# Must include /api at the end
# Must be HTTPS
```

**B. Check Browser Console**
```javascript
// Common errors:
// - Failed to fetch
// - 404 Not Found
// - CORS errors

// Check Network tab for failed requests
```

**C. Verify Build Output**
```bash
# Check Render logs for:
# - "Build succeeded"
# - dist/ directory created
# - index.html in dist/
```

---

### 6. 500 Internal Server Error

#### Symptom
```
POST /api/auth/register 500 Internal Server Error
```

#### Solutions

**A. Check Render Logs**
```bash
# In Render dashboard:
# 1. Go to your backend service
# 2. Click "Logs"
# 3. Look for error stack traces
```

**B. Common Causes**
```javascript
// Missing environment variables
console.log(process.env.JWT_SECRET); // undefined?

// Database connection failed
// Mongoose schema errors
// Validation errors
```

**C. Add Better Error Logging**
```typescript
// api/server.ts
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    message: err.message 
  });
});
```

---

### 7. JWT Token Issues

#### Symptom
```
401 Unauthorized
Invalid token
```

#### Solutions

**A. Check JWT_SECRET**
```bash
# Must be the same on all deployments
# Must be set in Render environment variables
# Should be a long random string
```

**B. Token Expiration**
```bash
# Check JWT_EXPIRES_IN
JWT_EXPIRES_IN=7d  # 7 days

# User needs to login again after expiration
```

**C. Clear Browser Storage**
```javascript
// In browser console:
localStorage.clear();
// Then login again
```

---

### 8. Slow First Request (Cold Start)

#### Symptom
- First request takes 30-60 seconds
- Subsequent requests are fast

#### Explanation
```
Render free tier spins down services after 15 minutes of inactivity.
First request "wakes up" the service.
```

#### Solutions

**A. Accept It (Free Tier)**
```
This is normal behavior for free tier.
Consider it a feature, not a bug! 😊
```

**B. Upgrade to Paid Tier**
```
$7/month for always-on instance
No cold starts
```

**C. Keep-Alive Service (Workaround)**
```javascript
// Use a service like UptimeRobot to ping your backend every 14 minutes
// Free tier: https://uptimerobot.com
```

---

### 9. File Upload Fails

#### Symptom
```
413 Payload Too Large
or
File upload returns 500 error
```

#### Solutions

**A. Check File Size Limits**
```typescript
// api/server.ts
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
```

**B. Multer Configuration**
```typescript
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});
```

**C. Render Limits**
```
Free tier has bandwidth limits
Consider upgrading for heavy file uploads
```

---

### 10. Environment Variables Not Working

#### Symptom
```
process.env.VARIABLE_NAME is undefined
```

#### Solutions

**A. Check Variable Names**
```bash
# Frontend variables MUST start with VITE_
VITE_API_URL=...  # ✅ Correct
API_URL=...       # ❌ Wrong

# Backend variables can be anything
MONGODB_URI=...   # ✅ Correct
```

**B. Rebuild After Adding Variables**
```
1. Add environment variable in Render
2. Click "Manual Deploy" → "Deploy latest commit"
3. Wait for build to complete
```

**C. Check Spelling**
```bash
# Common typos:
MONGODB_URI  # ✅ Correct
MONGO_URI    # ❌ Wrong (if code expects MONGODB_URI)
```

---

## Debugging Checklist

When something doesn't work:

- [ ] Check Render logs (both frontend and backend)
- [ ] Check browser console (F12)
- [ ] Check Network tab in browser DevTools
- [ ] Verify all environment variables are set
- [ ] Test backend API directly (Postman/curl)
- [ ] Check MongoDB Atlas dashboard
- [ ] Verify IP whitelist in MongoDB
- [ ] Check CORS configuration
- [ ] Try clearing browser cache/localStorage
- [ ] Redeploy both frontend and backend

---

## Getting Help

1. **Check Render Logs**: Most errors are logged here
2. **MongoDB Atlas Logs**: Check connection issues
3. **Browser DevTools**: Check frontend errors
4. **Render Community**: https://community.render.com
5. **Stack Overflow**: Tag with `render`, `mongodb-atlas`

---

## Pro Tips

1. **Test Locally First**: Always test production build locally
   ```bash
   npm run build:server
   npm start
   ```

2. **Use Health Endpoints**: Add a `/health` endpoint to check service status
   ```typescript
   app.get('/api/health', (req, res) => {
     res.json({ status: 'ok', timestamp: new Date() });
   });
   ```

3. **Monitor Logs**: Check logs regularly, especially after deployment

4. **Version Your Deployments**: Use git tags for important releases
   ```bash
   git tag -a v1.0.0 -m "First production release"
   git push origin v1.0.0
   ```

5. **Keep Dependencies Updated**: Run `npm update` regularly

---

**Still stuck? Check the deployment logs first - they usually tell you exactly what's wrong! 🔍**
