# Deployment Guide - AI Wiki Quiz Generator

Complete guide for deploying the full-stack application to production.

## Architecture Overview

```
┌─────────────────┐
│   Vercel        │ (Frontend - Next.js)
│  Deployment     │ https://your-app.vercel.app
└────────┬────────┘
         │ HTTPS
         │
┌────────▼────────────────┐
│  Load Balancer / CORS   │
└────────┬────────────────┘
         │
┌────────▼──────────┐
│  Railway/Render   │ (Backend - FastAPI)
│  Deployment       │ https://api.railway.app
└────────┬──────────┘
         │
┌────────▼──────────┐
│   PostgreSQL      │ (Database)
│   (Managed DB)    │
└───────────────────┘
```

## Prerequisites

- GitHub account (for code hosting)
- Vercel account (free tier available)
- Railway or Render account (for backend hosting)
- Google Gemini API key
- PostgreSQL database (managed service)

## Part 1: Backend Deployment to Railway

### 1.1 Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub account
3. Create new project

### 1.2 Deploy Database

1. In Railway dashboard, click "New"
2. Select "Database" → PostgreSQL
3. Wait for database to provision
4. Copy connection string from "Database" tab

### 1.3 Deploy Backend

1. Connect GitHub repository to Railway
2. Create new service → GitHub repo
3. Select `backend` directory
4. Configure environment variables:

```env
DATABASE_URL=<copy from PostgreSQL service>
GEMINI_API_KEY=<your-gemini-api-key>
DEBUG=False
```

5. Set start command:
```bash
pip install -r requirements.txt && python main.py
```

6. Deploy

### 1.4 Get Backend URL

1. After deployment, Railway shows public URL
2. Example: `https://ai-quiz-api-prod.railway.app`
3. Save this for frontend configuration

## Part 2: Frontend Deployment to Vercel

### 2.1 Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub account

### 2.2 Configure Frontend

Update `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://ai-quiz-api-prod.railway.app
```

Commit and push to GitHub:

```bash
git add .env.local
git commit -m "Configure production API URL"
git push origin main
```

### 2.3 Deploy to Vercel

1. In Vercel dashboard, click "Add New..." → "Project"
2. Select your GitHub repository
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./ (or leave blank)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

4. Add environment variables:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://ai-quiz-api-prod.railway.app`

5. Deploy

### 2.4 Get Frontend URL

After deployment, Vercel provides URL:
- Example: `https://ai-wiki-quiz-generator.vercel.app`

## Part 3: Production Configuration

### 3.1 Update CORS

Backend needs to allow requests from frontend:

Update `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ai-wiki-quiz-generator.vercel.app",  # Production
        "http://localhost:3000",  # Local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3.2 Security Checklist

#### Environment Variables
- [ ] `DEBUG=False` in production
- [ ] `GEMINI_API_KEY` set as secret
- [ ] Database credentials in Railway secrets (not in code)
- [ ] CORS whitelist configured

#### Database
- [ ] PostgreSQL backups enabled in Railway
- [ ] Database user has limited permissions
- [ ] SSL connections required
- [ ] No default passwords

#### API
- [ ] Rate limiting configured
- [ ] Input validation enabled
- [ ] Error messages don't leak sensitive info
- [ ] HTTPS enforced

### 3.3 Domain Configuration (Optional)

1. Register domain (e.g., aiquizgenerator.com)
2. Point domain to Vercel:
   - Go to project settings
   - Add custom domain
   - Configure DNS records per Vercel instructions
3. Update API URL if using custom domain

## Part 4: Monitoring & Maintenance

### 4.1 Application Monitoring

#### Railway Backend Monitoring
1. Dashboard shows:
   - CPU usage
   - Memory usage
   - Network I/O
2. Logs available in "Logs" tab
3. Set up alerts for high resource usage

#### Vercel Frontend Monitoring
1. Analytics dashboard shows:
   - Page load performance
   - Web vitals
   - Real user monitoring
2. Error logs in project settings

### 4.2 Logging Strategy

#### Backend Logs
```python
# Check logs in Railway dashboard
# Or use:
railway logs
```

#### Frontend Logs
```javascript
// Check browser DevTools Console
// Or use Sentry for production error tracking
```

### 4.3 Health Checks

```bash
# Verify backend is running
curl https://api.railway.app/health

# Verify frontend is running
curl https://your-app.vercel.app

# Test API
curl https://api.railway.app/api/quiz/history
```

### 4.4 Backup Strategy

#### Database Backups
- Railway PostgreSQL: Automatic daily backups
- Manual backup:
  ```bash
  pg_dump $DATABASE_URL > backup.sql
  ```

#### Code Backups
- GitHub: Primary source of truth
- Vercel: Automatic builds on push
- Local: Keep local copies

## Part 5: Scaling & Performance

### 5.1 Performance Optimization

#### Frontend
- [ ] Enable image optimization
- [ ] Code splitting enabled
- [ ] CSS minification
- [ ] JavaScript minification

#### Backend
- [ ] Database indexes on frequently queried columns
- [ ] Query optimization
- [ ] Connection pooling enabled
- [ ] Caching (if needed)

### 5.2 Scaling Options

#### If Frontend Needs Scaling
- Vercel handles auto-scaling automatically
- Monitor response times in Analytics

#### If Backend Needs Scaling
- Railway: Upgrade instance size
- Add database read replicas (if needed)
- Consider caching layer (Redis)

### 5.3 Cost Management

| Service | Cost | Notes |
|---------|------|-------|
| Vercel | $0-20/mo | Pay as you go, free tier available |
| Railway | $5/mo + usage | PostgreSQL + app containers |
| Google Gemini | Free-$0.0025/call | Check pricing, free tier available |

## Part 6: CI/CD Pipeline

### 6.1 Automated Testing

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy on Push

on:
  push:
    branches: [main]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Vercel
      uses: vercel/action@master
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

### 6.2 Manual Rollback

```bash
# If deployment breaks, rollback:

# On Vercel
# Go to Deployments tab → select previous version → Promote to Production

# On Railway
# Go to Deployments tab → select previous version → Restart
```

## Part 7: Troubleshooting

### Issue: 502 Bad Gateway

**Cause**: Backend not responding

**Solution**:
```bash
# Check backend health
curl https://api.railway.app/health

# Check Railway logs
railway logs

# Restart backend
railway restart
```

### Issue: CORS Error

**Cause**: Frontend URL not in CORS whitelist

**Solution**:
1. Update backend CORS config
2. Redeploy backend
3. Check allowed origins match frontend URL

### Issue: Slow Quiz Generation

**Cause**: Gemini API is slow or rate-limited

**Solution**:
1. Check Gemini API status
2. Add caching layer if possible
3. Inform users about expected latency

### Issue: Database Connection Error

**Cause**: DATABASE_URL misconfigured or database down

**Solution**:
```bash
# Test connection locally
psql $DATABASE_URL -c "SELECT 1"

# Check Railway database status
railway databases list
```

### Issue: Out of Memory

**Cause**: Large response or memory leak

**Solution**:
1. Upgrade Railway instance
2. Add pagination to history endpoint
3. Optimize query performance

## Part 8: Monitoring Checklist

### Daily
- [ ] Check error rates in logs
- [ ] Verify API response times
- [ ] Check database query performance

### Weekly
- [ ] Review cost reports
- [ ] Check backup status
- [ ] Monitor uptime metrics

### Monthly
- [ ] Review performance trends
- [ ] Plan capacity upgrades if needed
- [ ] Update dependencies
- [ ] Review security logs

## Production URLs

| Service | URL | Type |
|---------|-----|------|
| Frontend | https://your-app.vercel.app | Public |
| Backend API | https://api.railway.app | Private |
| API Docs | https://api.railway.app/docs | Public (gated) |
| Database | Internal Railway connection | Private |

## Emergency Contacts

- Vercel Support: vercel.com/support
- Railway Support: railway.app
- Google Cloud Support: cloud.google.com/support

## Useful Commands

### Railway CLI

```bash
# Install
npm install -g @railway/cli

# Login
railway login

# Check status
railway status

# View logs
railway logs

# Restart service
railway restart
```

### Vercel CLI

```bash
# Install
npm i -g vercel

# Deploy
vercel

# View logs
vercel logs

# Check deployments
vercel deployments list
```

### PostgreSQL CLI

```bash
# Connect to database
psql $DATABASE_URL

# Backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

## Quick Start Checklist

- [ ] Backend deployed to Railway with PostgreSQL
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] CORS whitelist updated
- [ ] API URL set in frontend
- [ ] SSL/HTTPS enabled
- [ ] Logs monitoring enabled
- [ ] Backups configured
- [ ] Health checks passing
- [ ] End-to-end quiz generation works

## Next Steps

1. Monitor application for 24 hours
2. Set up automated alerts
3. Configure CDN if needed
4. Plan for capacity as user base grows
5. Consider adding authentication

---

**Deployment successful! 🚀**

For issues or questions, check application logs and support resources above.
