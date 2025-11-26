# FitPro Deployment Architecture

## Overview

Your FitPro application will be deployed across multiple services:

```
┌─────────────────────────────────────────────────────────────┐
│                         USERS                                │
│                           ↓                                  │
│                    (HTTPS Requests)                          │
│                           ↓                                  │
├─────────────────────────────────────────────────────────────┤
│                  RENDER STATIC SITE                          │
│              (Frontend - React + Vite)                       │
│         https://fitpro-frontend.onrender.com                 │
│                                                              │
│  - Serves static HTML/CSS/JS                                │
│  - Handles client-side routing                              │
│  - Makes API calls to backend                               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ API Requests
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                  RENDER WEB SERVICE                          │
│            (Backend - Node.js + Express)                     │
│          https://fitpro-backend.onrender.com                 │
│                                                              │
│  - REST API endpoints                                       │
│  - Authentication (JWT)                                     │
│  - Business logic                                           │
│  - File uploads                                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Database Queries
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                  MONGODB ATLAS                               │
│              (Database - Cloud MongoDB)                      │
│      mongodb+srv://cluster.mongodb.net/fitpro               │
│                                                              │
│  - User data                                                │
│  - Workout plans                                            │
│  - Meal plans                                               │
│  - Progress tracking                                        │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Flow

### 1. Code Changes
```
Local Development → Git Commit → GitHub Push
```

### 2. Automatic Deployment
```
GitHub Push → Render Webhook → Build & Deploy
```

### 3. User Access
```
User Browser → Render CDN → Static Site → API Calls → Backend → MongoDB
```

## Environment Variables Flow

### Frontend (.env)
```
VITE_API_URL → Compiled into static files → Used for API calls
```

### Backend (.env)
```
MONGODB_URI → Runtime → Database connection
JWT_SECRET → Runtime → Token generation/validation
FRONTEND_URL → Runtime → CORS configuration
```

## Key URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | `https://fitpro-frontend.onrender.com` | User interface |
| Backend API | `https://fitpro-backend.onrender.com/api` | REST API |
| Health Check | `https://fitpro-backend.onrender.com/api/health` | Server status |
| MongoDB | `mongodb+srv://...` | Database |

## Security Considerations

1. **HTTPS**: All traffic encrypted (automatic with Render)
2. **JWT**: Secure token-based authentication
3. **CORS**: Restricted to frontend domain only
4. **Environment Variables**: Secrets stored securely in Render
5. **MongoDB**: Network access restricted, authentication required

## Scaling Options

### Free Tier (Current)
- Frontend: Unlimited static hosting
- Backend: 750 hours/month, spins down after 15 min
- Database: 512 MB storage

### Paid Tier (Future)
- Frontend: Same (static sites are free)
- Backend: $7/month for always-on instance
- Database: $9/month for dedicated cluster

## Monitoring

### Render Dashboard
- View deployment logs
- Monitor service health
- Check resource usage
- Configure alerts

### MongoDB Atlas Dashboard
- Monitor database performance
- View connection metrics
- Check storage usage
- Configure backups

## Backup Strategy

1. **Code**: Backed up in GitHub
2. **Database**: MongoDB Atlas automatic backups (paid tier)
3. **Environment Variables**: Document in `.env.example`

## Disaster Recovery

If something goes wrong:

1. **Rollback**: Render keeps previous deployments
2. **Redeploy**: Trigger manual deployment from Render dashboard
3. **Database Restore**: Use MongoDB Atlas snapshots (paid tier)
4. **Environment Reset**: Re-add environment variables from documentation

## Performance Optimization

1. **CDN**: Render provides automatic CDN for static files
2. **Caching**: Configure browser caching headers
3. **Compression**: Enable gzip compression in Express
4. **Image Optimization**: Use optimized images
5. **Code Splitting**: Vite automatically splits code

## Cost Breakdown (Free Tier)

| Service | Cost | Limitations |
|---------|------|-------------|
| Render Frontend | $0 | Unlimited |
| Render Backend | $0 | Spins down after 15 min |
| MongoDB Atlas | $0 | 512 MB storage |
| **Total** | **$0** | Good for development/testing |

## Upgrade Path

When you're ready to go production:

1. **Render Backend**: $7/month
   - Always-on instance
   - No spin-down delays
   - Better performance

2. **MongoDB Atlas**: $9/month
   - Dedicated cluster
   - Automated backups
   - Better performance

3. **Custom Domain**: ~$12/year
   - Professional branding
   - Better SEO

**Total Production Cost**: ~$16/month + domain

---

## Quick Start Commands

```bash
# Build frontend locally
npm run build

# Build backend locally
npm run build:server

# Test production build locally
npm start

# Check for TypeScript errors
npm run check
```

---

**Ready to deploy? Follow the DEPLOYMENT_GUIDE.md! 🚀**
