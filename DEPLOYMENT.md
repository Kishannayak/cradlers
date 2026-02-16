# Deploy to GitHub & Test Environment

Step-by-step guide to push Cradlers to GitHub and run it in a test environment.

---

## Part 1: Deploy to GitHub

### 1. Check current branch and status

```bash
cd /Users/kishan.a/Documents/Projects/cradlers
git status
git branch
```

Your repo is already connected to **https://github.com/sushanthrao11/Cradlers.git**. You're on `dev`; push to the branch you want (e.g. `dev` or `main`).

### 2. Stage and commit your changes

```bash
git add .
git status   # review what will be committed
git commit -m "Your commit message - e.g. Add deployment and test env setup"
```

### 3. Push to GitHub

**Push `dev` branch:**

```bash
git push -u origin dev
```

**Or push `main` (after merging or switching):**

```bash
git checkout main
git merge dev   # if you want to bring dev into main
git push -u origin main
```

### 4. Create a PR (optional)

1. Open **https://github.com/sushanthrao11/Cradlers**
2. If you pushed `dev`, GitHub may show “Compare & pull request”
3. Create a Pull Request from `dev` → `main` for review before merging

---

## Part 2: Test environment options

### Option A: Local test with Docker Compose (recommended for “bring up in test”)

Runs MongoDB + Backend + Frontend in one command. Good for QA or demos.

**Prerequisites:** Docker and Docker Compose installed.

1. **Start everything:**

   ```bash
   cd /Users/kishan.a/Documents/Projects/cradlers
   docker compose -f docker-compose.test.yml up --build
   ```

2. **Use the app:**

   - Frontend: **http://localhost:3000**
   - Backend API: **http://localhost:8000**
   - MongoDB: `localhost:27017` (internal to Docker)

3. **Stop:**

   ```bash
   docker compose -f docker-compose.test.yml down
   ```

### Option B: Run test environment without Docker (local only)

Same as normal dev, but with a single MongoDB and clear env.

1. **Start MongoDB** (Docker one-off):

   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

2. **Backend:**

   ```bash
   cd backend
   mvn spring-boot:run
   ```

3. **Frontend (new terminal):**

   ```bash
   cd frontend
   npm install
   NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev
   ```

4. Open **http://localhost:3000** and test.

### Option C: Hosted test environment (staging)

For a real “test” URL (e.g. `test.cradlers.com` or Vercel + Railway):

1. **Frontend:** Deploy to **Vercel** (connects to your GitHub repo).
   - Set env: `NEXT_PUBLIC_API_URL=https://your-backend-test-url.com`

2. **Backend:** Deploy to **Railway**, **Render**, or **Fly.io**.
   - Set env: `spring.data.mongodb.uri` (e.g. MongoDB Atlas), `jwt.secret`, `cors.allowed-origins` (include your Vercel frontend URL).

3. **Database:** Create a free cluster at **MongoDB Atlas** and use its connection string in the backend env.

---

## Part 3: CI – GitHub Actions (build & test)

The repo includes a workflow that runs on push/PR to `dev` and `main`:

- **Frontend:** `npm ci` and `npm run build`
- **Backend:** Maven compile (no MongoDB in CI by default)

Location: `.github/workflows/build-and-test.yml`

To see runs: GitHub repo → **Actions** tab.

---

## Quick reference

| Goal                    | Command / action                                      |
|-------------------------|--------------------------------------------------------|
| Push current work      | `git add . && git commit -m "msg" && git push origin dev` |
| Local test (Docker)     | `docker compose -f docker-compose.test.yml up --build` |
| Local test (no Docker)  | MongoDB container + `mvn spring-boot:run` + `npm run dev` |
| Hosted test             | Vercel (frontend) + Railway/Render (backend) + Atlas (DB) |

If you tell me whether you prefer “local test with Docker” or “hosted test (Vercel + backend)”, I can give you exact commands and env values for your case.
