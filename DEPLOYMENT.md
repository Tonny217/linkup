# LinkUp Production Deployment Guide

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│  Backend API    │────▶│   PocketBase    │
│  (Netlify)      │     │  (Railway)      │     │  (Railway)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        │              ┌────────┴────────┐              │
        │              │                 │              │
        │         ┌────┴────┐     ┌────┴────┐         │
        │         │ Payment │     │  Bot    │         │
        │         │ Service │     │ Service │         │
        │         │(Railway)│     │(Railway)│         │
        │         └─────────┘     └─────────┘         │
        │                                             │
        └─────────────────────────────────────────────▶
                           M-Pesa (Vodacom/Airtel/Tigo)
```

## Step 1: Deploy PocketBase (Database + Auth + File Storage)

### 1.1 Create Railway Account
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Verify your email

### 1.2 Create New Project
1. Click **"New Project"**
2. Select **"Empty Project"**
3. Name it: `linkup-pocketbase`

### 1.3 Deploy PocketBase
1. In your project, click **"New"** → **"Service"**
2. Select **"Deploy from GitHub repo"**
3. Connect your GitHub account
4. Create a new repo or use existing one with the `backend/Dockerfile`
5. Select the repo and branch

### 1.4 Configure Service
1. Click on the service → **"Settings"**
2. Under **"Build"**, set:
   - Builder: `Dockerfile`
   - Dockerfile path: `backend/Dockerfile`
3. Under **"Environment"**, add variables:
   ```
   PORT=8090
   ADMIN_EMAIL=admin@linkup.app
   ADMIN_PASSWORD=YourSecurePassword123!
   ```

### 1.5 Add Persistent Volume (CRITICAL!)
1. Go to **"Volumes"** tab
2. Click **"New Volume"**
3. Mount path: `/pb/pb_data`
4. Size: Start with 5GB (can scale later)
5. Attach to your PocketBase service

### 1.6 Generate Domain
1. Go to **"Settings"** → **"Networking"**
2. Click **"Generate Domain"**
3. Your URL will be: `https://linkup-pocketbase-production.up.railway.app`

### 1.7 Create Admin Account
1. Go to **"Deployments"** tab
2. Click on latest deployment
3. Open **"Shell"** (terminal)
4. Run:
   ```bash
   /usr/local/bin/pocketbase superuser upsert admin@linkup.app YourSecurePassword123!
   ```
5. Access admin panel: `https://your-url.railway.app/_/`

### 1.8 Import Schema
1. Login to admin panel
2. Go to **"Settings"** → **"Import collections"**
3. Upload `backend/pb_schema.json`
4. Click **"Import"**

### 1.9 Configure CORS
1. In admin panel, go to **"Settings"** → **"Application"**
2. Set **"Allowed origins"**:
   ```
   https://your-frontend-url.netlify.app
   https://your-backend-url.railway.app
   ```

---

## Step 2: Deploy Backend API Service

### 2.1 Create New Service
1. In same Railway project, click **"New"** → **"Service"**
2. Select **"Deploy from GitHub repo"**
3. Select your repo (same as frontend)
4. Set root directory: `backend/`

### 2.2 Configure Environment Variables
```env
PORT=3002
POCKETBASE_URL=https://your-pocketbase-url.railway.app
POCKETBASE_ADMIN_TOKEN=your_admin_token
```

To get admin token:
1. Go to PocketBase admin panel
2. **"Settings"** → **"Admin**"
3. Create API key or use existing admin token

### 2.3 Generate Domain
1. Settings → Networking → Generate Domain
2. URL: `https://linkup-api-production.up.railway.app`

---

## Step 3: Deploy Payment Service (M-Pesa)

### 3.1 Create Service
1. New → Service → GitHub repo
2. Root directory: `payment-service/`

### 3.2 Environment Variables
```env
PORT=3001
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_PASSKEY=your_passkey
MPESA_SHORTCODE=174379
MPESA_CALLBACK_URL=https://your-payment-service.railway.app/api/payments/callback
MPESA_ENV=sandbox  # Change to 'production' for live
```

### 3.3 M-Pesa Setup (Daraja API)
1. Register at [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
2. Create app and get Consumer Key/Secret
3. For sandbox, use test credentials
4. For production, request live credentials
5. Set Passkey (provided by Safaricom)

### 3.4 Generate Domain
- URL: `https://linkup-payments-production.up.railway.app`

---

## Step 4: Deploy Telegram Bot

### 4.1 Create Bot
1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot`
3. Follow prompts to create bot
4. Copy the **Bot Token**

### 4.2 Create Service
1. New → Service → GitHub repo
2. Root directory: `bot/`

### 4.3 Environment Variables
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
WEBAPP_URL=https://your-frontend-url.netlify.app
POCKETBASE_URL=https://your-pocketbase-url.railway.app
```

### 4.4 Set WebApp URL in BotFather
1. Message BotFather: `/mybots`
2. Select your bot
3. Click **"Bot Settings"**
4. Click **"Menu Button"**
5. Click **"Configure menu button"**
6. Set URL to your frontend: `https://your-frontend-url.netlify.app`

---

## Step 5: Deploy Frontend (Netlify)

### 5.1 Build for Production
```bash
cd tg-dating
npm install
npm run build
```

### 5.2 Create .env.production
```env
VITE_API_URL=https://your-backend-url.railway.app/api
VITE_POCKETBASE_URL=https://your-pocketbase-url.railway.app
VITE_TELEGRAM_BOT_NAME=your_bot_name
VITE_APP_URL=https://your-frontend-url.netlify.app
```

### 5.3 Deploy to Netlify
1. Go to [Netlify](https://netlify.com)
2. Drag and drop the `dist/` folder
3. Or connect GitHub repo for auto-deploy
4. Set build command: `npm run build`
5. Set publish directory: `dist`

### 5.4 Configure Environment Variables in Netlify
1. Go to **"Site settings"** → **"Environment variables"**
2. Add all variables from `.env.production`

### 5.5 Enable SPA Routing
Create `public/_redirects`:
```
/*    /index.html   200
```

---

## Step 6: Connect Everything

### Update Frontend API URL
In `src/services/api.js`, the API_BASE uses `VITE_API_URL` env var.

### Test the Flow
1. Open your Netlify URL
2. Click "Continue with Telegram"
3. Complete onboarding
4. Start swiping
5. Check matches appear in PocketBase admin

---

## Environment Variables Summary

### PocketBase Service
| Variable | Value | Source |
|----------|-------|--------|
| `PORT` | 8090 | Railway auto |
| `ADMIN_EMAIL` | admin@linkup.app | You set |
| `ADMIN_PASSWORD` | Secure password | You set |

### Backend API Service
| Variable | Value | Source |
|----------|-------|--------|
| `PORT` | 3002 | Railway auto |
| `POCKETBASE_URL` | PocketBase domain | Step 1.6 |
| `POCKETBASE_ADMIN_TOKEN` | Admin API key | Admin panel |

### Payment Service
| Variable | Value | Source |
|----------|-------|--------|
| `PORT` | 3001 | Railway auto |
| `MPESA_CONSUMER_KEY` | Key | Safaricom portal |
| `MPESA_CONSUMER_SECRET` | Secret | Safaricom portal |
| `MPESA_PASSKEY` | Passkey | Safaricom |
| `MPESA_SHORTCODE` | 174379 | Safaricom |
| `MPESA_CALLBACK_URL` | Payment domain + /callback | Step 3.4 |
| `MPESA_ENV` | sandbox/production | You choose |

### Bot Service
| Variable | Value | Source |
|----------|-------|--------|
| `TELEGRAM_BOT_TOKEN` | Token | BotFather |
| `WEBAPP_URL` | Frontend URL | Step 5.3 |
| `POCKETBASE_URL` | PocketBase domain | Step 1.6 |

### Frontend (Netlify)
| Variable | Value | Source |
|----------|-------|--------|
| `VITE_API_URL` | Backend domain + /api | Step 2.3 |
| `VITE_POCKETBASE_URL` | PocketBase domain | Step 1.6 |
| `VITE_TELEGRAM_BOT_NAME` | Bot username | BotFather |
| `VITE_APP_URL` | Frontend URL | Step 5.3 |

---

## Monitoring & Maintenance

### Railway Dashboard
- View logs: Click service → "Deployments" → "Logs"
- Monitor usage: "Usage" tab
- Scale: "Settings" → change compute plan

### PocketBase Admin
- URL: `https://your-pocketbase-url.railway.app/_/`
- Manage users, collections, files
- View API logs

### Health Checks
- PocketBase: `GET /health` (built-in)
- Backend API: `GET /health`
- Payment Service: `GET /health`

### Backup Strategy
1. Railway volumes are backed up automatically
2. For extra safety, export PocketBase data weekly:
   ```bash
   # In Railway shell
   /usr/local/bin/pocketbase backup create
   ```
3. Download backups from admin panel

---

## Scaling

### When you need more:
1. **More users**: Upgrade Railway compute (Pro plan)
2. **More storage**: Increase volume size in Railway
3. **Faster API**: Add caching (Redis) or CDN
4. **Global reach**: Add Cloudflare in front of Netlify

### Cost Estimate (Tanzania-focused)
| Service | Free Tier | Production |
|---------|-----------|------------|
| Railway (PocketBase) | $5/mo credit | ~$10-20/mo |
| Railway (API) | $5/mo credit | ~$5-10/mo |
| Railway (Payments) | $5/mo credit | ~$5/mo |
| Railway (Bot) | $5/mo credit | ~$5/mo |
| Netlify | Free | Free (Pro $19/mo) |
| **Total** | **Free** | **~$25-40/mo** |

---

## Troubleshooting

### "Cannot connect to backend"
- Check CORS settings in PocketBase
- Verify `VITE_API_URL` is correct
- Check Railway logs for errors

### "M-Pesa payments not working"
- Verify sandbox vs production environment
- Check callback URL is HTTPS
- Verify passkey and shortcode

### "Telegram login not working"
- Verify bot token
- Check WebApp URL is set in BotFather
- Ensure domain uses HTTPS

### "Data lost after redeploy"
- Check volume is mounted at `/pb/pb_data`
- Verify volume is attached to service

---

## Security Checklist

- [ ] HTTPS everywhere (Railway/Netlify auto)
- [ ] CORS configured properly
- [ ] Admin password is strong
- [ ] API rate limiting enabled
- [ ] M-Pesa sandbox tested before production
- [ ] Bot token kept secret
- [ ] Environment variables not in code
- [ ] File upload size limits set
- [ ] Report system active
- [ ] Block system functional

---

## Next Steps

1. **Add push notifications** via Firebase Cloud Messaging
2. **Add email verification** via SendGrid/Resend
3. **Add SMS verification** via Twilio/Africa's Talking
4. **Implement AI matching** using user behavior
5. **Add analytics** with Mixpanel/Amplitude
6. **A/B test** premium pricing
7. **Launch marketing** on Instagram/TikTok

---

**Questions?** Check the [PocketBase Docs](https://pocketbase.io/docs/) and [Railway Docs](https://docs.railway.app/).
