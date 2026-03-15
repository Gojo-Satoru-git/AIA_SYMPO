# TEKHORA'26 SYMPOSIUM - Event Management & Registration Platform

A full-stack event management and registration platform with secure payment processing, real-time seat availability tracking, and admin event scanning capabilities. Built with React + Vite frontend and Node.js + Firebase backend.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [System Architecture](#system-architecture)
  - [Combined Architecture](#combined-architecture)
  - [Frontend Architecture](#frontend-architecture)
  - [Backend Architecture](#backend-architecture)
- [Core Features](#core-features)
- [Security Features](#security-features)
- [Technology Stack](#technology-stack)
- [Key Workflows](#key-workflows)
  - [User Authentication Flow](#user-authentication-flow)
  - [Event Registration & Payment Flow](#event-registration--payment-flow)
  - [QR Code Scanning Flow](#qr-code-scanning-flow)
  - [Admin Workflow](#admin-workflow)
  - [OTP Verification Flow](#otp-verification-flow)
- [Database Schema](#database-schema)
- [API Routes & Endpoints](#api-routes--endpoints)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [Contributing Guidelines](#contributing-guidelines)
- [License](#license)

---

## 🎯 Project Overview

**TEKHORA'26** is a comprehensive event management platform designed to handle:
- **User Authentication** via Firebase with email verification
- **Event Registration** with real-time seat availability
- **Secure Payment Processing** through Cashfree Payment Gateway
- **QR Code Generation & Scanning** for event check-ins
- **Promotional Code Support** with dynamic discounting
- **Multi-event Combo Packages** with seat allocation
- **Admin Dashboard** for event management and attendee scanning

The platform serves college symposiums, conferences, and large-scale events with thousands of participants.

---

## 🏗️ System Architecture

### Combined Architecture (System Design)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE LAYER                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │              Frontend (React + Vite + Tailwind)              │   │
│  │  ┌─────────────┐  ┌──────────┐  ┌─────────┐  ┌──────────┐    │   │
│  │  │ Auth Pages  │  │ Events   │  │ Checkout│  │  Admin   │    │   │
│  │  │ & MFA       │  │ Listing  │  │  Flow   │  │  Scan    │    │   │
│  │  └─────────────┘  └──────────┘  └─────────┘  └──────────┘    │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                          HTTP/REST (axios)
                                   │
┌──────────────────────────────────────────────────────────────────────┐
│                      API & BUSINESS LOGIC LAYER                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │         Backend (Express.js + Node.js + Firebase)              │  │
│  │  ┌──────────────────┐  ┌───────────────┐  ┌──────────────────┐ │  │
│  │  │ Auth Service     │  │ Order/Payment │  │ Event Management │ │  │
│  │  │ OTP Verification │
│  │  │ Email Verify     │  │ Cashfree API  │  │ Seat Allocation  │ │  │
│  │  │ Bearer Token Gen │  │ Webhook Hdlr  │  │ QR Generation    │ │  │
│  │  └──────────────────┘  └───────────────┘  └──────────────────┘ │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
                                   │
                    Firebase API + Webhooks/Events
                                   │
┌─────────────────────────────────────────────────────────────────────┐
│                       DATA & SERVICES LAYER                         │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │              Firebase Ecosystem (Primary DB)                 │   │
│  │  ┌────────────┐  ┌──────────────┐  ┌─────────────────────┐   │   │
│  │  │  Firestore │  │   Firebase   │  │  Cloud Storage      │   │   │
│  │  │    (RTDB)  │  │  Auth        │  │  (Images/Assets)    │   │   │
│  │  └────────────┘  └──────────────┘  └─────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │            Third-Party Services (External APIs)              │   │
│  │                ┌──────────────┐  ┌──────────┐                │   │
│  │                │ Cashfree API │  │ Resend   │                │   │
│  │                │(Payments)    │  │ (Email)  │                │   │
│  │                └──────────────┘  └──────────┘                │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Frontend Architecture

```
src/
├── components/                 # Reusable React Components
│   ├── AdminRoute.jsx         # Protected admin routes wrapper
│   ├── AppShell.jsx           # App wrapper with context providers
│   ├── Authform.jsx           # Auth UI component
│   ├── EventCard.jsx          # Event card display component
│   ├── PassCard.jsx           # Pass/ticket card component
│   ├── QrCodeBox.jsx          # QR code display component
│   ├── NavMenuBar.jsx         # Navigation component
│   ├── Toast.jsx              # Toast notification component
│   └── ... (other UI components)
│
├── screens/                   # Page-level Components
│   ├── Home.jsx              # Landing page
│   ├── Auth.jsx              # Login/Signup page
│   ├── Events.jsx            # Events listing page
│   ├── Register.jsx          # Event registration page
│   ├── Scanner.jsx           # QR scanner (admin)
│   ├── ScanPage.jsx          # Scan results page (admin)
│   └── ... (other screens)
│
├── context/                  # State Management (Context API)
│   ├── AuthContext.jsx       # User auth state
│   ├── cart.context.jsx      # Shopping cart state
│   ├── cart.provider.jsx     # Cart context provider
│   ├── event.context.jsx     # Event data state
│   ├── Eventprovider.jsx     # Event provider
│   ├── PurchaseContext.jsx   # User purchases state
│   ├── toast.context.jsx     # Toast notifications state
│   ├── workshop.context.jsx  # Workshop bookings state
│   └── useCart.js            # Custom hook for cart
│
├── services/                 # API & Business Logic
│   ├── api.js               # Axios instance with interceptors
│   ├── auth.service.js      # Authentication API calls
│   ├── payment.service.js   # Payment processing API calls
│   └── ... (other services)
│
├── lib/                      # Utility Functions
│   └── utils.js             # Helper functions
│
├── data/                     # Static Data
│   └── passess.js           # Pass/ticket data
│
├── utils/                    # App Utilities
│   └── analytics.js         # Analytics tracking
│
├── firebase.js              # Firebase configuration
├── App.jsx                  # Root app component (routes)
├── App.css                  # Global styles
├── index.css                # Base styles
├── main.jsx                 # Entry point
└── theme.js                 # Tailwind theme config

Configuration Files:
├── vite.config.js           # Vite bundler config
├── tailwind.config.js       # Tailwind CSS config
├── postcss.config.js        # PostCSS config
├── jsconfig.json            # JS module config
├── eslint.config.js         # Code linting config
└── package.json             # Dependencies
```

**Frontend Architecture Principles:**
- **Component-Based**: Reusable UI components with single responsibility
- **Context API**: Global state management for auth, cart, events, toasts
- **Service Layer**: Centralized API calls with Axios interceptors
- **Responsive Design**: Tailwind CSS for mobile-first responsive layouts
- **Error Handling**: Comprehensive error handling with toast notifications
- **Real-time Sync**: Firebase listeners for real-time data updates

---

### Backend Architecture

```
functions/src/
├── app.js                   # Express app configuration
│                            # - CORS setup
│                            # - Middleware mounting
│                            # - Route registration
│                            # - Error handlers
│
├── server.js/server1.js     # Server entry points
│
├── config/                  # Configuration Management
│   ├── env.js              # Environment variables (local)
│   ├── env1.js             # Environment variables (cloud)
│   ├── firebase.js         # Firebase Admin SDK init
│   └── setAdmin.js         # Admin privileges setup
│
├── controllers/            # Business Logic Layer
│   ├── auth.controller.js         # Auth endpoints
│   │   ├── signup()               # User registration
│   │   ├── getProfile()           # Get user profile
│   │   └── logout()               # Logout handling
│   │
│   ├── payment.controller.js       # Payment endpoints
│   │   ├── createOrder()          # Initiate payment
│   │   └── verifyPayment()        # Verify payment status
│   │
│   ├── user.controller.js          # User management
│   │   ├── getPurchases()         # Get user orders
│   │   └── getTeams()             # Get user teams
│   │
│   ├── event.controller.js         # Event management
│   │   ├── getAvailability()      # Check seat availability
│   │   └── getEvents()            # Fetch events
│   │
│   ├── otp.controller.js           # OTP verification
│   │   ├── sendOtp()              # Send OTP via email
│   │   └── verifyOtp()            # Verify OTP
│   │
│   ├── scan.controller.js          # QR scanning
│   │   ├── validateQr()           # Validate QR token
│   │   └── markAttendance()       # Mark user as attended
│   │
│   ├── college.controller.js       # College management
│   ├── promo.controller.js         # Promo code validation
│   └── webhook.controller.js       # Payment webhook handling
│
├── routes/                 # API Route Definitions
│   ├── auth.routes.js      # /auth/* routes
│   ├── payment.routes.js   # /payment/* routes
│   ├── user.routes.js      # /user/* routes
│   ├── event.routes.js     # /events/* routes
│   ├── otp.routes.js       # /otp/* routes
│   ├── college.routes.js   # /colleges/* routes
│   └── promo.routes.js     # /promo/* routes
│
├── middlewares/            # Request/Response Middleware
│   ├── auth.middleware.js      # Bearer token verification
│   │   └── requireAuth()       # Verifies Firebase ID token
│   │
│   ├── admin.middleware.js     # Admin role verification
│   │   └── requireAdmin()      # Checks admin privileges
│   │
│   ├── rateLimit.middleware.js # Request rate limiting
│   │   ├── globalLimiter       # 300 req/15min per user
│   │   ├── authLimiter         # 10 auth attempts/15min
│   │   ├── paymentLimiter      # 10 payments/5min
│   │   └── verifyLimiter       # 3 OTP verifications/min
│   │
│   ├── error.middleware.js     # Global error handler
│   │   └── errorHandler()      # Centralizes error responses
│   │
│   └── requireRegisteredUser.js # User profile check
│
├── service/                # Business Logic Services
│   ├── order.service.js        # Order creation & management
│   │   ├── createOrderRecord() # Creates order in Firestore
│   │   │                        # - Validates items
│   │   │                        # - Allocates seats atomically
│   │   │                        # - Applies promo codes
│   │   │                        # - Generates QR token
│   │   │
│   │   └── cancelOrderAndReleaseSeats()
│   │                            # Handles order cancellation
│   │                            # - Releases booked seats
│   │                            # - Refunds amount
│   │
│   ├── cashfree.service.js     # Cashfree API integration
│   │   ├── createCashfreeOrder() # Creates payment order
│   │   └── fetchCashfreeOrder()  # Fetches order status
│   │
│   ├── otp.service.js          # OTP generation & validation
│   │   ├── generateOtp()       # Creates random 6-digit OTP
│   │   ├── storeOtp()          # Stores OTP in Firestore
│   │   ├── verifyStoredOtp()   # Verifies submitted OTP
│   │   └── canResendOtp()      # Rate limits OTP resends
│   │
│   └── ... (other services)
│
├── utils/                  # Utility Functions
│   ├── response.js         # Standardized response helpers
│   │   ├── success()       # Format success responses
│   │   └── error()         # Format error responses
│   │
│   ├── mailer.js           # Email sending
│   │   ├── sendOtpEmail()  # Send OTP via Resend
│   │   └── sendConfirmation()
│   │
│   └── token.js            # Token generation helpers
│
├── data/                   # Static/Reference Data
│   ├── limitedSeatEvents.js      # Events with seat limits
│   ├── promoCode.js              # Available promo codes
│   └── ... (other data files)
│
└── index.js               # Firebase Functions entry point
```

**Backend Architecture Principles:**
- **MVC Pattern**: Controllers + Services + Data layer separation
- **Middleware Stack**: Auth → Rate Limiting → Error Handling
- **Atomic Transactions**: Firestore transactions for seat allocation
- **Service-Oriented**: Business logic isolated in services
- **Standardized Responses**: Consistent JSON response format
- **Security First**: Input validation, rate limiting, Firebase security rules

---

## ⭐ Core Features

### 1. **User Authentication & Profile Management**
- ✅ Email/Password signup & signin via Firebase Authentication
- ✅ Email verification with OTP (via Resend)
- ✅ JWT-based session management with Firebase ID tokens
- ✅ User profile management (name, phone, institute, year)
- ✅ Password reset functionality
- ✅ Account logout with token revocation

### 2. **Event Management**
- ✅ Multi-event listings with detailed information
- ✅ Real-time seat availability tracking
- ✅ Event capacity management with booked seat count
- ✅ Event status (Active/Inactive) control
- ✅ Event filtering by category/type
- ✅ Workshop and pass bundling

### 3. **Shopping Cart & Order Management**
- ✅ Add/remove items from cart
- ✅ Real-time cart state management via Context API
- ✅ Combo pass support (multi-event bundles)
- ✅ Dynamic pricing with seat-linked events
- ✅ Order creation with atomic seat allocation
- ✅ Order history and purchase tracking

### 4. **Promotional Code System**
- ✅ Discount code validation and application
- ✅ Dynamic discount calculations
- ✅ Promo code expiry management
- ✅ Usage limit enforcement per code
- ✅ Integration with final order pricing

### 5. **Secure Payment Processing**
- ✅ Cashfree Payment Gateway integration
- ✅ Secure payment session creation
- ✅ Order verification after payment
- ✅ Payment failure handling with seat release
- ✅ Convenience fee calculation (2% gateway + 18% GST)
- ✅ Webhook handling for payment status updates
- ✅ PCI-DSS compliant payment flow

### 6. **QR Code Generation & Management**
- ✅ Unique QR token generation for each order
- ✅ QR code display in user dashboard
- ✅ QR codes containing encrypted order information
- ✅ Export and sharing functionality

### 7. **Admin QR Scanning System**
- ✅ Real-time QR code scanner (camera integration)
- ✅ Validate attendees via QR scans
- ✅ Mark attendance automatically
- ✅ Prevent duplicate check-ins
- ✅ Admin-only access with role-based routing
- ✅ Scan history and analytics

### 8. **Real-time Availability & Notifications**
- ✅ Live seat availability updates
- ✅ Toast notifications for user actions
- ✅ Email confirmations for registrations
- ✅ OTP delivery via email
- ✅ Payment status notifications

### 9. **Team Management (If Applicable)**
- ✅ User can create and join teams
- ✅ Team-based event registration
- ✅ Team member management

### 10. **Analytics & Tracking**
- ✅ Firebase Analytics integration
- ✅ User engagement tracking
- ✅ Event registration analytics
- ✅ Payment transaction logging

---

## 🔐 Security Features

### Authentication & Authorization
| Feature | Implementation |
|---------|-----------------|
| **Firebase Auth** | Email/password with Firebase Authentication SDK |
| **JWT Tokens** | Firebase ID tokens for API authentication |
| **Token Verification** | Server-side JWT verification in auth middleware |
| **Role-Based Access** | Admin routes protected with role checks |
| **Protected Routes** | Client-side route guards for admin features |

### Data Protection
| Feature | Implementation |
|---------|-----------------|
| **Field Validation** | Server-side input sanitization in controllers |
| **Type Checking** | Phone regex validation, year range checks |
| **SQL Injection Prevention** | Firestore prevents SQL injection (NoSQL) |
| **XSS Protection** | React escapes JSX, Helmet.js sets security headers |
| **CORS Policy** | Restricted CORS to specific domains only |
| **HTTPS Enforcement** | Firebase hosting enforces HTTPS |

### API Security
| Feature | Implementation |
|---------|-----------------|
| **Rate Limiting** | Express rate-limit middleware |
| **Auth Limiter** | 10 auth attempts per 15 minutes (fails only) |
| **Global Limiter** | 300 requests per 15 minutes per user |
| **Payment Limiter** | 10 payment requests per 5 minutes |
| **OTP Limiter** | 3 OTP verification attempts per minute |
| **Request Size Limits** | 10KB JSON payload limit, 10MB webhook limit |

### Payment Security
| Feature | Implementation |
|---------|-----------------|
| **PCI-DSS Compliance** | Cashfree handles card data (no storage) |
| **Webhook Verification** | Signature verification on payment webhooks |
| **Order Atomicity** | Firestore transactions prevent race conditions |
| **Seat Lock** | Pessimistic locking during payment processing |
| **Timeout Protection** | Orders expire after 10 minutes of creation |
| **Amount Verification** | Server validates payment amount matches order |
| **Unique Order IDs** | Unique document IDs prevent duplicate orders |

### Database Security
| Feature | Implementation |
|---------|-----------------|
| **Firestore Rules** | Current: Deny all by default (strict rules) |
| **Firebase Security Rules** | Collection-level access control |
| **User Data Isolation** | Users can only access their own data |
| **Admin Privileges** | Firestore custom claims for admin role |
| **Timestamp Fields** | Server-side timestamps (immutable) |

### Infrastructure Security
| Feature | Implementation |
|---------|-----------------|
| **Environment Variables** | Sensitive configs in .env (not in code) |
| **Helmet.js** | Sets security HTTP headers |
| **CORS Headers** | Restricted origin policy for cross-domain requests |
| **Error Masking** | Generic error messages to prevent info leakage |
| **Firebase Hosting** | DDoS protection, SSL/TLS encryption |
| **Firebase Functions** | Isolated execution environment |

### Code Security
| Feature | Implementation |
|---------|-----------------|
| **ESLint** | Code quality and security linting |
| **Sanitization** | Input trimming and string conversion |
| **Secure Dependencies** | Regular updates of npm packages |
| **No Hardcoded Secrets** | All secrets in environment variables |

---

## 💻 Technology Stack

### Frontend
```
Framework & Build:
  ├─ React 19.2.0          - UI library with Concurrent features
  ├─ Vite 7.2.4            - Lightning-fast build tool
  ├─ React Router 7.12.0   - Client-side routing
  └─ Vite React Plugin     - Fast Refresh for development

UI & Styling:
  ├─ Tailwind CSS 3.4      - Utility-first CSS framework
  ├─ PostCSS 8.5           - CSS transformations
  ├─ Material-UI (MUI) 7.3 - Component library
  ├─ Framer Motion 12.25   - Animation library
  └─ Lucide React          - Icon library

State Management & Data:
  ├─ React Context API     - Global state management
  ├─ Firebase 12.7.0       - Authentication & Firestore
  ├─ Axios 1.13.2          - HTTP client with interceptors
  └─ Lodash 4.17.23        - Utility functions

QR & Scanning:
  ├─ QRCode.react 4.2.0    - QR code generation
  ├─ React QR Scanner      - Camera QR scanning
  └─ React QR Barcode      - Barcode scanning

Payment:
  └─ Cashfree JS 1.0.6     - Payment gateway integration

Notifications:
  └─ React Toastify 11.0.5 - Toast notifications

Development:
  ├─ ESLint 9.39.1         - Code linting
  ├─ Prettier 3.7.4        - Code formatting
  └─ Babel Compiler Plugin - React compilation

Asset Management:
  └─ Public folder         - Static assets & fallbacks
```

### Backend
```
Runtime & Framework:
  ├─ Node.js 22            - JavaScript runtime
  ├─ Express.js 5.2.1      - Web framework
  └─ Firebase Functions 7.0- Serverless functions

Database & Auth:
  ├─ Firebase Admin 12.7.0  - Firebase Admin SDK
  ├─ Firestore             - NoSQL database
  └─ Firebase Auth         - Authentication service

Payment & Integration:
  ├─ Cashfree API          - Payment gateway
  ├─ Resend 6.9.1          - Email service provider
  └─ Nodemailer 7.0.13     - Email sending

Middleware & Security:
  ├─ Helmet 8.1.0          - Security headers
  ├─ CORS 2.8.5            - Cross-origin requests
  ├─ express-rate-limit    - Rate limiting
  └─ Crypto (Node.js)      - Cryptographic functions

Utilities:
  ├─ Dotenv 17.2.3         - Environment variables
  ├─ Nodemon 3.1.11        - Development auto-reload
  └─ NPM 11.8.0            - Package management

Deployment:
  └─ Firebase Functions    - Serverless deployment
```

### Infrastructure
```
Hosting & Database:
  ├─ Firebase Hosting      - Frontend hosting (CDN)
  ├─ Cloud Firestore       - NoSQL database
  ├─ Cloud Storage         - File storage
  ├─ Firebase Auth         - User authentication
  └─ Firebase Functions    - Serverless backend

External Services:
  ├─ Cashfree              - Payment gateway
  ├─ Resend                - Email delivery
  ├─ Firebase Analytics    - Analytics tracking
  └─ Cloud Run (Optional)  - Container deployment

Development & DevOps:
  ├─ Git/GitHub            - Version control
  ├─ VS Code               - IDE
  └─ ESLint + Prettier     - Code quality
```

---

## 🔄 Key Workflows

### User Authentication Flow

```
┌─────────────────┐
│   User Opens    │
│   Application   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Check if logged in (Firebase Auth) │
└────────┬────────────────────────────┘
         │
         ├─► Logged In? ──────────────────┐
         │                                │
         └─► Not Logged In?               │
             │                            │
             ▼                            ▼
    ┌──────────────────┐      ┌─────────────────────┐
    │  Show Auth Page  │      │  Go to Home/Landing │
    │  (Signin/Signup) │      │  with Auth Guard    │
    └────────┬─────────┘      └─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │  User Enters Email/Password  │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────────────┐
    │  POST /auth/signup or /auth/signin   │
    │  (Call Firebase Auth SDK)            │
    └────────┬─────────────────────────────┘
             │
    ┌────────┴─────────────────────────────┐
    │                                      │
    ▼                                      ▼
┌──────────────────────┐      ┌──────────────────────┐
│   New User? (Signup) │      │ Existing User? (In)  │
│   Email Not Verified │      │ Verify Password      │
└────────┬─────────────┘      └──────┬───────────────┘
         │                           │
         ▼                           ▼
┌──────────────────────┐      ┌──────────────────────┐
│ Send OTP via Email   │      │ Authentication OK    │
│ (Resend Service)     │      │ Generate JWT Token   │
└────────┬─────────────┘      │ (Firebase ID Token)  │
         │                    └──────┬───────────────┘
         ▼                           │
┌──────────────────────┐             │
│ User Enter OTP       │             │
│ Verify OTP           │             │
│ (POST /otp/verify)   │             │
└────────┬─────────────┘             │
         │                           │
         ▼                           ▼
    ┌────────────────────────────────────┐
    │  Mark Email as Verified            │
    │  Create User Profile in Firestore  │
    │  (name, phone, institute, year)    │
    └────────┬───────────────────────────┘
             │
             ▼
    ┌────────────────────────────┐
    │  Complete User Profile     │
    │  (if not already provided) │
    └────────┬───────────────────┘
             │
             ▼
    ┌─────────────────────────────────┐
    │  Store JWT Token (localStorage) │
    │  Redirect to Home/Events        │
    │  User Logged In ✓               │
    └─────────────────────────────────┘
```

**Key Points:**
- **Sign Up**: New users → Email OTP verification → Profile creation
- **Sign In**: Existing users → Password verification → JWT token
- **Token Storage**: JWT stored in localStorage, included in API headers
- **Token Refresh**: Auto-refreshed with each Firebase Auth call
- **Logout**: Token removed from localStorage, user session cleared

---

### Event Registration & Payment Flow

```
┌──────────────────────────┐
│  User Browses Events     │
│  (GET /events)           │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ User Adds Events to Cart         │
│ (Context API - cart.context)     │
│ Can select quantity per event    │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  User Views Cart                     │
│  - Event items with prices           │
│  - Option to apply promo code        │
│  - Total amount calculation          │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  User Applies Promo Code (Optional)  │
│  POST /promo/validate                │
│  Discount applied to total           │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  User Clicks "Proceed to Payment"    │
│  Validates user profile              │
│  (email, phone required)             │
└────────┬─────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────┐
│  Backend: POST /payment/create-order       │
│  ┌──────────────────────────────────────┐  │
│  │ 1. Firestore Transaction:            │  │
│  │    - Read event data                 │  │
│  │    - Validate seat availability      │  │
│  │    - Lock & reserve seats            │  │
│  │    - Deduct from capacity            │  │
│  │    - Create order document           │  │
│  │    - Generate unique QR token        │  │
│  │                                      │  │
│  │ 2. Calculate Fees:                   │  │
│  │    - Amount: sum of events           │  │
│  │    - Gateway Fee: 2%                 │  │
│  │    - GST: 18% on gateway fee         │  │
│  │    - Final Amount = Amount + Fees    │  │
│  │                                      │  │
│  │ 3. Call Cashfree API:                │  │
│  │    - Create payment order            │  │
│  │    - Get session ID                  │  │
│  │                                      │  │
│  │ 4. Update Order Doc:                 │  │
│  │    - cashfree_order_id               │  │
│  │    - payment_session_id              │  │
│  │    - status: PENDING                 │  │
│  │    - expiresAt: 10 mins from now     │  │
│  └──────────────────────────────────────┘  │
└────────┬───────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│  Frontend: Open Cashfree Checkout      │
│  - Secure payment modal                │
│  - User enters card/UPI details        │
│  - Real-time payment processing        │
└────────┬───────────────────────────────┘
         │
    ┌────┴─────────────────────────┐
    │                              │
    ▼                              ▼
┌──────────────┐        ┌──────────────────────┐
│ Payment      │        │ Payment Failed       │
│ Successful   │        │ (Timeout/Error)      │
└────────┬─────┘        └─────────────┬────────┘
         │                            │
         ▼                            ▼
┌──────────────────┐          ┌────────────────────┐
│ Cashfree Webhook │          │ Backend Handler:   │
│ Notifies Backend │          │ cancelOrderAndRels │
│ status: SUCCESS  │          │ easeSeats()        │
└────────┬─────────┘          │ - Release seats    │
         │                    │ - Delete order     │
         │                    │ - status: FAILED   │
         ▼                    └────────┬───────────┘
┌────────────────────────────┐         │
│ Backend Handler:           │         │
│ /payment/webhook           │         ▼
│ - Verify webhook signature │    ┌──────────┐
│ - Update order status      │    │Show Error│
│ - Mark PAID (if success)   │    │to User   │
│ - Send confirmation email  │    └──────────┘
│ - Generate QR token        │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ Frontend Polls Status          │
│ (or receives real-time update) │
└────────┬───────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ Order Status: PAID             │
│ - Show Order Confirmation      │
│ - Display QR Code              │
│ - Add to "My Purchases"        │
│ - Send Confirmation Email      │
│ - Clear Cart                   │
└────────────────────────────────┘
```

**Database State Transitions:**
- Order Status: `PENDING` → `PAID` (on successful payment)
- Seat Count: `booked: X` → `booked: X + N` (after order creation)
- Available Seats: `capacity - booked` (real-time calculation)

**Fee Breakdown Example:**
```
Events Total: ₹1000
Gateway Fee (2%): ₹20
GST on Gateway (18%): ₹3.60
Total Fees: ₹23.60
Final Amount: ₹1023.60
```

---

### QR Code Scanning Flow (Admin)

```
┌──────────────────────────┐
│  Admin Accesses Scanner  │
│  /admin/qr-scanner       │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  Admin Verification:             │
│  1. Check Firebase Auth          │
│  2. Verify Firebase Custom Claim │
│     role: "ADMIN"                │
│  3. If not admin → Block access  │
└────────┬─────────────────────────┘
         │
         ▼
┌────────────────────────────┐
│  Camera Permissions Dialog │
│  Browser requests camera   │
│  access from user          │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────────┐
│  QR Scanner Active             │
│  Real-time camera feed         │
│  (react-qr-scanner lib)        │
└────────┬───────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│  User Shows QR Code            │
│  (from "My Purchases" page)    │
└────────┬───────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│  Scanner Detects & Decodes QR  │
│  Gets: qrToken (encrypted)     │
└────────┬───────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  POST /scan/validate-qr            │
│  - Verify QR token signature       │
│  - Check if already scanned        │
│  - Validate order status (PAID)    │
│  - Check event date/time validity  │
└────────┬───────────────────────────┘
         │
    ┌────┴──────────────────┐
    │                       │
    ▼                       ▼
┌──────────────┐      ┌────────────────┐
│ QR Valid     │      │ QR Invalid     │
└────────┬─────┘      └────────┬───────┘
         │                     │
         ▼                     ▼
┌──────────────────────┐  ┌─────────────┐
│ GET /user/order/{id} │  │Show Error:  │
│ Fetch order details  │  │- Duplicate  │
│ - User name          │  │- Expired    │
│ - Items/Events       │  │- Invalid    │
│ - Quantity           │  │- Not paid   │
└────────┬─────────────┘  └──────┬──────┘
         │                       │
         ▼                       ▼
┌────────────────────────────┐   │
│ POST /scan/mark-attended   │   │
│ - Update attendance record │   │
│ - Set: scannedAt timestamp │   │
│ - Mark: attended=true      │   │
└────────┬───────────────────┘   │
         │                       │
         ▼                       ▼
    ┌─────────────────────────────┐
    │  Display Result to Admin    │
    │  ┌───────────────────────┐  │
    │  │ ✓ User Checked In     │  │
    │  │ Name: John Doe        │  │
    │  │ Events: Event1, Event2│  │
    │  │ Time: 10:30 AM        │  │
    │  └───────────────────────┘  │
    │         OR                  │
    │  ┌───────────────────────┐  │
    │  │ ✗ Scan Failed         │  │
    │  │ Reason: [error msg]   │  │
    │  └───────────────────────┘  │
    └─────────────────────────────┘
         │
         ▼
    ┌─────────────────────┐
    │ Admin Scans Next QR │
    │ Process repeats...  │
    └─────────────────────┘
```

**QR Token Structure:**
```
{
  encryptedData: "...", // AES-256 encrypted
  signature: "...",      // HMAC-SHA256
  expiresAt: timestamp
}

Decrypted Data:
{
  orderId: "ORDER_12345",
  userId: "USER_ID",
  eventIds: ["1", "10", "12"],
  createdAt: timestamp
}
```

---

### OTP Verification Flow

```
┌────────────────────────────┐
│  User Enters Email on      │
│  Auth/Signup Page          │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────────┐
│  POST /otp/send-otp            │
│  Email submitted in request    │
└────────┬───────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│  Backend OTP Service:          │
│  1. Check email not registered │
│  2. Check rate limit           │
│     (60 sec cooldown btw sends)│
│  3. Generate random 6-digit OTP│
│  4. Store OTP in Firestore:    │
│     - otpStore/{email}         │
│     - otp: hashed              │
│     - expiresAt: 5 mins        │
│     - attempts: 0              │
└────────┬───────────────────────┘
         │
         ▼
┌───────────────────────────────────┐
│  Send OTP via Resend              │
│  Email Service                    │
│  Template: "[Your OTP is: 123456]"│
└────────┬──────────────────────────┘
         │
    ┌────┴──────────────┐
    │                   │
    ▼                   ▼
┌────────────┐    ┌──────────────┐
│Email Sent  │    │Send Failed   │
│Return 200  │    │(Rate Limited)│
└──────┬─────┘    └───────┬──────┘
       │                  │
       ▼                  ▼
┌────────────────────┐    │
│Show Success Toast  │    │
│"OTP sent to email" │    │
└──────┬─────────────┘    │
       │                  ▼
       │         ┌────────────────┐
       │         │Show Error Toast│
       │         │"Try after 60s" │
       │         └────────────────┘
       │
       ▼
┌────────────────────────────┐
│  User Receives Email       │
│  with 6-digit OTP          │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│  User Enters OTP in Form   │
│  (Input Field)             │
└────────┬───────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  POST /otp/verify-otp       │
│  - email: user email        │
│  - otp: entered 6 digits    │
└────────┬────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Backend Verification:       │
│  1. Check OTP doc exists     │
│  2. Check not expired        │
│  3. Check attempts < 3       │
│  4. Compare with stored OTP  │
└────────┬─────────────────────┘
         │
    ┌────┴──────────────────┐
    │                       │
    ▼                       ▼
┌──────────────┐    ┌────────────────┐
│OTP Correct ✓ │    │OTP Incorrect ✗ │
└────────┬─────┘    └────────┬───────┘
         │                   │
         ▼                   ▼
┌──────────────────────┐  ┌───────────────┐
│Mark email as         │  │Increment      │
│verified in Firestore │  │attempts count │
│                      │  │               │
│Delete OTP doc        │  │attempts >= 3? │
└────────┬─────────────┘  └────────┬──────┘
         │                         │
         ▼                    ┌────┴─────┐
┌──────────────────────┐      │          │
│Return 200 + success  │      ▼          ▼
│Email verified ✓      │  ┌────────────────────┐
│                      │  │Block further       │
│Redirect to signup    │  │attempts (3/min)    │
│to complete profile   │  │Show: "Wait 60s"    │
└──────────────────────┘  └────────────────────┘
```

**OTP Configuration:**
```
- Length: 6 digits
- Validity: 5 minutes
- Resend Cooldown: 60 seconds
- Max Verification Attempts: 3 per minute
- Storage: Firestore (hashed)
- Email Service: Resend API
```

---

### Admin Workflow

```
┌─────────────────────────────────────┐
│  Admin Login                        │
│  (Uses Firebase Auth)               │
└────────┬────────────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│  Firebase Custom Claims Check  │
│  admin: true (Firestore)       │
└────────┬───────────────────────┘
         │
    ┌────┴──────────┐
    │               │
    ▼               ▼
┌──────────┐   ┌───────────┐
│Is Admin? │   │Not Admin? │
│YES       │   │Redirect   │
└────┬─────┘   │to Home    │
     │         └───────────┘
     ▼
┌────────────────────────────────┐
│  Admin Dashboard               │
│  ┌─────────────────────────┐   │
│  │ 1. Event Management     │   │
│  │    - View all events    │   │
│  │    - Edit event details │   │
│  │    - Manage capacity    │   │
│  │    - Activate/Deactivate│   │
│  │                         │   │
│  │ 2. QR Scanning          │   │
│  │    - Launch scanner     │   │
│  │    - Scan attendee QR   │   │
│  │    - Mark attendance    │   │
│  │    - View scan history  │   │
│  │                         │   │
│  │ 3. Analytics            │   │
│  │    - Registration count │   │
│  │    - Revenue tracking   │   │
│  │    - Attendance stats   │   │
│  │                         │   │
│  │ 4. User Management      │   │
│  │    - View registrations │   │
│  │    - Handle refunds     │   │
│  │    - Search users       │   │
│  │                         │   │
│  │ 5. Promo Code Mgmt      │   │
│  │    - Create codes       │   │
│  │    - Set discounts      │   │
│  │    - View usage         │   │
│  └─────────────────────────┘   │
└────────────────────────────────┘
```

---

## 📊 Database Schema

### Firestore Collections

#### **1. users**
```javascript
users/{userId}
{
  uid: string,                    // Firebase UID (document ID)
  email: string,                  // User email (lowercase)
  name: string,                   // Full name
  phone: string,                  // Phone number (10-15 digits)
  institute: string,              // College/Institute name
  year: number,                   // Year of study (1-4)
  role: string,                   // "PARTICIPANT" | "ADMIN"
  createdAt: timestamp,           // Account creation time
  updatedAt: timestamp,           // Last profile update
  
  // Optional fields
  address?: string,
  city?: string,
  state?: string,
  pincode?: string
}
```

#### **2. events**
```javascript
events/{eventId}
{
  id: string,                     // Event ID (document ID)
  title: string,                  // Event name
  description: string,            // Event description
  category: string,               // Event category (workshop, seminar, etc)
  date: timestamp,                // Event date
  time: string,                   // Event start time
  location: string,               // Event location
  price: number,                  // Event price in rupees
  originalPrice?: number,         // Original price before discount
  capacity: number,               // Total seats available
  booked: number,                 // Currently booked seats
  isActive: boolean,              // Event active/inactive
  createdAt: timestamp,
  updatedAt: timestamp,
  
  // Optional fields
  speakers?: array,
  duration?: string,
  hasSeats: boolean              // Limited seat event?
}
```

#### **3. orders**
```javascript
orders/{orderId}
{
  id: string,                           // Order ID (document ID)
  userId: string,                       // Reference to users/{userId}
  status: string,                       // "PENDING" | "PAID" | "FAILED" | "CANCELLED"
  items: [
    {
      eventId: string,                  // Event ID
      title: string,                    // Event title
      quantity: number,                 // Number of passes
      price: number,                    // Price per item
      totalPrice: number                // quantity × price
    }
  ],
  amount: number,                       // Subtotal (sum of items)
  discount: number,                    // Discount applied
  finalAmount: number,                   // Amount to be paid
  convenienceFee: number,               // Gateway + GST fee
  
  // Payment info
  cashfree_order_id: string,           // Cashfree order ID
  payment_session_id: string,          // Cashfree session ID
  paymentMethod: string?,              // "UPI" | "CARD" | "NETBANKING"
  paidAt: timestamp?,                  // Payment completion time
  
  // Promo code
  promoCode: string?,                  // Applied promo code
  promoDiscount: number?,              // Discount amount
  
  // QR & Attendance
  qrToken: string,                     // Encrypted QR token
  attended: boolean,                    // Attendance marked?
  scannedAt: timestamp?,               // When scanned
  
  // Order metadata
  expiresAt: timestamp,                // Order expiry (10 mins)
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### **4. otpStore**
```javascript
otpStore/{email}
{
  email: string,                  // User email (document ID)
  otp: string,                    // Hashed OTP (bcrypt)
  attempts: number,               // Failed verification attempts
  lastResendAt: timestamp,        // Last time OTP was sent
  expiresAt: timestamp,           // OTP expiry time
  createdAt: timestamp
}
```

#### **5. verifiedEmails**
```javascript
verifiedEmails/{email}
{
  email: string,                  // Email address (document ID)
  verified: boolean,              // Email verified status
  verifiedAt: timestamp,
  expiresAt: timestamp            // Verification expires after signup
}
```

#### **6. promoCodes**
```javascript
promoCodes/{promoId}
{
  code: string,                   // Promo code string
  discount: number,               // Discount percentage (0-100)
  discountType: string,           // "PERCENTAGE" | "FLAT"
  maxDiscount: number,            // Maximum discount amount (for %)
  validFrom: timestamp,
  validTill: timestamp,
  usageLimit: number,             // Max uses allowed
  usageCount: number,             // Current uses
  applicableEvents: array,        // Event IDs it applies to
  isActive: boolean,
  createdAt: timestamp
}
```

#### **7. teams** (If applicable)
```javascript
teams/{teamId}
{
  id: string,                     // Team ID (document ID)
  uid: string,                    // Team creator UID
  name: string,                   // Team name
  members: [
    {
      uid: string,                // Member Firebase UID
      name: string,               // Member name
      email: string,              // Member email
      joinedAt: timestamp
    }
  ],
  eventIds: array,                // Events team registered for
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### **8. attendance** (For admin scanning)
```javascript
attendance/{recordId}
{
  orderId: string,                // Reference to order
  userId: string,                 // Reference to user
  eventId: string,                // Event attended
  checkedInAt: timestamp,         // Check-in time
  scannedBy: string,              // Admin who scanned
  location: string,               // Check-in location
  createdAt: timestamp
}
```

#### **9. settings** (Admin config)
```javascript
settings/general
{
  maintenanceMode: boolean,
  eventRegistrationOpen: boolean,
  paymentGateway: string,
  convenienceFeePercentage: number,
  gstPercentage: number,
  maxOrderValue: number,
  updatedAt: timestamp
}
```

---

## 🔌 API Routes & Endpoints

### Authentication Routes (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/auth/signup` | User registration with profile | ✓ Firebase Auth |
| GET | `/auth/profile` | Get user profile | ✓ |
| POST | `/auth/logout` | Logout user (token revocation) | ✓ |

**Signup Request:**
```json
{
  "name": "John Doe",
  "phone": "9876543210",
  "institute": "IIT Bombay",
  "year": 2
}
```

**Signup Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": { "uid": "user_id_123" }
}
```

---

### Payment Routes (`/payment`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/payment/create-order` | Initiate payment | ✓ |
| GET | `/payment/order-status/{orderId}` | Check order status | ✓ |
| POST | `/payment/webhook` | Payment gateway webhook | ✓ (Signature) |

**Create Order Request:**
```json
{
  "items": [
    { "eventId": "10", "quantity": 1 },
    { "eventId": "12", "quantity": 2 }
  ],
  "promoCode": "SAVE20"
}
```

**Create Order Response:**
```json
{
  "success": true,
  "data": {
    "firestoreOrderId": "ORDER_ABC123",
    "cashfreeOrderId": "CF_ORDER_XYZ",
    "paymentSessionId": "payment_session_abc",
    "finalAmount": 1500,
    "convenienceFee": 25.50
  }
}
```

---

### Event Routes (`/events`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| GET | `/events/availability` | Check seat availability | ✗ |
| GET | `/events/list` | Get all events | ✗ |
| GET | `/events/{eventId}` | Get event details | ✗ |

**Availability Response:**
```json
{
  "success": true,
  "data": {
    "availability": [
      { "id": "10", "aval": true, "seatsLeft": 45 },
      { "id": "12", "aval": false, "seatsLeft": 0 }
    ]
  }
}
```

---

### User Routes (`/user`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| GET | `/user/purchases` | Get user orders | ✓ |
| GET | `/user/teams` | Get user teams | ✓ |

**Purchases Response:**
```json
{
  "success": true,
  "data": {
    "purchases": [
      {
        "orderId": "ORDER_123",
        "amount": 1500,
        "events": [
          { "eventId": "10", "title": "Workshop: React" }
        ],
        "qrToken": "encrypted_token_xyz",
        "paidAt": "2026-03-15T10:30:00Z"
      }
    ]
  }
}
```

---

### OTP Routes (`/otp`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/otp/send-otp` | Send OTP to email | ✗ |
| POST | `/otp/verify-otp` | Verify OTP | ✗ |

**Send OTP Request:**
```json
{ "email": "user@example.com" }
```

**Verify OTP Request:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

---

### Scan Routes (`/scan`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/scan/validate-qr` | Validate QR token | ✓ Admin |
| POST | `/scan/mark-attended` | Mark user as attended | ✓ Admin |

**Validate QR Request:**
```json
{ "qrToken": "encrypted_token_xyz" }
```

**Mark Attended Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "ORDER_123",
    "userName": "John Doe",
    "events": ["Workshop: React", "Talk: Web Dev"],
    "checkedInAt": "2026-03-15T10:30:00Z"
  }
}
```

---

### Promo Routes (`/promo`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/promo/validate` | Validate promo code | ✗ |
| POST | `/promo/apply` | Apply promo to order | ✓ |

**Validate Promo Request:**
```json
{
  "code": "SAVE20",
  "eventIds": ["10", "12"]
}
```

**Validate Promo Response:**
```json
{
  "success": true,
  "data": {
    "code": "SAVE20",
    "isValid": true,
    "discount": 20,
    "discountType": "PERCENTAGE",
    "maxDiscount": 500
  }
}
```

---

### College Routes (`/colleges`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| GET | `/colleges/list` | Get all colleges | ✗ |
| GET | `/colleges/{collegeId}` | Get college details | ✗ |

---

## 📁 Project Structure

### Frontend Structure
```
frontend/
├── public/
│   ├── assets/
│   │   ├── fall_back/      # Fallback images
│   │   ├── passes/         # Pass/ticket images
│   │   └── slogos/         # Sponsor logos
│   └── fonts/              # Custom fonts
│
├── src/
│   ├── components/         # Reusable React components (20+ files)
│   ├── screens/            # Page components (10+ files)
│   ├── context/            # State management providers
│   ├── services/           # API service layer
│   ├── lib/                # Utility functions
│   ├── data/               # Static data files
│   ├── utils/              # App utilities
│   ├── firebase.js         # Firebase config
│   ├── App.jsx             # Root component
│   ├── main.jsx            # Entry point
│   └── styles/             # CSS files
│
├── package.json            # 50+ dependencies
├── vite.config.js
├── tailwind.config.js
├── jsconfig.json
└── eslint.config.js
```

### Backend Structure
```
functions/src/
├── app.js                  # Express config
├── server.js               # Local server entry
├── server1.js              # Alternative server
│
├── config/
│   ├── env.js              # Local env config
│   ├── env1.js             # Cloud env config
│   ├── firebase.js         # Firebase Admin init
│   └── setAdmin.js         # Admin setup
│
├── controllers/            # Business logic (8 files)
│   ├── auth.controller.js
│   ├── payment.controller.js
│   ├── user.controller.js
│   ├── event.controller.js
│   ├── otp.controller.js
│   ├── scan.controller.js
│   ├── college.controller.js
│   └── promo.controller.js
│
├── routes/                 # API route definitions (7 files)
│   ├── auth.routes.js
│   ├── payment.routes.js
│   ├── user.routes.js
│   ├── event.routes.js
│   ├── otp.routes.js
│   ├── college.routes.js
│   └── promo.routes.js
│
├── middlewares/            # Request processors (5 files)
│   ├── auth.middleware.js
│   ├── admin.middleware.js
│   ├── rateLimit.middleware.js
│   ├── error.middleware.js
│   └── requireRegisteredUser.js
│
├── service/                # Business services (3+ files)
│   ├── order.service.js
│   ├── cashfree.service.js
│   └── otp.service.js
│
├── utils/                  # Helper functions
│   ├── response.js
│   ├── mailer.js
│   └── token.js
│
├── data/                   # Static data
│   ├── limitedSeatEvents.js
│   ├── promoCode.js
│   └── colleges.js
│
├── index.js               # Firebase Functions entry
└── package.json           # 15+ dependencies
```

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js 22+** and npm
- **Firebase Project** (with Firestore, Auth, Functions)
- **Git** for version control
- **Vite-compatible browser** (all modern browsers)

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cat > .env.local << EOF
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_API_URL=http://localhost:5000/api
EOF

# Start development server
npm run dev

# Build for production
npm run build

# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

### Backend Setup

```bash
# Navigate to functions directory
cd functions

# Install dependencies
npm install

# Create .env file in root (not functions/)
cat > ../.env << EOF
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Firebase
FIREBASE_PROJECT_ID=your_project_id
GOOGLE_APPLICATION_CREDENTIALS=path/to/serviceAccountKey.json

# Cashfree Payment Gateway
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
CASHFREE_WEBHOOK_SECRET=your_webhook_secret

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key

# OTP Configuration
OTP_EXPIRY_MINUTES=5
OTP_RESEND_COOLDOWN_SECONDS=60
EOF

# Start local server
npm run dev

# (Or use nodemon for auto-reload)
nodemon src/server.js
```

---

## 🔐 Environment Configuration

### Frontend (.env.local)
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyD...
VITE_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=project-id
VITE_FIREBASE_STORAGE_BUCKET=project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXX

# API
VITE_API_URL=https://api.example.com
```

### Backend (.env)
```env
# Server
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://example.com

# Firebase Admin
FIREBASE_PROJECT_ID=project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json

# Cashfree Payment Gateway
CASHFREE_APP_ID=xxx_production_xxx
CASHFREE_SECRET_KEY=xxx_secret_key_xxx
CASHFREE_WEBHOOK_SECRET=webhook_secret_xxx

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# OTP Configuration
OTP_EXPIRY_MINUTES=5
OTP_RESEND_COOLDOWN_SECONDS=60
```

**⚠️ Important:** Never commit `.env` files to git. Add to `.gitignore`:
```
# .gitignore
.env
.env.local
.env.production
serviceAccountKey.json
node_modules/
dist/
```

---

## ▶️ Running the Application

### Development Mode

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
# Opens at http://localhost:5173
```

**Terminal 2 - Backend:**
```bash
cd functions
npm run dev
# Server runs at http://localhost:5000
```

### Production Mode

```bash
# Frontend - Build
cd frontend
npm run build

# Backend - Deploy to Firebase Functions
cd functions
firebase deploy --only functions

# Frontend - Deploy to Firebase Hosting
firebase deploy --only hosting
```

---

## 📦 Deployment

### Firebase Deployment

#### Prerequisites
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase project
firebase init
```

#### Deploy Backend (Firebase Functions)
```bash
cd functions
firebase deploy --only functions

# Deploy specific function
firebase deploy --only functions:api
```

#### Deploy Frontend (Firebase Hosting)
```bash
cd frontend
npm run build

firebase deploy --only hosting
```

#### Deploy Firestore Rules & Indexes
```bash
firebase deploy --only firestore:rules,firestore:indexes
```

#### Full Production Deployment
```bash
# From project root
firebase deploy
```

### Environment-Specific Setup

**Production Firebase Project:**
1. Create separate Firebase project for production
2. Update `firebaserc` with project aliases
3. Set production environment variables
4. Deploy with `firebase deploy --config production`

---

## 🤝 Contributing Guidelines

### Code Style
- **Frontend**: Follow ESLint + Prettier configuration
- **Backend**: Follow Node.js best practices
- **Naming**: camelCase for variables, PascalCase for components

### Pull Request Process
1. Create feature branch: `git checkout -b feature/name`
2. Make changes and commit: `git commit -m "feat: description"`
3. Push to branch: `git push origin feature/name`
4. Create Pull Request with description
5. Address code review feedback
6. Merge after approval

### Testing
```bash
# Frontend linting
cd frontend && npm run lint

# Backend (if tests exist)
cd functions && npm test

# Format code
npm run format
```

---

## 📄 License

This project is proprietary and confidential. All rights reserved.

---

## 📞 Support & Contact

For issues, questions, or suggestions:
- Create an issue in the repository
- Contact the development team
- Check documentation first

---

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Complete authentication system
- Payment gateway integration
- QR code generation and scanning
- Real-time seat availability
- Admin dashboard
- Promotional code system

---

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Cashfree API Reference](https://docs.cashfree.com)

---

**Last Updated:** March 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
