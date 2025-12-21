# Zolar Frontend

> **Solar Energy Monitoring System - Frontend Dashboard**

A modern React dashboard for monitoring solar panel performance, detecting anomalies, managing invoices, and analyzing weather-adjusted energy metrics.

**🌐 Live Demo**: [https://fed-4-front-end-sandali.netlify.app](https://fed-4-front-end-sandali.netlify.app)

---

## 📑 Table of Contents

- [Project Overview](#project-overview)
- [System Architecture](#system-architecture)
- [Key Functionalities](#key-functionalities)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Deployed Links](#deployed-links)

---

## 🎯 Project Overview

The Zolar Frontend is a comprehensive React-based dashboard that provides real-time monitoring and management for solar energy systems. Built with React 19, Vite, Redux Toolkit, and Shadcn UI, it offers an intuitive interface for tracking energy production, detecting system anomalies, processing payments via Stripe, and analyzing performance metrics.

**Tech Stack**: React 19 • Vite 7 • Redux Toolkit • RTK Query • Clerk Auth • Stripe • Shadcn UI • Tailwind CSS • Recharts

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Presentation Layer                                   │  │
│  │  • React components (pages + features)               │  │
│  │  • Shadcn UI + Tailwind CSS                         │  │
│  │  • React Hook Form + Zod validation                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ State Management Layer                               │  │
│  │  • Redux Toolkit (UI state)                          │  │
│  │  • RTK Query (API caching & data fetching)          │  │
│  │  • Clerk (authentication state)                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ API Integration Layer                                │  │
│  │  • Auto-generated React hooks (RTK Query)            │  │
│  │  • Automatic JWT token attachment                    │  │
│  │  • Tag-based cache invalidation                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────┘
                          ↓ HTTPS
          ┌───────────────────────────────┐
          │  Backend API (Express/MongoDB) │
          └───────────────────────────────┘
```

**Routing Structure**:
- **Public Routes**: Home, Sign In, Sign Up
- **Protected Routes**: Dashboard, Anomalies, Analytics, Invoices (requires authentication)
- **Admin Routes**: Solar Unit Management (requires admin role)

**State Management**: Redux Toolkit for UI state, RTK Query for server state with automatic caching

---

## ⚡ Key Functionalities

### User Features
- 📊 **Dashboard**: Real-time energy generation charts (7/30-day views), weather widget with solar impact score
- 🚨 **Anomaly Monitoring**: View and manage system anomalies with status filtering (Open/Acknowledged/Resolved)
- 📈 **Analytics**: Weather-adjusted performance metrics, system health score (0-100), anomaly distribution charts
- 💳 **Invoices**: View billing history, process payments via Stripe embedded checkout
- 📍 **Location Management**: Update solar unit location with geolocation API

### Admin Features
- ⚙️ **Solar Unit CRUD**: Create, edit, delete solar panel installations
- 👥 **User Management**: View all system users
- 📋 **System Monitoring**: Access to all invoices and anomalies

### Technical Features
- 🔐 **Authentication**: Clerk-based JWT authentication with role-based access control (user/admin)
- 🎨 **Modern UI**: Shadcn UI components with dark mode support
- 📱 **Responsive**: Mobile-first design with adaptive layouts
- ⚡ **Performance**: RTK Query caching, route-based code splitting
- 🎯 **Type Safety**: Zod validation for all forms

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Backend API running (see [zolar-back-end](../zolar-back-end/README.md))
- Clerk account ([https://clerk.com](https://clerk.com))
- Stripe account ([https://stripe.com](https://stripe.com))

### Installation Steps

1. **Navigate to project directory**:
```bash
cd zolar-front-end
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create `.env` file** (see [Environment Variables](#environment-variables) section below)

4. **Start development server**:
```bash
npm run dev
```

5. **Access the application**:
```
http://localhost:5173
```

6. **Sign up/Sign in**:
   - Create an account at `/sign-up`
   - Test user: `sandalisandagomi@gmail.com`
   - For admin access: Update user role to "admin" in Clerk Dashboard → User → Metadata → Public → `{"role": "admin"}`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |

---

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Clerk Redirects
CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Backend API URLs
VITE_BACKEND_URL=http://localhost:8000
VITE_BACKEND_URL_DEPLOYED=https://fed-4-back-end-sandali.onrender.com

# Stripe Payment Processing
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### How to Get API Keys

**Clerk** ([https://dashboard.clerk.com](https://dashboard.clerk.com)):
1. Create an application
2. Go to "API Keys"
3. Copy "Publishable key" → `VITE_CLERK_PUBLISHABLE_KEY`

**Stripe** ([https://dashboard.stripe.com](https://dashboard.stripe.com)):
1. Go to "Developers" → "API keys"
2. Copy "Publishable key" (test mode) → `VITE_STRIPE_PUBLISHABLE_KEY`

**Note**: Variables prefixed with `VITE_` are exposed to the client bundle and accessible via `import.meta.env.VITE_*`

---

## 🚀 Deployment

### Deploy to Netlify

1. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Environment Variables**: Add all `VITE_*` variables from your `.env` file in Netlify Dashboard → Site settings → Environment variables

3. **Redirects**: Create `netlify.toml` in root (already configured):
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

4. **Deploy**:
   - Connect GitHub repository to Netlify
   - Click "Deploy site"
   - Automatic deployments on git push

### Production Checklist
- ✅ Update `VITE_BACKEND_URL` to production API URL
- ✅ Use production Clerk keys (`pk_live_...`)
- ✅ Use production Stripe keys (`pk_live_...`)
- ✅ Configure Clerk redirect URLs to match production domain
- ✅ Ensure backend CORS allows production frontend URL

---

## 🌐 Deployed Links

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | [https://fed-4-front-end-sandali.netlify.app](https://fed-4-front-end-sandali.netlify.app) | ✅ Live |
| **Backend API** | [https://fed-4-back-end-sandali.onrender.com](https://fed-4-back-end-sandali.onrender.com) | ✅ Live |
| **Data API** | `http://localhost:8001` (local only) | 🔧 Dev |

---

## 📞 Support

**Developer**: Sandali Sandagomi
**Email**: sandalisandagomi@gmail.com
**Course**: Fullstack Development Bootcamp - Day 17

---

**Built with ❤️ using React, Vite, Tailwind CSS, Shadcn UI, and Clerk**
