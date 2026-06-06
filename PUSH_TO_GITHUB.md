# Push to GitHub & Auto-Deploy

This guide walks you through creating a GitHub repository, pushing the LinkUp project, and setting up automatic deployment to Railway and Netlify via GitHub Actions.

---

## Step 1: Create GitHub Repository

### Option A: GitHub Website
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `linkup-dating` (or any name)
3. Description: `LinkUp - Local dating app for Tanzania`
4. Visibility: **Private** (recommended for production)
5. Check **"Add a README file"** (optional)
6. Click **"Create repository"**

### Option B: GitHub CLI
```bash
gh repo create linkup-dating --private --description "LinkUp - Local dating app for Tanzania"
```

---

## Step 2: Initialize Git & Push Code

### Extract the ZIP first
```bash
# Unzip the project
unzip tg-dating.zip -d linkup-dating
cd linkup-dating
```

### Initialize Git
```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: LinkUp dating app"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/linkup-dating.git

# Push to main branch
git branch -M main
git push -u origin main
```

---

## Step 3: Add GitHub Secrets

Go to your repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these secrets:

### Railway Deployment
| Secret Name | Value | How to Get |
|-------------|-------|------------|
| `RAILWAY_TOKEN` | Railway API token | Railway Dashboard → Account Settings → Tokens |

### Frontend Environment
| Secret Name | Value | How to Get |
|-------------|-------|------------|
| `VITE_API_URL` | `https://linkup-api.up.railway.app/api` | After deploying backend |
| `VITE_POCKETBASE_URL` | `https://linkup-pocketbase.up.railway.app` | After deploying PocketBase |
| `VITE_TELEGRAM_BOT_NAME` | `your_bot_name` | From BotFather |
| `VITE_APP_URL` | `https://your-site.netlify.app` | After Netlify deploy |

### Netlify Deployment
| Secret Name | Value | How to Get |
|-------------|-------|------------|
| `NETLIFY_AUTH_TOKEN` | Netlify personal token | Netlify → User Settings → Applications → Personal Access Tokens |
| `NETLIFY_SITE_ID` | Site ID | Netlify site settings → General → Site ID |

---

## Step 4: Setup Railway CLI Token

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click your profile (top right) → **Account Settings**
3. Go to **Tokens** tab
4. Click **"New Token"**
5. Name: `GitHub Actions`
6. Copy the token
7. Paste into GitHub secret: `RAILWAY_TOKEN`

---

## Step 5: Setup Netlify

### Create Site
1. Go to [Netlify](https://netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Select GitHub → your repo
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Click **"Deploy site"**

### Get Site ID
1. Go to site settings → **General**
2. Copy **Site ID** (e.g., `abc123def-456g-789h`)
3. Add to GitHub secret: `NETLIFY_SITE_ID`

### Get Auth Token
1. Netlify → User Settings → **Applications**
2. **Personal Access Tokens** → **New access token**
3. Name: `GitHub Actions`
4. Copy token
5. Add to GitHub secret: `NETLIFY_AUTH_TOKEN`

---

## Step 6: Manual First Deploy (Recommended)

Before relying on GitHub Actions, manually deploy each service first:

### Deploy PocketBase
```bash
cd backend
# Install Railway CLI if not already
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Deploy
railway up --service linkup-pocketbase
```

### Deploy Backend API
```bash
cd backend
railway up --service linkup-api
```

### Deploy Payment Service
```bash
cd payment-service
railway up --service linkup-payments
```

### Deploy Bot
```bash
cd bot
railway up --service linkup-bot
```

---

## Step 7: Verify Auto-Deploy

After setup, every push to `main` will:
1. Build and test the frontend
2. Deploy PocketBase to Railway
3. Deploy Backend API to Railway
4. Deploy Payment Service to Railway
5. Deploy Telegram Bot to Railway
6. Deploy Frontend to Netlify

### Check deployment status
1. Go to your GitHub repo
2. Click **"Actions"** tab
3. See green checkmarks for successful deployments

---

## Git Workflow for Development

### Daily workflow
```bash
# Pull latest changes
git pull origin main

# Create feature branch
git checkout -b feature/new-feature

# Make changes, then commit
git add .
git commit -m "Add new feature"

# Push branch
git push origin feature/new-feature

# Create Pull Request on GitHub
# After review, merge to main
# Auto-deploy triggers!
```

### Hotfix workflow
```bash
# Create hotfix branch from main
git checkout -b hotfix/critical-fix

# Fix, commit, push
git add . && git commit -m "Fix critical bug" && git push origin hotfix/critical-fix

# Merge PR immediately
# Auto-deploy triggers
```

---

## Troubleshooting GitHub Actions

### "RAILWAY_TOKEN not found"
- Verify secret is added in GitHub repo settings
- Check secret name matches exactly

### "Deploy failed"
- Click on failed workflow in GitHub Actions tab
- Check logs for specific error
- Common issues: missing env vars, build errors

### "Netlify deploy failed"
- Verify `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID`
- Check build command is `npm run build`
- Verify `dist/` folder exists after build

### "PocketBase not persisting data"
- Check volume is mounted in Railway service settings
- Verify mount path is `/pb/pb_data`

---

## GitHub Repo Settings Recommendations

### Branch Protection (Recommended)
1. Settings → **Branches**
2. Add rule for `main`:
   - Require pull request reviews before merging
   - Require status checks to pass
   - Include administrators

### Dependabot
1. Settings → **Security** → **Dependabot alerts**
2. Enable for automatic dependency updates

### Discussions
1. Settings → **General** → **Discussions**
2. Enable for team communication

---

## Quick Reference

### Git Commands
```bash
git status                    # Check current status
git log --oneline             # View commit history
git diff                      # See uncommitted changes
git stash                     # Save changes temporarily
git stash pop                 # Restore stashed changes
git reset --hard HEAD         # Discard all changes (careful!)
git revert <commit-hash>      # Undo a specific commit
```

### Railway CLI Commands
```bash
railway login                 # Login to Railway
railway link                  # Link to project
railway up                    # Deploy current directory
railway logs                  # View logs
railway status                # Check service status
railway variables             # Manage environment variables
```

---

## Next Steps After Push

1. **Invite team members** to GitHub repo
2. **Set up project board** (GitHub Projects)
3. **Add issue templates** for bugs/features
4. **Configure CodeQL** for security scanning
5. **Add CONTRIBUTING.md** for open source (optional)
6. **Add LICENSE** (MIT recommended)

---

**Questions?** 
- GitHub Docs: [docs.github.com](https://docs.github.com)
- Railway Docs: [docs.railway.app](https://docs.railway.app)
- Netlify Docs: [docs.netlify.com](https://docs.netlify.com)
