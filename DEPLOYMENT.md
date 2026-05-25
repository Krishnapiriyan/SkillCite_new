# SkillCite deployment (Vercel + Railway + Neon)

## Architecture

| Service | Hosts | URL (yours) |
|---------|--------|-------------|
| **User site** | Vercel (`user-portal`) | https://skill-cite-new.vercel.app |
| **Admin site** | Vercel (`admin-portal`) | https://skill-cite-new-min.vercel.app |
| **API** | Railway (`backend`) | https://skillcitenew-production.up.railway.app |
| **Database** | Neon (Postgres) | Connection string → Railway `DATABASE_URL` |

The API root (`/`) and `GET /api/health` should return JSON after redeploy.  
Visiting Railway in the browser is **not** the user-facing app — the Vercel URLs are.

---

## 1. Neon (database)

1. Create a project and copy the **pooled** connection string (`?sslmode=require`).
2. In **Railway → backend service → Variables**, set:
   - `DATABASE_URL` = Neon pooled URL (not `localhost`).
3. One-time schema (from your machine or Railway shell):
   ```bash
   cd backend
   npx prisma db push
   npm run seed
   ```

---

## 2. Railway (backend)

**Root directory:** `backend`  
**Start command:** `npm start`  
**Build command:** `npm run build` (runs `prisma generate`)

### Required variables

| Variable | Example / notes |
|----------|-----------------|
| `DATABASE_URL` | Neon pooled URL |
| `JWT_SECRET` | Long random string |
| `JWT_REFRESH_SECRET` | Different long random string |
| `NODE_ENV` | `production` |
| `PORT` | Railway sets this automatically — do not hardcode |
| `PUBLIC_API_URL` | `https://skillcitenew-production.up.railway.app` |
| `CORS_ORIGINS` | `https://skill-cite-new.vercel.app,https://skill-cite-new-min.vercel.app` |

Optional: `R2_*`, `BREVO_*`, `GROQ_API_KEY` (same as local `.env`).

After saving variables, **Redeploy** the Railway service.

Verify:

```text
GET https://skillcitenew-production.up.railway.app/api/health
GET https://skillcitenew-production.up.railway.app/api/cms
```

---

## 3. Vercel (frontends)

Create **two** Vercel projects (or one monorepo with two root directories):

| Project | Root directory | Domain |
|---------|----------------|--------|
| User | `user-portal` | skill-cite-new.vercel.app |
| Admin | `admin-portal` | skill-cite-new-min.vercel.app |

### Build settings (each)

- **Framework:** Vite  
- **Build command:** `npm run build`  
- **Output directory:** `dist`  
- **Install command:** `npm install`

### Environment variable (each project, Production)

```env
VITE_API_URL=https://skillcitenew-production.up.railway.app/api
```

Important: changing `VITE_API_URL` requires a **new deployment** (rebuild). It is embedded at build time.

`vercel.json` in each portal enables client-side routes (`/about`, `/request-talent`, etc.).

After env + code changes: **Deployments → Redeploy**.

---

## 4. Common “not working” symptoms

| Symptom | Cause | Fix |
|---------|--------|-----|
| Railway `/` shows “Cannot GET /” | Old deploy without root route | Redeploy backend after pull |
| Vercel `/about` is 404 | Missing SPA rewrite | `vercel.json` + redeploy |
| Site stuck on black intro ~15s | Intro video pointed at `localhost` | Fixed in code; set `home.loading.videoUrl` in CMS or redeploy |
| Forms fail, API calls to `localhost` | `VITE_API_URL` not set on Vercel build | Set env and **redeploy** both frontends |
| CORS error in browser console | Railway `CORS_ORIGINS` missing Vercel URL | Add both Vercel URLs, redeploy Railway |
| API 500 / DB errors | `DATABASE_URL` still localhost | Use Neon URL on Railway |

---

## 5. Redeploy checklist

1. Push this repo to GitHub (connected to Vercel + Railway).
2. Railway: confirm `DATABASE_URL`, `PUBLIC_API_URL`, `CORS_ORIGINS` → Redeploy.
3. Vercel (both): confirm `VITE_API_URL` → Redeploy.
4. Test user site home + `/about` + submit a form.
5. Test admin login at min URL.
