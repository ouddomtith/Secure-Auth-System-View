# 🌟 Luminary Auth — Next.js Frontend

A production-grade Next.js 14 frontend for the Spring Boot JWT authentication system.

## ✨ Features

- **Register** — Email + password signup with strength meter
- **Login** — Email/password with OTP flow
- **OTP Verification** — 6-digit code with countdown timer, auto-submit, paste support
- **Trust Device** — Skip OTP for 7 days (stored deviceId in localStorage)
- **Google OAuth2** — One-click Google login
- **Dashboard** — Overview with security status
- **Profile** — View/edit profile, delete account
- **Push Notifications** — Subscribe/unsubscribe, send to all or specific user
- **User Management** — List and search all users

## 🚀 Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔗 API Integration

The frontend connects to these Spring Boot endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login + trigger OTP |
| POST | `/api/auth/verify-otp` | Verify OTP + get JWT |
| GET | `/api/users/me` | Get current user profile |
| PUT | `/api/users/me` | Update profile |
| DELETE | `/api/users/me` | Delete account |
| GET | `/api/users` | List all users |
| POST | `/api/push/subscribe` | Subscribe to push |
| POST | `/api/push/unsubscribe` | Unsubscribe |
| POST | `/api/push/send-all` | Notify all users |
| POST | `/api/push/send/:userId` | Notify specific user |

## 🏗️ Architecture

```
src/
├── app/
│   ├── login/          # Login page
│   ├── register/       # Registration page  
│   ├── verify-otp/     # OTP verification
│   └── dashboard/      # Protected dashboard
│       ├── profile/    # Profile management
│       ├── notifications/ # Push notifications
│       └── users/      # User management
├── components/
│   └── AuthLayout.tsx  # Shared auth wrapper
└── lib/
    ├── api.ts          # Axios API client
    └── store.ts        # Zustand auth state
```

## 🎨 Design System

- **Font**: Playfair Display (headings) + DM Sans (body) + JetBrains Mono (code)
- **Theme**: Deep obsidian dark with aurora purple accents
- **Colors**: Obsidian (#0A0A0F) · Aurora (#7B5EA7) · Jade (#3ECFAA)

## 📦 Tech Stack

- **Next.js 14** — App Router
- **TypeScript** — Full type safety
- **Tailwind CSS** — Utility-first styling
- **Zustand** — Auth state management
- **Axios** — HTTP client with JWT interceptors
- **js-cookie** — JWT token persistence
- **react-hot-toast** — Toast notifications
# Secure-Auth-System-View
