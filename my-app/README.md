# 🧠 AI Travel Planner — Complete Learning Guide

> **From Beginner to Advanced** — Everything you need to understand how this application was designed, built, and how it works internally.

---

## 📑 Table of Contents

1. [What Is This Application?](#1-what-is-this-application)
2. [Does It Use a Real AI / LLM?](#2-does-it-use-a-real-ai--llm)
3. [Tech Stack Explained (Beginner)](#3-tech-stack-explained-beginner)
4. [Project Folder Structure](#4-project-folder-structure)
5. [How the Backend Works](#5-how-the-backend-works)
6. [How Authentication Works](#6-how-authentication-works)
7. [How Plans Are Generated (The AI Engine)](#7-how-plans-are-generated-the-ai-engine)
8. [How the Frontend Works](#8-how-the-frontend-works)
9. [How Data Flows — Request to Response](#9-how-data-flows--request-to-response)
10. [Database Design](#10-database-design)
11. [Security Deep Dive](#11-security-deep-dive)
12. [Advanced Concepts](#12-advanced-concepts)
13. [How to Upgrade to a Real LLM](#13-how-to-upgrade-to-a-real-llm)
14. [Common Interview Questions About This App](#14-common-interview-questions-about-this-app)

---

## 1. What Is This Application?

**AI Travel Planner** is a full-stack web application that:

1. Lets users **register and log in** (with secure JWT authentication)
2. Lets users **create travel trips** by entering destination, number of days, budget, and interests
3. **Automatically generates** a day-by-day travel itinerary, hotel recommendations, and budget breakdown
4. Lets users **edit any day** of their itinerary
5. Lets users **regenerate** any specific day for a fresh plan
6. Strictly ensures **users cannot see each other's trips** (data isolation)

### The Technology Split

```
Your Computer
│
├── Backend (Port 5000) ← Node.js + Express + MongoDB
│   Handles: API, authentication, database, plan generation
│
└── Frontend (Port 3000) ← Next.js + React + TypeScript
    Handles: UI, user interactions, calling the backend
```

Think of the **backend** as a restaurant kitchen (hidden, processes orders) and the **frontend** as the dining room (what you see and interact with).

---

## 2. Does It Use a Real AI / LLM?

### ❌ No. This app does NOT use ChatGPT, Gemini, Claude, or any AI LLM.

This is one of the most important things to understand. The word "AI" in the name is **marketing language** for what is actually a **rule-based generation system** — also called a **deterministic algorithm**.

### What is the difference?

| Feature | Real AI (LLM like GPT-4) | This App (Rule-Based) |
|---|---|---|
| How it works | Neural network with billions of parameters | Pre-written templates + logic |
| Cost | Pays per API call ($$$) | Free, runs offline |
| Output quality | Dynamic, creative, context-aware | Predictable, template-based |
| Requires internet | Yes (API calls) | No |
| Response time | 2–10 seconds | Milliseconds |
| Can hallucinate | Yes | No |
| Customizable to destination | Yes (Tokyo vs Paris differ) | No (same templates for all) |

### How the "AI" actually works in this app

```
User Input: { destination: "Tokyo", days: 3, budget: "luxury", interests: ["food", "culture"] }

↓

aiService.ts runs these steps:
1. Look up hotel templates for "luxury" → returns Grand Prestige + Pinnacle Suites
2. Calculate budget multiplier: luxury = 5x
3. For each day (1, 2, 3):
   a. Pick a day theme from a list of 10 themes
   b. Pick activities based on interests ("food", "culture") rotating by day
   c. Pick random meals from the luxury meal list
   d. Scale all costs by 5x multiplier
4. Return the assembled plan

Output: A structured JSON plan (looks like AI but is pure logic)
```

This approach is called a **Service Layer Pattern** — the controller doesn't know HOW the plan is generated, it just calls `generateItinerary()` and gets a result. This means you can later **swap the rule-based engine for a real LLM** without changing any other file.

---

## 3. Tech Stack Explained (Beginner)

### 🖥️ Backend Technologies

#### Node.js
- JavaScript runtime that runs **outside the browser** (on the server)
- Normally JavaScript only runs in browsers; Node.js lets you use it on servers
- Think of it as: "Chrome's JavaScript engine, but standalone"

#### Express.js
- A minimal web framework for Node.js
- Lets you define **routes** (URLs) and what happens when they're visited
- Example: When browser visits `POST /api/auth/login`, Express calls your `login` function

```typescript
// Express Route Example
app.post('/api/auth/login', loginController);
//       ↑ URL path         ↑ function to call
```

#### MongoDB
- A **NoSQL database** — stores data as JSON-like documents instead of tables
- Great for flexible data like trips (which have variable-length itineraries)
- Each piece of data is called a **document**, groups are called **collections**

#### Mongoose
- A library that makes working with MongoDB easier in Node.js
- Lets you define **schemas** (blueprints) for your data
- Adds validation, type-checking, and helper methods

```typescript
// Mongoose Schema Example
const userSchema = new Schema({
  name: { type: String, required: true },    // must have name
  email: { type: String, unique: true },      // must be unique
  password: { type: String, select: false },  // hidden by default
});
```

#### JWT (JSON Web Token)
- A secure way to prove "who you are" to the server
- Like a **digital ID card** — the server gives you one at login, you show it on every request
- Stored in HTTP-only cookies so JavaScript cannot steal it

#### bcryptjs
- Used to **hash passwords** — turn "MyPassword123" into unreadable garbage like `$2a$12$abc...`
- Even if your database is hacked, passwords cannot be recovered
- Uses "salt rounds" (12 in our app) — more rounds = slower but more secure

### 🌐 Frontend Technologies

#### Next.js
- A **React framework** that adds routing, server-side rendering, and more to React
- We use the **App Router** (the modern way since Next.js 13)
- Handles file-based routing: `src/app/dashboard/page.tsx` → `/dashboard` URL

#### TypeScript
- JavaScript with **type safety** added
- Instead of `let name = "Alice"` you write `let name: string = "Alice"`
- Catches errors at **compile time** (before running) instead of runtime (when users see it)

#### Tailwind CSS
- A **utility-first CSS framework** — instead of writing CSS files, you add classes directly in HTML
- Example: `className="bg-violet-600 text-white rounded-xl p-4"` 
- We use Tailwind v4 which uses `@import "tailwindcss"` instead of directives

#### Axios
- A library for making **HTTP requests** from the frontend to the backend
- Configured with `withCredentials: true` so cookies are sent automatically
- Has **interceptors** — code that runs before every request/response

#### Context API
- A built-in React feature for **sharing state** across many components without prop drilling
- Used here to share `user`, `isAuthenticated`, `login()`, `logout()` everywhere in the app

---

## 4. Project Folder Structure

```
trao/
│
├── backend/                    ← The server application
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts           ← Connects to MongoDB
│   │   │   └── env.ts          ← Reads .env variables safely
│   │   │
│   │   ├── controllers/        ← Handle HTTP requests & responses
│   │   │   ├── authController.ts
│   │   │   └── tripController.ts
│   │   │
│   │   ├── middleware/         ← Code that runs BETWEEN request and controller
│   │   │   ├── authMiddleware.ts   ← Checks JWT token
│   │   │   └── errorMiddleware.ts  ← Catches all errors globally
│   │   │
│   │   ├── models/             ← MongoDB schemas (database blueprints)
│   │   │   ├── User.ts
│   │   │   └── Trip.ts
│   │   │
│   │   ├── routes/             ← URL definitions
│   │   │   ├── authRoutes.ts
│   │   │   └── tripRoutes.ts
│   │   │
│   │   ├── services/           ← Business logic (the "AI" engine)
│   │   │   └── aiService.ts
│   │   │
│   │   ├── types/              ← TypeScript type definitions
│   │   │   └── index.ts
│   │   │
│   │   └── server.ts           ← The main entry point — starts the server
│   │
│   ├── .env                    ← Secret configuration (never commit this!)
│   ├── package.json            ← Dependencies list
│   └── tsconfig.json           ← TypeScript configuration
│
└── my-app/                     ← The frontend application
    ├── src/
    │   ├── app/                ← Next.js pages (file = URL route)
    │   │   ├── layout.tsx      ← Wraps ALL pages (Navbar, AuthProvider)
    │   │   ├── page.tsx        ← Home page (/)
    │   │   ├── login/page.tsx  ← Login page (/login)
    │   │   ├── register/page.tsx
    │   │   ├── dashboard/page.tsx
    │   │   └── trips/
    │   │       ├── new/page.tsx
    │   │       └── [id]/page.tsx  ← Dynamic route, [id] = any trip ID
    │   │
    │   ├── components/         ← Reusable UI pieces
    │   │   ├── auth/           ← Login/Register forms
    │   │   ├── layout/         ← ProtectedRoute wrapper
    │   │   ├── trips/          ← Trip-specific components
    │   │   └── ui/             ← Generic: Button, Input, Modal, etc.
    │   │
    │   ├── context/
    │   │   └── AuthContext.tsx ← Global authentication state
    │   │
    │   ├── lib/
    │   │   └── axios.ts        ← Pre-configured HTTP client
    │   │
    │   └── types/
    │       └── index.ts        ← TypeScript interfaces
    │
    ├── .env.local              ← Frontend secrets (API URL)
    └── package.json
```

### The MVC Pattern (Model-View-Controller)

The backend follows **MVC architecture**:

```
Request → Routes → Controller → Model (DB) → Controller → Response
                       ↕
                    Service
                  (business logic)
```

- **Model** → `User.ts`, `Trip.ts` — what data looks like
- **View** → the frontend (Next.js) — what users see
- **Controller** → `authController.ts`, `tripController.ts` — handles requests
- **Service** → `aiService.ts` — complex business logic (separated from controller)

---

## 5. How the Backend Works

### The Entry Point: `server.ts`

When you run `npm run dev` in the backend, Node.js starts `server.ts`:

```typescript
// 1. Connect to MongoDB
connectDB();

// 2. Set up middleware (code that runs on EVERY request)
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());        // Parse JSON request bodies
app.use(cookieParser());        // Read cookies from requests

// 3. Register routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);

// 4. Handle errors
app.use(notFound);    // Called if no route matched
app.use(errorHandler); // Called if any route threw an error

// 5. Listen on port 5000
app.listen(5000);
```

### Middleware Chain

Every request passes through a **chain** of middleware:

```
HTTP Request
     ↓
[CORS Middleware]      ← Allow requests from localhost:3000
     ↓
[JSON Parser]          ← Convert request body from text to object
     ↓
[Cookie Parser]        ← Read cookies from the request headers
     ↓
[auth Middleware]      ← (only on protected routes) Verify JWT token
     ↓
[Your Controller]      ← Actually handle the request
     ↓
[Error Handler]        ← If anything threw an error, catch it here
     ↓
HTTP Response
```

### API Routes Overview

```
PUBLIC (no login required):
POST /api/auth/register     → Create account
POST /api/auth/login        → Login, receive JWT cookie
GET  /api/health            → Check if server is alive

PROTECTED (login required — JWT cookie must be present):
GET    /api/auth/me                           → Get your profile
POST   /api/auth/logout                       → Clear JWT cookie
POST   /api/trips                             → Create a new trip
GET    /api/trips                             → Get all YOUR trips
GET    /api/trips/:id                         → Get one specific trip
PUT    /api/trips/:id/day/:dayNumber          → Edit a day
POST   /api/trips/:id/day/:dayNumber/regenerate → Regenerate a day
DELETE /api/trips/:id                         → Delete a trip
```

---

## 6. How Authentication Works

This is the most important security concept in the app.

### Step 1: Registration

```
User fills form → POST /api/auth/register → { name, email, password }
                                                      ↓
                                            bcrypt.hash(password, 12)
                                            → "$2a$12$abcxyz..."  (hashed)
                                                      ↓
                                            Save to MongoDB
                                                      ↓
                                            Generate JWT token
                                            → "eyJhbGci..." (signed token)
                                                      ↓
                                            Set HTTP-only cookie:
                                            Set-Cookie: token=eyJhbGci...; HttpOnly; SameSite=Strict
                                                      ↓
                                            Return user data (no password)
```

### Step 2: Login

```
User fills form → POST /api/auth/login → { email, password }
                                                  ↓
                                         Find user in DB (with password field)
                                                  ↓
                                         bcrypt.compare(inputPassword, hashedPassword)
                                         → true or false
                                                  ↓
                                         If true: generate JWT + set cookie
                                         If false: return 401 Unauthorized
```

### Step 3: Authenticated Requests

```
Browser makes any protected request
→ Browser automatically sends cookies in every request
→ authMiddleware runs:
    1. Read cookie: req.cookies.token
    2. jwt.verify(token, JWT_SECRET) → decoded { id: "user123" }
    3. User.findById("user123") → find user in DB
    4. Attach to request: req.user = { id, name, email }
    5. Call next() → pass to the actual controller
```

### Step 4: Logout

```
POST /api/auth/logout
→ Set cookie to empty string with expiry in the past:
  Set-Cookie: token=; Expires=Thu 01 Jan 1970; HttpOnly
→ Browser deletes the cookie
→ Future requests have no cookie → rejected with 401
```

### Why HTTP-only Cookies (not localStorage)?

| Storage | Can JS read it? | XSS Safe? | CSRF Risk? |
|---------|-----------------|-----------|------------|
| localStorage | ✅ Yes | ❌ No (XSS can steal it) | ✅ No |
| HTTP-only Cookie | ❌ No | ✅ Yes | ⚠️ Needs sameSite |
| Memory (variable) | ✅ Yes | ❌ No | ✅ No |

We use **HTTP-only cookies** + `sameSite: strict` which means:
- JavaScript (including malicious scripts) **cannot read** the token
- The cookie is only sent to **the same site** (prevents CSRF attacks)
- This is the most secure approach for web apps

---

## 7. How Plans Are Generated (The AI Engine)

### The Big Picture

```typescript
// When user creates a trip:
POST /api/trips → tripController.createTrip()
                → aiService.generateHotels(budgetType)
                → aiService.generateItinerary(destination, days, budgetType, interests)
                → aiService.generateBudget(days, budgetType, hotels)
                → Save everything to MongoDB
                → Return complete trip
```

### The Data: What's Hardcoded

The service has **4 types of hardcoded data**:

#### 1. Budget Multipliers
```typescript
const BUDGET_MULTIPLIER = {
  budget: 1,      // base prices
  moderate: 2.2,  // 2.2x the base price
  luxury: 5,      // 5x the base price
};
```
Every cost in the app is calculated using this multiplier.

#### 2. Hotel Templates (per budget type)
```typescript
const HOTEL_DATA = {
  budget: [
    { name: 'The Wanderer Hostel', pricePerNight: 25, rating: 3, ... },
    { name: 'Budget Inn Express',  pricePerNight: 45, rating: 3, ... },
  ],
  moderate: [
    { name: 'City Comfort Hotel',       pricePerNight: 120, rating: 4, ... },
    { name: 'The Boutique Collection',  pricePerNight: 150, rating: 4, ... },
  ],
  luxury: [
    { name: 'The Grand Prestige',           pricePerNight: 450, rating: 5, ... },
    { name: 'Pinnacle Suites & Residences', pricePerNight: 650, rating: 5, ... },
  ],
};
```
**Note:** These hotels are fictional. They are the same hotels regardless of destination. Tokyo and Paris both get "The Grand Prestige". A real LLM would give actual Tokyo hotels.

#### 3. Activity Templates (per interest category)
```typescript
const ACTIVITY_TEMPLATES = {
  culture: [
    { time: '10:00 AM', name: 'Historic Museum Visit', cost: 15, ... },
    { time: '02:00 PM', name: 'Ancient Temple Tour',   cost: 20, ... },
    { time: '04:00 PM', name: 'Arts & Crafts Workshop', cost: 35, ... },
  ],
  food: [ ... ],
  adventure: [ ... ],
  nature: [ ... ],
  shopping: [ ... ],
  relaxation: [ ... ],
};
```

#### 4. Meal Suggestions (per budget type)
```typescript
const MEAL_SUGGESTIONS = {
  budget: {
    breakfast: ['Street-side café breakfast', 'Local bakery croissants', ...],
    lunch: ['Street food stall noodles', ...],
    dinner: ['Night market street food', ...],
  },
  moderate: { ... },
  luxury: { ... },
};
```

### The Algorithm: How a Day is Built

```typescript
function buildOneDay(dayIndex, destination, budgetType, interests) {
  
  // Step 1: Pick a theme (cycles through 10 themes)
  const theme = DAY_THEMES[dayIndex % 10];
  // Day 0 → "Arrival & First Impressions"
  // Day 1 → "Deep Dive into Local Culture"
  // Day 2 → "Hidden Gems Discovery"
  // etc.

  // Step 2: Determine primary and secondary interests for THIS day
  // If interests = ["food", "culture"]
  // Day 0: primary = "food", secondary = "culture"
  // Day 1: primary = "culture", secondary = "food"
  // Day 2: primary = "food", secondary = "culture"  (rotates back)
  const primaryInterest = interests[dayIndex % interests.length];
  const secondaryInterest = interests[(dayIndex + 1) % interests.length];

  // Step 3: Pick activities from templates and scale their cost
  const activities = [
    ACTIVITY_TEMPLATES[primaryInterest][0] * budgetMultiplier,
    ACTIVITY_TEMPLATES[secondaryInterest][1] * budgetMultiplier,
    ACTIVITY_TEMPLATES[primaryInterest][2] * budgetMultiplier,
  ];

  // Step 4: Pick random meals from the budget-appropriate list
  const meals = {
    breakfast: randomFrom(MEAL_SUGGESTIONS[budgetType].breakfast),
    lunch:     randomFrom(MEAL_SUGGESTIONS[budgetType].lunch),
    dinner:    randomFrom(MEAL_SUGGESTIONS[budgetType].dinner),
  };

  // Step 5: Build a title
  const title = dayIndex === 0
    ? `Welcome to ${destination} — ${theme}`
    : `${destination} Day ${dayIndex + 1} — ${theme}`;

  return { day, title, activities, meals, notes };
}
```

### Regenerate vs Original Plan

When you click "Regenerate Day", it calls `regenerateDayPlan()`:
- Same logic, but the theme index is **offset by +3** (for variety)
- Activities use `dayNumber + 3` as the index (different rotation)
- Result: looks fresh but uses the same pool of templates

---

## 8. How the Frontend Works

### Next.js App Router

In Next.js 15, every **file named `page.tsx`** inside `src/app/` becomes a URL route:

```
src/app/page.tsx              → localhost:3000/
src/app/login/page.tsx        → localhost:3000/login
src/app/register/page.tsx     → localhost:3000/register
src/app/dashboard/page.tsx    → localhost:3000/dashboard
src/app/trips/new/page.tsx    → localhost:3000/trips/new
src/app/trips/[id]/page.tsx   → localhost:3000/trips/abc123  (any ID)
```

The `[id]` in square brackets means it's a **dynamic route** — the value becomes a parameter you can read with `useParams()`.

### The Layout System

`src/app/layout.tsx` wraps **ALL pages** — it's like a master template:

```tsx
// layout.tsx runs on every page
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>      {/* Makes user data available everywhere */}
          <Navbar />         {/* Always visible at top */}
          <main>{children}</main>  {/* The actual page goes here */}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### Authentication Context — How State is Shared

The **Context API** is React's built-in solution for "global state" — data that many components need:

```tsx
// AuthContext.tsx

// 1. Create the context (defines the "shape" of what we share)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Create the Provider (holds the actual state and functions)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app load, check if we're already logged in
  useEffect(() => {
    axiosInstance.get('/auth/me')
      .then(response => setUser(response.data.data))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await axiosInstance.post('/auth/login', { email, password });
    setUser(data.data);
    router.push('/dashboard');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}  {/* All children can access these values */}
    </AuthContext.Provider>
  );
};

// 3. Custom hook for easy access
export const useAuth = () => useContext(AuthContext);
```

Any component can now do this:
```tsx
// In any component, anywhere in the app:
const { user, isAuthenticated, logout } = useAuth();
```

### Protected Routes

The `ProtectedRoute` component guards pages from unauthenticated access:

```tsx
// How a protected page works:
export default function DashboardPage() {
  return (
    <ProtectedRoute>      {/* ← This wrapper checks auth */}
      <div>Dashboard content here</div>
    </ProtectedRoute>
  );
}

// Inside ProtectedRoute:
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');  // Redirect if not logged in
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return null;
  return <>{children}</>;  // Render the actual page
}
```

### The Axios Instance

Instead of configuring Axios every time, we create one configured instance:

```typescript
// lib/axios.ts
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,   // ← This sends cookies automatically!
  timeout: 15000,
});

// Interceptor: runs before EVERY request
axiosInstance.interceptors.request.use(config => {
  // Could add headers here
  return config;
});

// Interceptor: runs after EVERY response
axiosInstance.interceptors.response.use(
  response => response,  // Success: pass through
  error => {
    if (error.response?.status === 401) {
      // If "not authorized", redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 9. How Data Flows — Request to Response

Let's trace what happens when a user creates a trip:

### Step-by-Step Flow: "Create Trip"

```
1. USER fills TripForm.tsx:
   destination = "Paris"
   numberOfDays = 5
   budgetType = "luxury"
   interests = ["food", "culture"]

2. User clicks "Generate AI Itinerary"
   → handleSubmit() fires
   → axiosInstance.post('/trips', payload)

3. AXIOS sends HTTP request:
   POST http://localhost:5000/api/trips
   Headers: { Cookie: 'token=eyJhbGci...' }
   Body: { destination, numberOfDays, budgetType, interests }

4. BACKEND receives request:
   → server.ts routes it to tripRoutes.ts
   → tripRoutes.ts has: router.use(protect) ← runs first!

5. PROTECT MIDDLEWARE (authMiddleware.ts):
   → Read token from cookie: req.cookies.token
   → jwt.verify(token, JWT_SECRET) → { id: "user123abc" }
   → User.findById("user123abc") → { name: "Alice", email: "..." }
   → req.user = { id: "user123abc", name: "Alice", email: "..." }
   → next() ← pass to controller

6. TRIP CONTROLLER (tripController.ts):
   → Read body: { destination, numberOfDays, budgetType, interests }
   → Call aiService:
      hotels = generateHotels("luxury")
      itinerary = generateItinerary("Paris", 5, "luxury", ["food","culture"])
      budget = generateBudget(5, "luxury", hotels)

7. AI SERVICE (aiService.ts):
   → Build 5 day objects using templates (see Section 7)
   → Return: [ {day:1,...}, {day:2,...}, ... ]

8. CONTROLLER saves to MongoDB:
   Trip.create({
     userId: req.user.id,   // ← Ties trip to this user!
     destination: "Paris",
     itinerary: [...5 days],
     hotels: [...2 hotels],
     budget: { total: 7800, ... }
   })
   → Returns the saved trip document with _id

9. CONTROLLER sends response:
   res.status(201).json({
     success: true,
     data: trip
   })

10. FRONTEND receives response:
    → data.data._id = "trip456xyz"
    → router.push('/trips/trip456xyz')

11. TRIP DETAIL PAGE loads:
    → axiosInstance.get('/trips/trip456xyz')
    → Backend: Trip.findOne({ _id: "trip456xyz", userId: req.user.id })
    → Returns trip data
    → React renders DayItinerary, HotelCard, BudgetSummary components
```

---

## 10. Database Design

### User Document (in MongoDB)

```json
{
  "_id": "ObjectId('64abc123...')",
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "$2a$12$hashedPasswordHere",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Trip Document (in MongoDB)

```json
{
  "_id": "ObjectId('64def456...')",
  "userId": "ObjectId('64abc123...')",  ← Links to User
  "destination": "Tokyo",
  "numberOfDays": 3,
  "budgetType": "moderate",
  "interests": ["culture", "food"],
  "itinerary": [
    {
      "day": 1,
      "title": "Welcome to Tokyo — Arrival & First Impressions",
      "activities": [
        { "time": "11:00 AM", "name": "Local Food Market Tour", "cost": 55, ... },
        { "time": "02:00 PM", "name": "Ancient Temple Tour",    "cost": 44, ... }
      ],
      "meals": {
        "breakfast": "Hotel buffet breakfast",
        "lunch": "Bistro lunch special",
        "dinner": "Rooftop restaurant with views"
      },
      "notes": "Welcome to Tokyo!..."
    },
    { "day": 2, ... },
    { "day": 3, ... }
  ],
  "hotels": [
    {
      "name": "City Comfort Hotel",
      "rating": 4,
      "pricePerNight": 120,
      "amenities": ["WiFi", "Pool", ...]
    }
  ],
  "budget": {
    "accommodation": 360,
    "food": 264,
    "activities": 330,
    "transport": 198,
    "miscellaneous": 132,
    "total": 1284,
    "currency": "USD"
  },
  "createdAt": "2024-01-15T11:00:00Z",
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

### Data Isolation — Why Users Can't See Each Other's Data

Every trip query includes `userId`:

```typescript
// In tripController.ts:

// ✅ Correct — only returns trips that belong to req.user.id
const trip = await Trip.findOne({
  _id: req.params.id,
  userId: req.user!.id,   // ← THIS IS THE KEY
});

// Even if a user guesses another trip's ID, this returns null
// because userId won't match → returns 404
```

This is enforced at the **database query level**, not just in the application logic — it's the most secure approach.

### Mongoose Indexes (Performance)

```typescript
// In Trip.ts model:
tripSchema.index({ userId: 1, createdAt: -1 });
// ↑ Tells MongoDB to sort trips by userId, then by date
// Makes "get my trips" queries very fast even with millions of records
```

---

## 11. Security Deep Dive

### 1. Password Security
```typescript
// On save, password is automatically hashed:
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();  // Only hash if changed
  const salt = await bcrypt.genSalt(12);             // Generate random salt
  this.password = await bcrypt.hash(this.password, salt);  // Hash
  next();
});

// On login:
const isMatch = await bcrypt.compare(inputPassword, storedHash);
// → true or false (never decrypts, just compares)
```

### 2. JWT Security
```typescript
// Signing a token:
jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
// → Creates a signed token that expires in 7 days

// Verifying:
jwt.verify(token, JWT_SECRET);
// → Returns { id: userId } if valid, throws error if tampered/expired
```

### 3. CORS (Cross-Origin Resource Security)
```typescript
app.use(cors({
  origin: 'http://localhost:3000',  // Only allow frontend to call us
  credentials: true,                // Allow cookies
}));
// Any other website trying to call our API gets blocked
```

### 4. Error Handling (No Info Leakage)
```typescript
// In production, errors only show:
{ success: false, message: "Invalid credentials" }

// In development, they also show:
{ success: false, message: "...", stack: "Error at line 42..." }
// → Controlled by NODE_ENV environment variable
```

---

## 12. Advanced Concepts

### The Service Layer Pattern

Why is the AI logic in `aiService.ts` instead of `tripController.ts`?

**Separation of Concerns** — each file has ONE job:
- Controller: Handle HTTP (read request, send response)
- Service: Business logic (generate the plan)

Benefits:
1. **Testable**: Can unit-test `generateItinerary()` without starting a server
2. **Swappable**: Can replace rule-based with real LLM by only changing `aiService.ts`
3. **Readable**: Controller stays clean, doesn't mix HTTP code with business logic

### TypeScript Interfaces as a Contract

```typescript
// types/index.ts defines the "contract" between frontend and backend

export interface Trip {
  _id: string;
  destination: string;
  numberOfDays: number;
  budgetType: BudgetType;
  itinerary: DayPlan[];
  // ...
}

// Frontend uses this type:
const [trip, setTrip] = useState<Trip | null>(null);
// TypeScript now knows exactly what fields trip has

// If backend changes the response shape, TypeScript flags ALL mismatches
```

### `async/await` vs Callbacks

Old JavaScript used "callback hell":
```javascript
// Old way (callback hell) 😱
db.findUser(email, function(err, user) {
  if (err) return callback(err);
  bcrypt.compare(password, user.password, function(err2, match) {
    if (err2) return callback(err2);
    jwt.sign({ id: user.id }, secret, function(err3, token) {
      // ...
    });
  });
});
```

Modern way (async/await) ✅:
```typescript
try {
  const user = await User.findOne({ email });
  const match = await bcrypt.compare(password, user.password);
  const token = generateToken(user.id);
  sendTokenCookie(res, token);
} catch (error) {
  next(error);
}
```

### React Hooks Explained

```typescript
// useState: Stores a value that updates the UI when changed
const [trips, setTrips] = useState<Trip[]>([]);
// → trips = current value, setTrips = function to update it

// useEffect: Runs side effects (like API calls) at the right time
useEffect(() => {
  fetchTrips(); // Run this when component mounts
}, []);         // [] = only run once (on mount)

// useCallback: Memoizes a function (prevents it from being recreated every render)
const fetchTrips = useCallback(async () => {
  const { data } = await axiosInstance.get('/trips');
  setTrips(data.data);
}, []); // Empty deps = function never changes

// useContext: Access context values
const { user, login } = useAuth(); // Custom hook using useContext
```

---

## 13. How to Upgrade to a Real LLM

The application is designed so you can add a real AI by **only changing `aiService.ts`**.

### Using OpenAI (GPT-4)

```bash
# Install the SDK
cd backend
npm install openai
```

```typescript
// Replace aiService.ts with this:
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateItinerary = async (
  destination: string,
  numberOfDays: number,
  budgetType: BudgetType,
  interests: string[]
): Promise<DayPlan[]> => {
  
  const prompt = `
    Create a ${numberOfDays}-day travel itinerary for ${destination}.
    Budget level: ${budgetType}
    Interests: ${interests.join(', ')}
    
    Return ONLY valid JSON in this exact format:
    [{ "day": 1, "title": "...", "activities": [...], "meals": {...}, "notes": "..." }]
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content).itinerary as DayPlan[];
};
```

Add to `.env`:
```
OPENAI_API_KEY=sk-...your-key-here...
```

### Using Google Gemini

```bash
npm install @google/generative-ai
```

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generateItinerary = async (...) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return JSON.parse(text) as DayPlan[];
};
```

**The key insight**: The controller code doesn't change at all — it still calls `generateItinerary()` and expects `DayPlan[]` back. Only the implementation inside the service changes.

---

## 14. Common Interview Questions About This App

**Q: Why HTTP-only cookies instead of localStorage for JWT?**
> localStorage is accessible by JavaScript. If an attacker injects malicious JS (XSS attack), they can steal the token. HTTP-only cookies cannot be read by JS, only sent automatically by the browser.

**Q: How do you prevent one user from accessing another user's data?**
> Every MongoDB query includes `userId: req.user.id` as a filter. Even if a user knows another trip's ID, the query returns null because the userId won't match, resulting in a 404.

**Q: What is the Service Layer and why use it?**
> The service layer (`aiService.ts`) separates business logic from HTTP handling. Controllers stay thin and readable. Services can be unit-tested independently. The implementation can be swapped (e.g., hardcoded → real LLM) without touching the controller.

**Q: Is this using a real AI?**
> No. The "AI" is a rule-based template system. It uses hardcoded activity, hotel, and meal templates, combined with a budget multiplier and an interest-rotation algorithm. The architecture supports swapping in a real LLM (OpenAI, Gemini) by only replacing the service layer.

**Q: How does TypeScript help in this project?**
> TypeScript ensures the frontend and backend agree on data shapes. The `Trip` interface is defined once; if the backend changes a field name, TypeScript will show compile errors on every frontend file that uses that field — preventing runtime bugs.

**Q: What happens when a JWT expires?**
> The `jwt.verify()` call throws a `JsonWebTokenError`. The `authMiddleware` catches this and returns a 401 response. The Axios interceptor on the frontend detects the 401 and redirects the user to the login page.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ installed
- MongoDB running locally

### Run the Backend
```bash
cd trao/backend
npm run dev
# Server starts at http://localhost:5000
```

### Run the Frontend
```bash
cd trao/my-app
npm run dev
# App opens at http://localhost:3000
```

### Environment Variables

`backend/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-travel-planner
JWT_SECRET=change_this_to_a_long_random_string_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

`my-app/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 📖 Glossary

| Term | Meaning |
|------|---------|
| **API** | Application Programming Interface — how two programs communicate |
| **REST API** | A style of API using HTTP verbs (GET, POST, PUT, DELETE) |
| **JWT** | JSON Web Token — a self-contained token for authentication |
| **HTTP-only Cookie** | A cookie that JavaScript cannot read |
| **Middleware** | Code that runs between a request and a response |
| **Schema** | A blueprint defining the shape of database data |
| **Mongoose** | A library that adds structure to MongoDB |
| **MVC** | Model-View-Controller — a pattern for organizing code |
| **Context API** | React's built-in way to share state without prop drilling |
| **Prop Drilling** | Passing data through many nested components (what Context avoids) |
| **SSR** | Server-Side Rendering — generating HTML on the server |
| **Hash** | A one-way transformation of data (passwords → gibberish) |
| **Salt** | Random data added to passwords before hashing (prevents duplicate hashes) |
| **CORS** | Cross-Origin Resource Sharing — controls which websites can call your API |
| **XSS** | Cross-Site Scripting — an attack where malicious JS is injected |
| **CSRF** | Cross-Site Request Forgery — an attack using your credentials without consent |
| **Data Isolation** | Ensuring users can only access their own data |
| **Rule-based AI** | Logic built from handcrafted rules, not machine learning |
| **LLM** | Large Language Model — AI like GPT-4 or Gemini |
| **TypeScript** | JavaScript with static type checking |
| **Interface** | TypeScript's way of describing the shape of an object |

---

*Built with Next.js 15, Express.js, MongoDB, TypeScript, and Tailwind CSS.*
