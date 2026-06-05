# LinkUp - Railway Deployment Guide

Complete step-by-step guide to deploy LinkUp dating app to Railway for production.

---

## Prerequisites

1. **GitHub Account** - [github.com](https://github.com)
2. **Railway Account** - [railway.com](https://railway.com) (Hobby plan ~$5/month)
3. **Node.js 20+** installed locally
4. **Git** installed locally

---

## Step 1: Push Code to GitHub

```bash
# Initialize git (if not already done)
cd tg-dating
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - LinkUp dating app"

# Create GitHub repo (via web or gh CLI)
# Then push:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/linkup-dating.git
git push -u origin main
```

---

## Step 2: Create Railway Project

### Method A: Dashboard (Recommended for beginners)

1. Go to [railway.com](https://railway.com) and log in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `linkup-dating` repository
5. Railway auto-detects Node.js and builds

### Method B: CLI

```bash
# Install Railway CLI globally
npm install -g @railway/cli

# Login
railway login

# Initialize project in your repo
cd tg-dating
railway init

# Link to your GitHub repo
railway link

# Deploy
railway up
```

---

## Step 3: Configure Environment Variables

In Railway Dashboard:
1. Go to your project
2. Click on the service
3. Go to **Variables** tab
4. Add the following:

| Variable | Value | Required |
|----------|-------|----------|
| `NODE_ENV` | `production` | Yes |
| `JWT_SECRET` | Generate: `openssl rand -base64 32` | Yes |
| `FRONTEND_URL` | Your Railway domain (auto-generated) | Yes |
| `TELEGRAM_BOT_TOKEN` | From @BotFather | For Telegram auth |
| `MPESA_CONSUMER_KEY` | From Safaricom Daraja | For payments |
| `MPESA_CONSUMER_SECRET` | From Safaricom Daraja | For payments |

### Generate JWT Secret:
```bash
openssl rand -base64 32
# Copy output and paste as JWT_SECRET value
```

---

## Step 4: Add Database (PostgreSQL)

1. In Railway project, click **"New"**
2. Select **Database** → **Add PostgreSQL**
3. Railway auto-injects `DATABASE_URL` into your service
4. No code changes needed - the backend reads `DATABASE_URL`

### Verify Connection:
```bash
# The DATABASE_URL is auto-injected
# Your backend code already handles this via process.env.DATABASE_URL
```

---

## Step 5: Add Redis (Optional - for caching/sessions)

1. Click **"New"** → **Database** → **Add Redis**
2. Railway auto-injects `REDIS_URL`
3. Useful for: session store, real-time notifications, rate limiting

---

## Step 6: Configure Domain & HTTPS

1. In your service, go to **Settings** tab
2. Click **"Generate Domain"**
3. Railway provides: `https://linkup-backend-production.up.railway.app`
4. Custom domain (optional):
   - Go to **Settings** → **Custom Domain**
   - Add your domain (e.g., `api.linkup.app`)
   - Follow DNS instructions

---

## Step 7: Update Frontend API URL

In your frontend code, update the API base URL:

```javascript
// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-railway-domain.up.railway.app/api';
```

Set in Railway variables:
```
VITE_API_URL=https://your-railway-domain.up.railway.app/api
```

Rebuild and redeploy:
```bash
git add .
git commit -m "Update API URL for production"
git push
```

---

## Step 8: Enable Auto-Deploy

Railway auto-deploys on every push to `main` by default.

To configure:
1. Go to service **Settings**
2. Under **Source**, ensure:
   - Branch: `main`
   - Auto-deploy: Enabled

---

## Step 9: Verify Deployment

### Health Check:
```bash
curl https://your-app.up.railway.app/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Test API Endpoints:
```bash
# Get users
curl https://your-app.up.railway.app/api/users

# Get events
curl https://your-app.up.railway.app/api/events

# Auth (test)
curl -X POST https://your-app.up.railway.app/api/auth/telegram \
  -H "Content-Type: application/json" \
  -d '{"id":"123","first_name":"Test"}'
```

---

## Step 10: Set Up GitHub Actions CI/CD

1. In GitHub repo, go to **Settings** → **Secrets and variables** → **Actions**
2. Add secret: `RAILWAY_TOKEN`
   - Get token from Railway Dashboard → Account Settings → Tokens
3. Push any change to `main` - GitHub Actions will auto-deploy

### Workflow file already created at:
`.github/workflows/deploy.yml`

---

## Architecture on Railway

```
LinkUp Project (Railway)
├── linkup-backend (Node.js Service)
│   ├── Express API
│   ├── Static files (built frontend)
│   └── Environment variables
├── PostgreSQL (Database)
│   └── Users, matches, messages, events
└── Redis (Cache - optional)
    └── Sessions, real-time data
```

---

## Monitoring & Logs

### Railway Dashboard:
- **Deployments** - View deployment history
- **Logs** - Real-time application logs
- **Metrics** - CPU, memory, network usage
- **Settings** - Environment variables, scaling

### CLI:
```bash
# View logs
railway logs

# View metrics
railway status
```

---

## Scaling

### Vertical (more power):
1. Go to service **Settings**
2. Adjust **CPU** and **Memory** sliders
3. Auto-scales within limits

### Horizontal (more instances):
1. Go to service **Settings**
2. Increase **Replicas**
3. Railway load-balances automatically

---

## Backup & Recovery

### Database Backups:
Railway PostgreSQL includes automatic backups:
- Daily snapshots
- Point-in-time recovery
- Download backups from dashboard

### Manual Backup:
```bash
# Export database
pg_dump $DATABASE_URL > backup.sql

# Restore database
psql $DATABASE_URL < backup.sql
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check `railway.json` or `Dockerfile` |
| Port error | Ensure app uses `process.env.PORT` |
| CORS errors | Update `FRONTEND_URL` variable |
| DB connection fails | Verify `DATABASE_URL` is injected |
| 502 Bad Gateway | Check health endpoint `/health` |
| Out of memory | Increase RAM in service settings |

### Common Fixes:
```bash
# Restart service
railway restart

# Redeploy
railway up

# View detailed logs
railway logs --tail 100
```

---

## Cost Breakdown (Hobby Plan)

| Resource | Estimated Cost |
|----------|---------------|
| Node.js Service (0.5 CPU, 512MB) | ~$5-10/month |
| PostgreSQL (1GB) | ~$5/month |
| Redis (256MB) | ~$3/month |
| **Total** | **~$13-18/month** |

Free tier: $5 credit/month (enough for small testing)

---

## Next Steps

1. **Set up Telegram Bot** - Get token from @BotFather
2. **Configure M-Pesa** - Apply for Daraja API access
3. **Add PocketBase** - For advanced data management
4. **Set up Sentry** - For error tracking
5. **Configure Cloudflare** - For CDN and DDoS protection

---

## Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] Environment variables are set (not in code)
- [ ] HTTPS is enforced (Railway does this)
- [ ] Rate limiting is enabled
- [ ] Helmet.js security headers active
- [ ] CORS configured for your domain only
- [ ] Database credentials rotated regularly
- [ ] No sensitive data in logs

---

## Support

- **Railway Docs**: [docs.railway.com](https://docs.railway.com)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **GitHub Issues**: Create issue in your repo

---

Your app is now live on Railway!
