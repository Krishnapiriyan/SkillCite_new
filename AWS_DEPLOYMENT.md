# SkillCite AWS Deployment Guide

This guide provides a detailed, step-by-step walkthrough for deploying the **SkillCite** stack (Vite React frontend, Express API backend, and PostgreSQL database) on Amazon Web Services (AWS).

---

## Architecture Overview

To achieve a production-ready, highly secure, and cost-efficient setup, we will use the following AWS services:

| Component | AWS Service | Purpose |
| :--- | :--- | :--- |
| **Database** | **AWS RDS (PostgreSQL)** | Managed, secure, and auto-backups PostgreSQL database. |
| **Backend API** | **AWS App Runner** or **AWS EC2** | App Runner is managed, serverless container hosting (handles SSL, domains, and scaling automatically). EC2 is a standard Virtual Server (highly cost-effective for small/medium scale). |
| **User & Admin Portals** | **AWS S3 + CloudFront** | S3 hosts the compiled Vite static files. CloudFront serves as the CDN, enabling HTTPS, low latency, and SPA routing rewrites. |
| **Domain & SSL** | **Route 53 + ACM** | Managed DNS and free SSL certificates. |

---

## Prerequisites

1. An **AWS Account** with billing configured.
2. **Node.js** installed locally (to run migrations and build the frontend).
3. The **AWS CLI** installed and configured (optional, but helpful).
4. A **domain name** managed via AWS Route 53 (or pointing to CloudFront/App Runner).

---

## Step 1: Set up the Database (AWS RDS PostgreSQL)

### 1.1 Create the RDS Instance
1. Log in to the **AWS Management Console** and navigate to **RDS**.
2. Click **Create database**.
3. Choose **Standard create**.
4. Engine type: **PostgreSQL**. Select the latest version (e.g., PostgreSQL 15 or 16).
5. Templates: Select **Free Tier** (or **Dev/Test** for production scale).
6. **Settings:**
   * DB instance identifier: `skillcite-db`
   * Master username: `postgres`
   * Master password: *[Generate a secure password]*
7. **Instance configuration:** Choose `db.t3.micro` or `db.t4g.micro` (Free Tier eligible).
8. **Connectivity:**
   * Virtual private cloud (VPC): Default VPC.
   * Public access: **Yes** (if you want to run migrations from your local machine easily. In strict enterprise environments, select **No** and use a Bastion host).
   * VPC security group: Choose **Create new** and name it `skillcite-rds-sg`.
9. Click **Create database**. This takes 5-10 minutes.

### 1.2 Configure Security Group for Inbound Traffic
1. Go to **EC2 > Security Groups** and open `skillcite-rds-sg`.
2. Under **Inbound rules**, click **Edit inbound rules**.
3. Add a rule:
   * **Type:** PostgreSQL (Port 5432)
   * **Source:** `My IP` (to allow migration runs from your computer) and `Anywhere-IPv4` (`0.0.0.0/0` - needed temporarily for App Runner to connect, unless running inside the same VPC).

### 1.3 Run Database Migrations
1. Once the DB is active, copy the **Endpoint** from the RDS dashboard.
2. Construct your `DATABASE_URL` connection string:
   ```env
   DATABASE_URL="postgresql://postgres:[PASSWORD]@[RDS_ENDPOINT]:5432/postgres?schema=public&sslmode=require"
   ```
3. In your local terminal, navigate to the `backend` folder and run:
   ```bash
   cd backend
   npx prisma db push
   npm run seed
   ```

---

## Step 2: Deploy the Backend API (AWS App Runner)

AWS App Runner is the recommended approach for modern Node.js APIs. It handles building, scaling, load balancing, and SSL configuration automatically.

### 2.1 Set Up a GitHub Repository
1. Push your project to a private GitHub repository.
2. Ensure the `backend` folder is at the root or correctly referenced.

### 2.2 Create the App Runner Service
1. Go to **AWS App Runner** in the console and click **Create service**.
2. **Source:**
   * Repository type: **Source code repository**.
   * Connect to your GitHub account and select the repository.
   * Branch: `main` (or your deployment branch).
   * Deployment settings: **Automatic** (triggers a new build on git push).
3. **Configure Build:**
   * Runtime: **Node.js 18** (or newer).
   * Build command: `npm install && npm run build` (make sure your backend `package.json` build script compiles prisma: `prisma generate`).
   * Start command: `npm start`
   * Port: `3001` (or whatever port your backend listens to).
4. **Configure Service:**
   * Under **Environment variables**, add all production secrets:
     * `DATABASE_URL` = Your RDS PostgreSQL connection string.
     * `JWT_SECRET` = A secure random token.
     * `JWT_REFRESH_SECRET` = A different secure random token.
     * `NODE_ENV` = `production`
     * `PORT` = `3001`
     * `PUBLIC_API_URL` = *[Your App Runner default URL, configured after deployment]*
     * `CORS_ORIGINS` = `https://[YOUR_USER_FRONTEND_DOMAIN],https://[YOUR_ADMIN_FRONTEND_DOMAIN]`
     * `BREVO_API_KEY` = Your Brevo key.
     * `BREVO_SENDER_EMAIL` = Whitelisted sender email.
     * `BREVO_SENDER_NAME` = `SkillCite`
     * `ADMIN_ALERT_EMAIL` = Admin alert address.
     * `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`
     * `GROQ_API_KEY`
5. Click **Create & deploy**. App Runner will deploy your container and provide a public URL (e.g., `https://xxxx.us-east-1.awsapprunner.com`).

---

## Step 3: Deploy the Frontends (AWS S3 + CloudFront)

Both `user-portal` and `admin-portal` are static single-page apps (SPAs). We host them in S3 buckets and route traffic through CloudFront CDNs to enable routing and HTTPS.

### 3.1 Create S3 Buckets
1. Go to **S3** and click **Create bucket** (do this once for `user-portal` and once for `admin-portal`).
2. Bucket name: e.g., `skillcite-user-portal` and `skillcite-admin-portal`.
3. Object Ownership: **Bucket owner enforced**.
4. Block Public Access: **Keep checked** (CloudFront will access it securely using Origin Access Control).
5. Click **Create bucket**.

### 3.2 Build the Static Frontends Locally
Prepare the build by pointing Vite to the newly deployed AWS App Runner API:
1. Create a `.env.production` file in your local `user-portal` directory:
   ```env
   VITE_API_URL=https://[YOUR_APP_RUNNER_URL]/api
   ```
2. Create a `.env.production` file in your local `admin-portal` directory:
   ```env
   VITE_API_URL=https://[YOUR_APP_RUNNER_URL]/api
   ```
3. Compile the builds:
   ```bash
   # Build User Portal
   cd user-portal
   npm install
   npm run build # Generates files in /dist
   
   # Build Admin Portal
   cd ../admin-portal
   npm install
   npm run build # Generates files in /dist
   ```

### 3.3 Create CloudFront Distributions
Perform the following steps for **each** portal:
1. Navigate to **CloudFront** and click **Create distribution**.
2. **Origin:**
   * Origin domain: Select the corresponding S3 bucket (e.g., `skillcite-user-portal.s3.amazonaws.com`).
   * Origin access: Select **Origin access control settings (recommended)**. Click **Create control setting**, use defaults, and click **Create**.
3. **Default cache behavior:**
   * Viewer protocol policy: **Redirect HTTP to HTTPS**.
   * Allowed HTTP methods: `GET, HEAD`.
4. **Web Application Firewall (WAF):** Choose **Do not enable security protections** for now (or associate a WAF ACL if required).
5. **Settings:**
   * Price class: Use all edge locations (or Best performance).
   * Alternate domain name (CNAME): Add your custom domain (e.g., `skillcite.com` or `admin.skillcite.com`).
   * SSL certificate: Select custom SSL from **AWS Certificate Manager (ACM)** (must be created in the `us-east-1` region first).
   * Default root object: `index.html`.
6. Click **Create distribution**.
7. Copy the S3 bucket policy suggested by CloudFront in the banner, navigate back to your S3 bucket's **Permissions** tab, edit the **Bucket policy**, paste the JSON, and save.

### 3.4 Handle SPA Client-Side Routing (Crucial)
Vite React apps handle routing client-side. If a user reloads `/about` or `/request-talent` directly, CloudFront will return a 403/404 error from S3.
1. Go to your **CloudFront Distribution > Error pages** tab.
2. Click **Create custom error response**.
3. HTTP error code: **403: Forbidden** (S3 throws 403 on missing paths).
4. Customize error response: **Yes**.
5. Response page path: `/index.html`.
6. HTTP response code: **200: OK**.
7. Click **Create**. Repeat this configuration for **404: Not Found** error codes.

### 3.5 Upload Files to S3
1. In S3, open your bucket (e.g., `skillcite-user-portal`).
2. Upload the contents of your local `dist` folder directly (do not upload the `dist` folder itself, only its contents so `index.html` is at the root of the bucket).
3. Repeat for `admin-portal` into its respective bucket.

---

## Step 4: Configure DNS & Domains (AWS Route 53)

If you use Route 53 to manage your domain names:
1. Navigate to **Route 53 > Hosted Zones** and select your domain name.
2. Click **Create record**.
3. Select **Simple routing**.
4. Click **Define simple record**:
   * Record name: Leave blank (for root domain `example.com`) or type `admin` (for subdomain).
   * Value/Route traffic to: Select **Alias to CloudFront distribution**.
   * Choose your corresponding CloudFront distribution from the dropdown list.
5. Repeat the process to route your backend subdomain (e.g., `api.example.com`) to your **AWS App Runner** domain.

---

## Step 5: Verification & Redeploy Checklist

1. Navigate to your custom domain in the browser. Verify that the loading screen completes and client-side page navigation works.
2. Try submitting a test candidate CV and a test B2B talent request. Verify that:
   * The submissions successfully log in the database.
   * Brevo sends out confirmation emails (ensure the server IP is whitelisted on Brevo).
   * Files successfully save to the Cloudflare R2 bucket.
3. Log in to the admin portal custom domain to check the administration dashboard.
