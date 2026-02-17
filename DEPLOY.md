# Deploy Cradlers: Vercel + Render + MongoDB Atlas

All free tier. Steps in order.

---

## 1. MongoDB Atlas (database)

1. **https://www.mongodb.com/cloud/atlas** → Sign up / Log in.
2. Create a **free M0 cluster**.
3. **Database Access** → Add user (username + password). Save the password.
4. **Network Access** → Add IP → **Allow access from anywhere** (`0.0.0.0/0`).
5. **Connect** → **Drivers** → copy the connection string.
6. Edit it: replace `<password>` with your password and add `/cradlers` before `?`:
   ```text
   mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/cradlers?retryWrites=true&w=majority
   ```
   Save this as **MONGODB_URI**.

---

## 2. Backend on Render

1. **https://render.com** → Sign up with GitHub.
2. **New** → **Web Service**.
3. Connect repo **Kishannayak/cradlers** (or your repo).
4. **Name:** `cradlers-api`.
5. **Root Directory:** `backend`.
6. **Runtime:** **Docker**.
7. **Instance type:** Free.
8. **Environment variables** → Add:

   | Key | Value |
   |-----|--------|
   | `SPRING_DATA_MONGODB_URI` | Your **MONGODB_URI** from step 1 |
   | `JWT_SECRET` | Long random string (e.g. from [randomkeygen.com](https://randomkeygen.com)) |
   | `CORS_ALLOWED_ORIGINS` | `https://YOUR_VERCEL_URL.vercel.app` (add after step 3; use `*` temporarily to test) |

9. **Create Web Service**. Wait until **Live**.
10. Copy the backend URL (e.g. `https://cradlers-api.onrender.com`) → **BACKEND_URL**.

---

## 3. Frontend on Vercel

1. **https://vercel.com** → Sign in with GitHub.
2. **Add New** → **Project** → Import **Kishannayak/cradlers**.
3. **Root Directory:** set to **`frontend`**.
4. **Environment variables** → Add:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** Your **BACKEND_URL** (e.g. `https://cradlers-api.onrender.com`), no trailing slash.
5. **Deploy**. Wait for it to finish.
6. Copy the Vercel URL (e.g. `https://cradlers-xxx.vercel.app`) → **FRONTEND_URL**.

---

## 4. Point backend CORS to Vercel

1. **Render** → your **cradlers-api** service → **Environment**.
2. Set `CORS_ALLOWED_ORIGINS` to your **FRONTEND_URL** (e.g. `https://cradlers-xxx.vercel.app`). Multiple origins: comma-separated.
3. Save. Render will redeploy.

---

## Done

- **Frontend:** your Vercel URL.
- **Backend:** your Render URL.
- **Database:** MongoDB Atlas (used by Render).

Render free tier may sleep after inactivity; the first request can take ~30–60 seconds.
