# Get Cradlers Live on a URL

Follow these steps to get your app running at a public URL (e.g. `https://cradlers.vercel.app` + backend on Render). **Everything below is free.** You can also show your **test URL inside GitHub** (Environments → test).

---

## Show your test URL in GitHub (free)

GitHub doesn’t host the app, but you can **attach your live URL to a “test” environment** so it’s visible in the repo.

1. Deploy the app using the steps below (Vercel + Render + Atlas — all free).
2. In your repo on GitHub: **Settings** → **Environments** → **New environment**.
3. Name it **`test`** → **Configure environment**.
4. Under **Environment URL**, paste your live frontend URL (e.g. `https://cradlers-xxx.vercel.app`) → **Save protection rules** (or Save).
5. From then on, the test URL appears in GitHub:
   - **Code** tab → open the branch dropdown (e.g. `main`) → **Environments** → **test** (with the link), or  
   - **Settings** → **Environments** → **test** (see the URL there).

If you use the **Deploy to Vercel (test)** workflow (see [Deploy from GitHub Actions](#deploy-from-github-actions-optional)), deployments to the `test` environment will also show under **Actions** and in the Environments view.

---

## Overview

| Part        | Where to deploy | Free tier | You get |
|------------|------------------|-----------|---------|
| **Database** | MongoDB Atlas   | Yes       | Connection string |
| **Backend**  | Render          | Yes       | `https://cradlers-api.onrender.com` |
| **Frontend** | Vercel          | Yes       | `https://cradlers.vercel.app` (or your subdomain) |

---

## Step 1: MongoDB Atlas (database in the cloud)

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up / log in.
2. Create a **free cluster** (M0).
3. **Database Access** → Add user (username + password). Note the password.
4. **Network Access** → Add IP address → **Allow access from anywhere** (`0.0.0.0/0`) for now.
5. **Database** → **Connect** → **Drivers** → copy the connection string. It looks like:
   ```text
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` in that string with your user password. Add the database name:
   ```text
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/cradlers?retryWrites=true&w=majority
   ```
   Save this as your **MongoDB URI** for the backend.

---

## Step 2: Deploy backend on Render

1. Go to [https://render.com](https://render.com) and sign up (GitHub login is easiest).
2. **Dashboard** → **New** → **Web Service**.
3. Connect your GitHub repo **sushanthrao11/Cradlers** (or your fork).
4. Configure:
   - **Name:** `cradlers-api` (or any name).
   - **Region:** Choose closest to you.
   - **Root Directory:** `backend`.
   - **Runtime:** **Docker** (use the repo’s `backend/Dockerfile`).
   - **Instance type:** **Free**.
5. **Environment variables** (Add all):

   | Key | Value |
   |-----|--------|
   | `SPRING_DATA_MONGODB_URI` | Your Atlas URI from Step 1 (e.g. `mongodb+srv://...`) |
   | `JWT_SECRET` | A long random string (e.g. generate at [randomkeygen.com](https://randomkeygen.com)) |
   | `CORS_ALLOWED_ORIGINS` | `https://YOUR_VERCEL_URL.vercel.app` (you’ll set this after Step 3; you can add it later and redeploy) |

   For CORS you can temporarily use `*` to test, then replace with your real frontend URL.

6. Click **Create Web Service**. Render will build and deploy. Wait until the service is **Live**.
7. Copy your backend URL, e.g. **`https://cradlers-api.onrender.com`**. (No trailing slash.)

---

## Step 3: Deploy frontend on Vercel

1. Go to [https://vercel.com](https://vercel.com) and sign in with GitHub.
2. **Add New** → **Project** → import **sushanthrao11/Cradlers** (or your fork).
3. Configure:
   - **Root Directory:** click **Edit** → set to **`frontend`**.
   - **Framework Preset:** Next.js (auto-detected).
4. **Environment variables** → Add:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** Your Render backend URL from Step 2, e.g. `https://cradlers-api.onrender.com`
5. Click **Deploy**. Wait until the deployment is done.
6. Open the Vercel URL (e.g. `https://cradlers-xxx.vercel.app`). That’s your **live frontend URL**.

---

## Step 4: Point backend CORS to your frontend URL

1. In **Render** → your backend service → **Environment**.
2. Set or update:
   - `CORS_ALLOWED_ORIGINS` = your Vercel URL, e.g. `https://cradlers-xxx.vercel.app`
   (Add multiple origins separated by commas if you have more than one domain.)
3. **Save changes**. Render will redeploy automatically.

---

## Step 5: See it live

- **Frontend (shop):** open your Vercel URL, e.g. `https://cradlers-xxx.vercel.app`.
- **Backend API:** e.g. `https://cradlers-api.onrender.com` (you can try `https://cradlers-api.onrender.com/actuator/health` if you add Spring Boot Actuator, or just use the app).

Login (OTP) will only work if your backend can send SMS or you use a dev path that logs OTP; for a quick test you can use the UI and see that the app loads and talks to the backend.

---

## Deploy from GitHub Actions (optional)

If you want the **test** deployment to be triggered from GitHub (push to `dev` → deploy to Vercel and show under Environments → test):

1. Create the **test** environment in GitHub (Settings → Environments → New → name: `test`) so it exists before the first deploy.
2. In Vercel: create a project linked to this repo (root = `frontend`), then get **Project ID** and **Org ID** from Project Settings, and a **token** from [vercel.com/account/tokens](https://vercel.com/account/tokens).
3. In GitHub: **Settings** → **Secrets and variables** → **Actions** → add:
   - `VERCEL_TOKEN` = your Vercel token  
   - `VERCEL_ORG_ID` = Org ID  
   - `VERCEL_PROJECT_ID` = Project ID  
   - `BACKEND_URL` = your Render backend URL (e.g. `https://cradlers-api.onrender.com`)
4. Push to `dev`; the workflow **Deploy to Vercel (test)** will run and deploy. The deployment will be linked to the **test** environment and the live URL will appear under **Environments** → **test**.

---

## Optional: Custom domain

- **Vercel:** Project → **Settings** → **Domains** to add your own domain (e.g. `test.cradlers.com`).

---

## Troubleshooting

| Issue | What to check |
|------|----------------|
| Frontend loads but API calls fail | CORS: ensure `CORS_ALLOWED_ORIGINS` on Render includes your exact Vercel URL (https, no trailing slash). |
| “Network error” or timeout | Render free tier sleeps after inactivity; first request may take ~30–50 seconds. Refresh and wait. |
| Backend won’t start on Render | Check Render **Logs**. Ensure `SPRING_DATA_MONGODB_URI` is correct and MongoDB Atlas allows `0.0.0.0/0`. |
| Build fails on Vercel | Ensure **Root Directory** is `frontend` and `NEXT_PUBLIC_API_URL` is set so the build can embed the API URL. |

Once Steps 1–4 are done, you’ll have the app **live on a URL** you can share.
