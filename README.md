

# ✈ Trao — AI-Powered Travel Planner

**Generate personalized trip itineraries, hotel picks, and budget plans in seconds — powered by Google Gemini AI.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-trao--orcin.vercel.app-black?style=for-the-badge&logo=vercel)](https://trao-orcin.vercel.app)
[![API](https://img.shields.io/badge/API-trao--ivu1.onrender.com-3ECF8E?style=for-the-badge&logo=render)](https://trao-ivu1.onrender.com/api/health)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-4-lightgrey?style=flat-square&logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)](https://mongodb.com)



---

## 🔗 Live Links

| Resource | URL |
|---|---|
| 🌐 **Frontend (Production)** | https://trao-orcin.vercel.app |
| 🛠 **Backend API (Production)** | https://trao-ivu1.onrender.com |
| ❤️ **Health Check** | https://trao-ivu1.onrender.com/api/health |

### 🧪 Test Credentials

> Use these to log in and explore the app immediately without registering.

| Field | Value |
|---|---|
| **Email** | `sagarsagar5029@gmail.com` |
| **Password** | `123456` |

---

## 📖 Overview

**Trao** is a full-stack AI travel planning application. Users describe where they want to go, how many days, their budget tier, and their interests — and the app generates a complete, editable travel plan:

- 📅 Day-by-day itinerary (morning / afternoon / evening)
- 🏨 Hotel recommendations matched to budget
- 💰 Itemized budget breakdown (accommodation, food, transport, activities)
- 🎒 Smart packing checklist
- ✏️ Inline itinerary editing
- 🔄 AI-powered day regeneration

---

## ✨ Features

| Feature | Description |
|---|---|
| **AI Itinerary Generation** | Gemini 1.5 Flash generates personalized day-by-day plans |
| **Smart Fallback Engine** | Rule-based generator kicks in if the AI is unavailable — app always works |
| **Hotel Recommendations** | Budget / Moderate / Luxury hotel picks per destination |
| **Budget Breakdown** | Per-category cost estimates (accommodation, food, transport, activities) |
| **Packing Checklist** | AI-curated or rule-based packing list for each trip |
| **Edit Itinerary** | Modify any day's activities directly in the UI |
| **Regenerate Day** | Re-run AI on any single day for a fresh itinerary |
| **Trip Dashboard** | View all your saved trips with stats (total days, budget, destinations) |
| **Secure Auth** | JWT stored in HTTP-only cookies — immune to XSS attacks |
| **User Isolation** | Every query is scoped to `userId` — users can only access their own data |
| **Fully Responsive** | Works on mobile, tablet, and desktop |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 15** (App Router) | React framework with SSR/CSR hybrid routing |
| **TypeScript** | Type-safe component and context development |
| **Vanilla CSS** | Custom design system, no Tailwind dependency |
| **Axios** | HTTP client with request/response interceptors |
| **React Context API** | Global authentication state (`AuthContext`) |
| **Vercel** | Production deployment with automatic CI/CD |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **TypeScript** | Strongly typed controllers, middleware, and models |
| **MongoDB + Mongoose** | Document database with schema validation |
| **Google Gemini 1.5 Flash** | AI trip plan generation (fast, structured JSON output) |
| **JSON Web Tokens (JWT)** | Stateless authentication |
| **bcryptjs** | Password hashing (salt rounds: 12) |
| **cookie-parser** | HTTP-only cookie management |
| **Render** | Production deployment with auto-deploy on push |

---

## 🏗 Architecture

```
trao/
├── my-app/                     # Next.js 15 Frontend
│   └── src/
│       ├── app/                # App Router pages
│       │   ├── page.tsx        # Landing page
│       │   ├── login/          # Login page
│       │   ├── register/       # Register page
│       │   ├── dashboard/      # User trip dashboard
│       │   └── trips/
│       │       ├── new/        # Trip creation form
│       │       └── [id]/       # Trip detail view
│       ├── components/
│       │   ├── auth/           # LoginForm, RegisterForm
│       │   ├── layout/         # ProtectedRoute guard
│       │   ├── trips/          # TripForm, TripCard, DayItinerary, HotelCard, BudgetSummary
│       │   └── ui/             # Navbar, Button, Input, LoadingSpinner
│       ├── context/
│       │   └── AuthContext.tsx # Global auth state + login/logout/register actions
│       ├── lib/
│       │   └── axios.ts        # Axios instance with interceptors
│       └── types/              # Shared TypeScript interfaces
│
└── backend/                    # Express + TypeScript API
    └── src/
        ├── config/             # DB connection, env validation
        ├── controllers/        # authController, tripController
        ├── middleware/         # authMiddleware (JWT protect), errorMiddleware
        ├── models/             # User.ts, Trip.ts (Mongoose schemas)
        ├── routes/             # authRoutes, tripRoutes
        ├── services/
        │   └── aiService.ts    # Gemini AI integration + rule-based fallback
        ├── types/              # Shared TypeScript types (AuthRequest, JwtPayload, etc.)
        ├── utils/
        │   └── generateToken.ts # JWT creation + cookie helpers
        └── server.ts           # Express app entry point
```

---

## 🔌 API Reference

**Base URL:** `https://trao-ivu1.onrender.com/api`

### Auth Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Create a new user account |
| `POST` | `/auth/login` | Public | Authenticate and set session cookie |
| `GET` | `/auth/me` | Private | Get the currently authenticated user |
| `POST` | `/auth/logout` | Private | Clear the session cookie |

### Trip Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/trips` | Private | Create a new AI-generated trip |
| `GET` | `/trips` | Private | List all trips for the logged-in user |
| `GET` | `/trips/:id` | Private | Get full trip details by ID |
| `PUT` | `/trips/:id/day/:dayNumber` | Private | Manually edit a specific day's itinerary |
| `POST` | `/trips/:id/day/:dayNumber/regenerate` | Private | Regenerate a day using AI |
| `DELETE` | `/trips/:id` | Private | Delete a trip |

### Example: Create Trip Request

```json
POST /api/trips
Content-Type: application/json

{
  "destination": "Tokyo, Japan",
  "numberOfDays": 5,
  "budgetType": "moderate",
  "interests": ["culture", "food", "nature"]
}
```

### Example: Create Trip Response

```json
{
  "success": true,
  "message": "Trip created successfully",
  "meta": {
    "generatedBy": "gemini",
    "generationModel": "gemini-1.5-flash",
    "source": "🤖 Real AI — powered by gemini-1.5-flash"
  },
  "data": {
    "_id": "...",
    "destination": "Tokyo, Japan",
    "numberOfDays": 5,
    "budgetType": "moderate",
    "itinerary": [...],
    "hotels": [...],
    "budget": { "accommodation": 600, "food": 440, "transportation": 330, "activities": 550, "total": 1920, "currency": "USD" },
    "packingChecklist": [...]
  }
}
```

---

## 🔐 Authentication & Security

- **JWT** tokens are issued on login/register and stored in **HTTP-only cookies** — never accessible to JavaScript, preventing XSS token theft.
- **`sameSite: 'none'`** with **`secure: true`** in production enables cross-origin cookie sharing between Vercel (frontend) and Render (backend).
- **`bcryptjs`** with **12 salt rounds** is used for password hashing — industry-standard strength.
- All trip routes are guarded by the `protect` middleware which validates the JWT and attaches `req.user`.
- **User data isolation** — every Trip query includes `userId: req.user.id` so users can never read or modify each other's data.

---

## 🤖 AI Generation — How It Works

1. User submits destination, days, budget, and interests via the form.
2. The backend calls **Google Gemini 1.5 Flash** with a structured prompt requesting valid JSON output.
3. Gemini returns a complete trip plan (itinerary + hotels + budget + packing list).
4. A **90-second `AbortController` timeout** ensures Gemini hangs fail gracefully.
5. If Gemini is unavailable or errors out, the **rule-based fallback engine** generates a plan using curated local data — the app never shows a blank error to the user.
6. The `generatedBy` field (`"gemini"` or `"fallback"`) is stored on each trip so the source is always transparent.

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas connection string)
- Google Gemini API Key ([get one free here](https://aistudio.google.com/app/apikey))

### 1. Clone the Repository

```bash
git clone https://github.com/vidhyasagar70/trao.git
cd trao
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/trao
JWT_SECRET=your_super_secret_jwt_key_minimum_32_chars
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the backend:

```bash
npm run dev
```

> Backend runs on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd my-app
npm install
```

Create `my-app/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

> Frontend runs on `http://localhost:3000`

---

## 🌍 Production Deployment

### Backend — Render

| Env Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Strong random secret (≥32 chars) |
| `JWT_EXPIRES_IN` | `7d` |
| `CLIENT_URL` | `https://trao-orcin.vercel.app` |
| `GEMINI_API_KEY` | Your Gemini API key |

### Frontend — Vercel

| Env Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://trao-ivu1.onrender.com/api` |

---

## 📁 Key Design Decisions

### Why HTTP-only Cookies (not localStorage)?
LocalStorage is vulnerable to XSS attacks — any injected script can steal the token. HTTP-only cookies are inaccessible to JavaScript entirely.

### Why a Fallback Engine?
AI APIs can be slow, rate-limited, or down. The rule-based engine guarantees the core feature (trip generation) always works, making the product reliable for production use.

### Why `gemini-1.5-flash`?
`gemini-2.5-flash` is a reasoning model optimized for complex multi-step tasks — it's unnecessarily slow (60–120s) for structured JSON generation. `gemini-1.5-flash` is purpose-built for fast, high-quality structured output, responding in 5–15 seconds.

### Why Compound MongoDB Index?
```js
tripSchema.index({ userId: 1, createdAt: -1 });
```
This index makes the dashboard query (user's trips sorted by newest) a fast index scan instead of a full collection scan — important at scale.

---


