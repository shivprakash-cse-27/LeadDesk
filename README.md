<<<<<<< HEAD
# LeadDesk Mini

A full-stack lead-capture product built with the **MERN stack** (MongoDB, Express, React, Node.js) + **Tailwind CSS v4**.

Public landing page for capturing leads + Admin dashboard for managing them, with real JWT authentication.

![LeadDesk Mini](https://img.shields.io/badge/Stack-MERN-green) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-blue) ![Auth](https://img.shields.io/badge/Auth-JWT-orange)

---

## 🚀 Live URLs

| Page | URL |
|:---|:---|
| **Landing Page** | _[Add your Vercel URL here]_ |
| **Admin Login** | _[Add your Vercel URL]/admin/login_ |
| **Admin Dashboard** | _[Add your Vercel URL]/admin_ |

### Test Credentials

| Field | Value |
|:---|:---|
| Email | `admin@leaddesk.com` |
| Password | `Admin123!` |

---

## 📦 Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS v4 + React Router v6 + Lucide Icons
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Auth**: JWT (Access + Refresh tokens) with HttpOnly cookies + bcrypt password hashing
- **Deployment**: Vercel (frontend) + Render (backend) + MongoDB Atlas (database)

---

## 📊 Data Model

### Lead Collection (`leads`)

| Field | Type | Constraints |
|:---|:---|:---|
| `name` | String | Required, trimmed, 2-100 chars |
| `email` | String | Required, valid email, lowercase |
| `budget` | String | Required, enum: `< $1K`, `$1K - $5K`, `$5K - $10K`, `$10K - $25K`, `$25K+` |
| `message` | String | Required, trimmed, 10-2000 chars |
| `status` | String | Enum: `New`, `Contacted`, `Closed` (default: `New`) |
| `createdAt` | Date | Auto-generated timestamp |
| `updatedAt` | Date | Auto-generated timestamp |

**Indexes**: `status` (for filtered queries), `createdAt` (for sorted listing)

### User Collection (`users`)

| Field | Type | Constraints |
|:---|:---|:---|
| `name` | String | Required, trimmed |
| `email` | String | Required, unique, valid email, lowercase |
| `password` | String | Required, bcrypt-hashed (min 8 chars raw) |
| `role` | String | Enum: `admin` (default: `admin`) |
| `createdAt` | Date | Auto-generated timestamp |
| `updatedAt` | Date | Auto-generated timestamp |

---

## 🔐 Auth Approach

### How Authentication Works

1. **Login Flow**:
   - User submits email + password to `POST /api/auth/login`
   - Server validates input with `express-validator`
   - Server looks up user by email, compares password using `bcrypt.compare()`
   - On success: generates two JWTs (access token + refresh token) and sets them as **HttpOnly cookies**
   - Returns user info (name, email, role) — **never** the password

2. **Token Strategy**:
   - **Access Token**: 15-minute expiry, used for API authorization
   - **Refresh Token**: 7-day expiry, used to silently renew the access token
   - Both stored in `HttpOnly` cookies (not localStorage) — **immune to XSS attacks**

3. **Route Protection**:
   - `protect` middleware on all `/api/leads` (GET) and `/api/leads/:id/status` (PATCH) routes
   - Middleware reads `accessToken` cookie → verifies with `jsonwebtoken` → attaches user to `req.user`
   - Returns `401 Unauthorized` if token missing/invalid/expired

4. **Session Persistence**:
   - On app load, frontend calls `GET /api/auth/me` to check if cookies contain a valid session
   - If valid → user is auto-logged in (no re-login needed until tokens expire)

5. **Logout**:
   - `POST /api/auth/logout` clears both cookies server-side
   - Frontend resets auth state

6. **Password Security**:
   - Passwords hashed with **bcrypt** (12 salt rounds)
   - Pre-save Mongoose hook ensures hashing on create and password change
   - Raw passwords **never** stored or logged

### Why Not localStorage?

Tokens in `localStorage` are vulnerable to XSS (any injected script can steal them). `HttpOnly` cookies **cannot be accessed by JavaScript**, providing an inherently more secure storage mechanism.

---

## 🏗️ Project Structure

```
task/
├── client/                    # React + Vite + Tailwind v4
│   ├── src/
│   │   ├── components/        # Navbar, Footer, Toast, ProtectedRoute
│   │   ├── context/           # AuthContext (login/logout/session)
│   │   ├── pages/             # LandingPage, AdminLogin, AdminDashboard
│   │   ├── utils/             # API helpers, form validation
│   │   ├── App.jsx            # Routes & layout
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Tailwind v4 theme + glassmorphism
│   ├── vite.config.js
│   └── package.json
├── server/                    # Express API
│   ├── config/db.js           # MongoDB connection
│   ├── models/                # Lead.js, User.js (Mongoose schemas)
│   ├── routes/                # leadRoutes.js, authRoutes.js
│   ├── middleware/            # auth.js (JWT), validate.js (express-validator)
│   ├── seed.js                # Admin user seeder
│   ├── server.js              # Express entry point
│   └── package.json
└── README.md
```

---

## 🛠️ Local Setup

### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB Atlas account (free tier) — [Create one here](https://www.mongodb.com/cloud/atlas)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/leaddesk-mini.git
cd leaddesk-mini
```

### 2. Setup Backend

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB Atlas URI and secrets
npm install
npm run seed    # Creates the default admin user
npm run dev     # Starts server on http://localhost:5000
```

**Environment Variables** (`.env`):
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/leaddesk
JWT_SECRET=your_random_jwt_secret_here
JWT_REFRESH_SECRET=your_random_refresh_secret_here
CLIENT_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
ADMIN_EMAIL=admin@leaddesk.com
ADMIN_PASSWORD=Admin123!
ADMIN_NAME=Admin User
```

### 3. Setup Frontend

```bash
cd client
cp .env.example .env   # Or create .env with content below
npm install
npm run dev    # Starts dev server on http://localhost:5173
```

**Frontend `.env`**:
```env
VITE_API_URL=http://localhost:5000
```

### 4. Open in Browser

- Landing Page: [http://localhost:5173](http://localhost:5173)
- Admin Login: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- Admin Dashboard: [http://localhost:5173/admin](http://localhost:5173/admin)

---

## ☁️ Deployment Guide

### MongoDB Atlas (Database)

1. Create a free M0 cluster at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user with read/write access
3. Under **Network Access**, add `0.0.0.0/0` to allow all IPs
4. Copy your connection string (SRV format)

### Render (Backend)

1. Push `server/` to a GitHub repo (or use the monorepo)
2. Create a **Web Service** on [render.com](https://render.com)
3. Connect your GitHub repo
4. Set **Root Directory**: `server`
5. Set **Build Command**: `npm install`
6. Set **Start Command**: `node server.js`
7. Add **Environment Variables**: `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CLIENT_URL` (your Vercel URL), `NODE_ENV=production`
8. After deployment, run the seed: `node seed.js` (via Render Shell)

### Vercel (Frontend)

1. Push `client/` to a GitHub repo
2. Import on [vercel.com](https://vercel.com)
3. Set **Root Directory**: `client`
4. Set **Framework Preset**: Vite
5. Add **Environment Variable**: `VITE_API_URL` = your Render backend URL
6. Deploy!

---

## 🔗 API Endpoints

| Method | Endpoint | Auth | Description |
|:---|:---|:---|:---|
| `POST` | `/api/leads` | Public | Submit a new lead |
| `GET` | `/api/leads` | Protected | List leads (search, filter, paginate) |
| `PATCH` | `/api/leads/:id/status` | Protected | Update lead status |
| `POST` | `/api/auth/login` | Public | Admin login |
| `POST` | `/api/auth/logout` | Public | Admin logout |
| `GET` | `/api/auth/me` | Protected | Get current user |
| `POST` | `/api/auth/refresh` | Public | Refresh access token |

---

## ✅ Features Checklist

- [x] Public landing page with lead capture form
- [x] Client-side validation (name, email, budget, message)
- [x] Server-side validation (express-validator)
- [x] MongoDB data storage with Mongoose
- [x] Admin login with JWT auth (not hardcoded)
- [x] HttpOnly cookie storage (XSS-resistant)
- [x] Access + Refresh token pattern
- [x] Admin dashboard with stats cards
- [x] Search leads by name/email
- [x] Filter leads by status (All/New/Contacted/Closed)
- [x] Status toggle: New → Contacted → Closed
- [x] Responsive design (mobile-first)
- [x] Dark theme with glassmorphism
- [x] Micro-animations and transitions
- [x] Footer credit: "Built for Digital Heroes Training Task"
- [x] Production build verified

---

## 📝 License

Built for **Digital Heroes Training Task** — [digitalheroesco.com](https://digitalheroesco.com)
=======
# LeadDesk
>>>>>>> 20b0a81820941dd6df76079b96a7586826294a61
