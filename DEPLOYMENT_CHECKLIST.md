# FitPro Deployment Checklist

Use this checklist to ensure you complete all deployment steps correctly.

## Pre-Deployment Checklist

- [ ] Code is working locally without errors
- [ ] All environment variables are documented
- [ ] `.gitignore` is properly configured
- [ ] Code is committed to GitHub
- [ ] MongoDB Atlas account created
- [ ] Render account created

---

## MongoDB Atlas Setup

- [ ] Create free cluster
- [ ] Create database user with password
- [ ] Whitelist all IP addresses (0.0.0.0/0)
- [ ] Copy connection string
- [ ] Test connection string locally (optional)

---

## Backend Deployment (Render)

- [ ] Create new Web Service in Render
- [ ] Connect GitHub repository
- [ ] Set build command: `npm install && npm run build:server`
- [ ] Set start command: `node dist/api/server.js`
- [ ] Add environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=10000`
  - [ ] `MONGODB_URI=<your-atlas-connection-string>`
  - [ ] `JWT_SECRET=<random-secure-string>`
  - [ ] `JWT_EXPIRES_IN=7d`
  - [ ] `FRONTEND_URL=<will-update-later>`
  - [ ] `USE_AI_DETECTION=false`
- [ ] Deploy backend
- [ ] Copy backend URL (e.g., `https://fitpro-backend.onrender.com`)
- [ ] Test backend health endpoint: `https://your-backend.onrender.com/api/health`

---

## Frontend Deployment (Render)

- [ ] Create new Static Site in Render
- [ ] Connect same GitHub repository
- [ ] Set build command: `npm install && npm run build`
- [ ] Set publish directory: `dist`
- [ ] Add environment variable:
  - [ ] `VITE_API_URL=<your-backend-url>/api`
- [ ] Deploy frontend
- [ ] Copy frontend URL (e.g., `https://fitpro-frontend.onrender.com`)

---

## Post-Deployment Configuration

- [ ] Update backend `FRONTEND_URL` environment variable with frontend URL
- [ ] Redeploy backend (automatic after env var change)
- [ ] Test complete flow:
  - [ ] Visit frontend URL
  - [ ] Register new user
  - [ ] Login
  - [ ] Test all features
- [ ] Check browser console for errors
- [ ] Check Render logs for backend errors

---

## Optional Enhancements

- [ ] Set up custom domain
- [ ] Configure CDN
- [ ] Set up error monitoring (Sentry)
- [ ] Enable automatic deployments on push
- [ ] Set up staging environment
- [ ] Configure backup strategy

---

## Troubleshooting

If something doesn't work:

1. **Check Render logs** for both frontend and backend
2. **Verify environment variables** are set correctly
3. **Test backend API** directly with Postman or curl
4. **Check MongoDB Atlas** connection and IP whitelist
5. **Review browser console** for frontend errors
6. **Ensure CORS** is configured correctly

---

## Important URLs to Save

- **Frontend URL**: _________________________
- **Backend URL**: _________________________
- **MongoDB Atlas Dashboard**: https://cloud.mongodb.com
- **Render Dashboard**: https://dashboard.render.com
- **GitHub Repository**: _________________________

---

## Estimated Time

- **MongoDB Atlas Setup**: 10-15 minutes
- **Backend Deployment**: 15-20 minutes
- **Frontend Deployment**: 10-15 minutes
- **Testing & Verification**: 15-20 minutes

**Total**: ~1 hour

---

Good luck with your deployment! 🚀
