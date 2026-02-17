# Deploy Cradlers — All Steps (Terminal + Minimal Browser)

Everything in one place. Do the **browser** steps once, then run the **terminal** blocks in order.

---

## 0. Prerequisites (run once on your machine)

```bash
# Install GitHub CLI (macOS)
brew install gh

# Install Vercel CLI
npm i -g vercel

# Log in (opens browser once)
gh auth login
vercel login
```

Ensure you have: **Node 18+**, **Java 17+**, **Maven**, **Git**.  
Optional: **Docker** for local test.

---

## 1. MongoDB Atlas (browser — once)

1. Open **https://www.mongodb.com/cloud/atlas** → Sign up / Log in.
2. Create **free M0 cluster** → **Database Access** → Add user (save username + password).
3. **Network Access** → Add IP → **Allow from anywhere** (`0.0.0.0/0`).
4. **Database** → **Connect** → **Drivers** → copy connection string.
5. Replace `<password>` and add database name so it looks like:
   ```text
   mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/cradlers?retryWrites=true&w=majority
   ```
6. Save this as **MONGODB_URI** (you’ll paste it in the next section).

---

## 2. Backend on Render (browser — once)

1. Open **https://render.com** → Sign up with GitHub.
2. **New** → **Web Service** → Connect repo **sushanthrao11/Cradlers**.
3. Set:
   - **Name:** `cradlers-api`
   - **Root Directory:** `backend`
   - **Runtime:** Docker
   - **Instance:** Free
4. **Environment** → Add:
   - `SPRING_DATA_MONGODB_URI` = your **MONGODB_URI** from step 1
   - `JWT_SECRET` = any long random string (e.g. `openssl rand -hex 32`)
   - `CORS_ALLOWED_ORIGINS` = `*` (you’ll change this after frontend is live)
5. **Create Web Service** → wait until **Live**.
6. Copy the backend URL (e.g. `https://cradlers-api.onrender.com`) → save as **BACKEND_URL**.

---

## 3. Push code to GitHub (terminal)

From your project root (e.g. `~/Documents/Projects/cradlers`):

```bash
cd /Users/kishan.a/Documents/Projects/cradlers

git status
git add .
git commit -m "Add deployment and test setup"
git push origin dev
```

---

## 4. Deploy frontend with Vercel (terminal)

Replace `YOUR_BACKEND_URL` with your real **BACKEND_URL** (no trailing slash), e.g. `https://cradlers-api.onrender.com`.

```bash
cd /Users/kishan.a/Documents/Projects/cradlers/frontend

npm ci
export NEXT_PUBLIC_API_URL="YOUR_BACKEND_URL"
vercel link --yes
vercel env add NEXT_PUBLIC_API_URL production <<< "YOUR_BACKEND_URL"
vercel deploy --prod
```

Vercel will print the **frontend URL** (e.g. `https://cradlers-xxx.vercel.app`). Copy it → save as **FRONTEND_URL**.

---

## 5. Point backend CORS to frontend (browser — once)

1. **Render** → your service **cradlers-api** → **Environment**.
2. Set `CORS_ALLOWED_ORIGINS` = your **FRONTEND_URL** (e.g. `https://cradlers-xxx.vercel.app`).
3. Save (Render redeploys).

---

## 6. Add test environment and URL in GitHub (terminal)

Replace `OWNER`, `REPO`, and `YOUR_FRONTEND_URL` with your values. For this repo: **OWNER=sushanthrao11**, **REPO=Cradlers**, **FRONTEND_URL** = the Vercel URL from step 4.

```bash
# Create "test" environment and set the live URL (so it shows in GitHub)
gh api --method PUT \
  -H "Accept: application/vnd.github+json" \
  repos/OWNER/REPO/environments/test \
  -f deployment_branch_policy='null' \
  -f environment_url='YOUR_FRONTEND_URL'
```

**Example:**

```bash
gh api --method PUT \
  -H "Accept: application/vnd.github+json" \
  repos/sushanthrao11/Cradlers/environments/test \
  -f deployment_branch_policy='null' \
  -f environment_url='https://cradlers-xxx.vercel.app'
```

After this, the test URL appears under **GitHub** → **Environments** → **test**.

---

## 7. Optional: Set GitHub Actions secrets (for “Deploy to Vercel (test)” workflow)

Only if you want pushes to `dev` to auto-deploy. Get **Org ID** and **Project ID** from Vercel project settings, and a token from **https://vercel.com/account/tokens**.

```bash
cd /Users/kishan.a/Documents/Projects/cradlers

gh secret set VERCEL_TOKEN
gh secret set VERCEL_ORG_ID
gh secret set VERCEL_PROJECT_ID
gh secret set BACKEND_URL
```

When prompted, paste each value (BACKEND_URL = your Render backend URL).

---

## 8. Local test with Docker (terminal only)

From project root:

```bash
cd /Users/kishan.a/Documents/Projects/cradlers
docker compose -f docker-compose.test.yml up --build
```

Then open **http://localhost:3000**. Stop with `Ctrl+C` then:

```bash
docker compose -f docker-compose.test.yml down
```

---

## Quick reference — copy/paste block

Fill the three placeholders once, then run.

```bash
# 1) Fill these (no trailing slash)
export MONGODB_URI="mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/cradlers?retryWrites=true&w=majority"
export BACKEND_URL="https://cradlers-api.onrender.com"   # from Render dashboard
export FRONTEND_URL="https://cradlers-xxx.vercel.app"   # from Vercel after deploy

# 2) Push to GitHub
cd /Users/kishan.a/Documents/Projects/cradlers
git add .
git commit -m "Deploy setup"
git push origin dev

# 3) Deploy frontend (Vercel)
cd frontend
npm ci
vercel link --yes
vercel env add NEXT_PUBLIC_API_URL production <<< "$BACKEND_URL"
vercel deploy --prod
# Copy the printed URL into FRONTEND_URL above, then:

# 4) Set test environment URL in GitHub
gh api --method PUT -H "Accept: application/vnd.github+json" \
  repos/sushanthrao11/Cradlers/environments/test \
  -f deployment_branch_policy='null' -f environment_url="$FRONTEND_URL"
```

---

## Summary

| Step | Where | What you get |
|------|--------|--------------|
| 1 | Browser (Atlas) | MONGODB_URI |
| 2 | Browser (Render) | BACKEND_URL |
| 3 | Terminal | Code on GitHub |
| 4 | Terminal (Vercel) | FRONTEND_URL (live app) |
| 5 | Browser (Render) | CORS fixed |
| 6 | Terminal (gh) | Test URL visible in GitHub Environments |

All of it is **free**. The live test URL is **FRONTEND_URL** and (after step 6) also under **GitHub → Environments → test**.
