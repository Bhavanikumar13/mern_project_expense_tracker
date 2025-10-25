# 🏗️ Expense Tracker - Application Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                     (Browser / Mobile Web)                      │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                      │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Pages      │  │  Components  │  │   Context    │         │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤         │
│  │ Dashboard    │  │ Header       │  │ AuthContext  │         │
│  │ Transactions │  │ Sidebar      │  │ ThemeContext │         │
│  │ Analytics    │  │ Modal        │  └──────────────┘         │
│  │ Categories   │  │ Loading      │                           │
│  │ Reports      │  └──────────────┘                           │
│  │ Profile      │                                              │
│  │ Login        │  ┌──────────────┐                           │
│  │ Signup       │  │   Services   │                           │
│  └──────────────┘  ├──────────────┤                           │
│                    │ API Client   │                           │
│  ┌──────────────┐  │ Axios        │                           │
│  │   Styling    │  └──────────────┘                           │
│  ├──────────────┤                                              │
│  │ Tailwind CSS │  ┌──────────────┐                           │
│  │ Dark Mode    │  │   Libraries  │                           │
│  │ Responsive   │  ├──────────────┤                           │
│  └──────────────┘  │ Recharts     │                           │
│                    │ React Router │                           │
│                    │ React Icons  │                           │
│                    │ React Toast  │                           │
│                    └──────────────┘                           │
└─────────────────────────────────────────────────────────────────┘
                                  │
                              HTTP/HTTPS
                            (REST API Calls)
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                  BACKEND (Node.js + Express)                    │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    API Routes                             │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ /api/auth         - Authentication (Login, Register)     │  │
│  │ /api/transactions - Transaction CRUD                     │  │
│  │ /api/categories   - Category Management                  │  │
│  │ /api/users        - User Profile                         │  │
│  │ /api/reports      - PDF/CSV/Email Reports                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                  │                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Middleware Layer                        │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ • Authentication (JWT Verification)                       │  │
│  │ • Input Validation (Express Validator)                   │  │
│  │ • Error Handling                                          │  │
│  │ • CORS Configuration                                      │  │
│  │ • File Upload (Multer)                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                  │                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Controllers                             │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ authController      - User authentication logic          │  │
│  │ transactionController - Transaction operations           │  │
│  │ categoryController  - Category operations                │  │
│  │ userController      - Profile management                 │  │
│  │ reportController    - Report generation                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                  │                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Services                               │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ • NodeMailer (Email Service)                             │  │
│  │ • PDFKit (PDF Generation)                                │  │
│  │ • json2csv (CSV Export)                                  │  │
│  │ • Bcrypt (Password Hashing)                              │  │
│  │ • JWT (Token Generation)                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                  │
                          MongoDB Protocol
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE (MongoDB)                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Collections                            │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                           │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────┐ │  │
│  │  │     Users      │  │  Transactions  │  │ Categories │ │  │
│  │  ├────────────────┤  ├────────────────┤  ├────────────┤ │  │
│  │  │ _id            │  │ _id            │  │ _id        │ │  │
│  │  │ name           │  │ user (ref)     │  │ name       │ │  │
│  │  │ email          │  │ title          │  │ type       │ │  │
│  │  │ password       │  │ amount         │  │ icon       │ │  │
│  │  │ profilePicture │  │ type           │  │ color      │ │  │
│  │  │ currency       │  │ category (ref) │  │ isDefault  │ │  │
│  │  │ monthlyBudget  │  │ date           │  │ user (ref) │ │  │
│  │  │ createdAt      │  │ notes          │  │ createdAt  │ │  │
│  │  └────────────────┘  │ paymentMethod  │  └────────────┘ │  │
│  │                      │ createdAt      │                 │  │
│  │                      └────────────────┘                 │  │
│  │                                                           │  │
│  │  Indexes:                                                │  │
│  │  • users.email (unique)                                  │  │
│  │  • transactions.user, transactions.date                  │  │
│  │  • categories.user, categories.type                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. User Authentication Flow

```
User                Frontend           Backend            Database
 │                     │                  │                  │
 │  Enter credentials  │                  │                  │
 ├────────────────────>│                  │                  │
 │                     │  POST /api/auth/login               │
 │                     ├─────────────────>│                  │
 │                     │                  │  Find user       │
 │                     │                  ├─────────────────>│
 │                     │                  │<─────────────────┤
 │                     │                  │  Compare password│
 │                     │                  │  Generate JWT    │
 │                     │<─────────────────┤                  │
 │                     │  Token + User    │                  │
 │   Display dashboard │                  │                  │
 │<────────────────────┤                  │                  │
 │                     │  Store token     │                  │
 │                     │  in localStorage │                  │
```

### 2. Transaction Management Flow

```
User                Frontend           Backend            Database
 │                     │                  │                  │
 │  Add Transaction    │                  │                  │
 ├────────────────────>│                  │                  │
 │                     │  POST /api/transactions             │
 │                     ├─────────────────>│                  │
 │                     │  + JWT Token     │  Verify token    │
 │                     │                  │  Validate data   │
 │                     │                  │  Create document │
 │                     │                  ├─────────────────>│
 │                     │                  │<─────────────────┤
 │                     │<─────────────────┤                  │
 │                     │  New transaction │                  │
 │   Show success      │                  │                  │
 │<────────────────────┤                  │                  │
 │   Update UI         │                  │                  │
```

### 3. Analytics Data Flow

```
User                Frontend           Backend            Database
 │                     │                  │                  │
 │  View Analytics     │                  │                  │
 ├────────────────────>│                  │                  │
 │                     │  GET /api/transactions/stats/summary│
 │                     ├─────────────────>│                  │
 │                     │  + JWT Token     │  Verify token    │
 │                     │                  │  Aggregate data  │
 │                     │                  ├─────────────────>│
 │                     │                  │<─────────────────┤
 │                     │                  │  Calculate totals│
 │                     │                  │  Group by category
 │                     │                  │  Monthly trends  │
 │                     │<─────────────────┤                  │
 │                     │  Statistics JSON │                  │
 │   Display charts    │                  │                  │
 │<────────────────────┤                  │                  │
```

### 4. Report Generation Flow

```
User                Frontend           Backend            Services
 │                     │                  │                  │
 │  Download PDF       │                  │                  │
 ├────────────────────>│                  │                  │
 │                     │  GET /api/reports/pdf               │
 │                     ├─────────────────>│                  │
 │                     │  + JWT Token     │  Fetch data      │
 │                     │  + Date range    │  from MongoDB    │
 │                     │                  │  Generate PDF    │
 │                     │                  ├─────────────────>│
 │                     │                  │  (PDFKit)        │
 │                     │                  │<─────────────────┤
 │                     │<─────────────────┤                  │
 │                     │  PDF Blob        │                  │
 │   Download file     │                  │                  │
 │<────────────────────┤                  │                  │
```

## Component Hierarchy

```
App
├── ThemeProvider
│   └── AuthProvider
│       └── Router
│           ├── Public Routes
│           │   ├── Login
│           │   └── Signup
│           │
│           └── Private Routes (Protected)
│               └── Layout
│                   ├── Sidebar
│                   ├── Header
│                   └── Outlet
│                       ├── Dashboard
│                       │   ├── Stats Cards
│                       │   ├── Charts (Recharts)
│                       │   └── Recent Transactions
│                       │
│                       ├── Transactions
│                       │   ├── Filters
│                       │   ├── Table
│                       │   └── TransactionModal
│                       │
│                       ├── Analytics
│                       │   ├── Date Range
│                       │   ├── Pie Charts
│                       │   ├── Line Charts
│                       │   └── Bar Charts
│                       │
│                       ├── Categories
│                       │   ├── Filter Tabs
│                       │   ├── Category Grid
│                       │   └── CategoryModal
│                       │
│                       ├── Reports
│                       │   ├── Date Configuration
│                       │   ├── Quick Presets
│                       │   └── Download Options
│                       │
│                       └── Profile
│                           ├── Profile Picture
│                           ├── Personal Info Form
│                           ├── Currency Settings
│                           └── Budget Settings
```

## API Endpoint Structure

```
/api
├── /auth
│   ├── POST   /register      - Create new user
│   ├── POST   /login         - Authenticate user
│   ├── GET    /me            - Get current user
│   └── GET    /logout        - Logout user
│
├── /transactions
│   ├── GET    /              - Get all transactions (with filters)
│   ├── GET    /:id           - Get single transaction
│   ├── POST   /              - Create transaction
│   ├── PUT    /:id           - Update transaction
│   ├── DELETE /:id           - Delete transaction
│   └── GET    /stats/summary - Get statistics
│
├── /categories
│   ├── GET    /              - Get all categories (with filters)
│   ├── GET    /:id           - Get single category
│   ├── POST   /              - Create category
│   ├── PUT    /:id           - Update category
│   └── DELETE /:id           - Delete category
│
├── /users
│   ├── GET    /profile       - Get user profile
│   ├── PUT    /profile       - Update profile
│   ├── PUT    /profile/picture - Update profile picture
│   └── DELETE /profile       - Delete account
│
└── /reports
    ├── GET    /pdf           - Download PDF report
    ├── GET    /csv           - Download CSV report
    └── POST   /email         - Send email report
```

## Database Schema Relationships

```
┌─────────────┐
│    Users    │
│   (1 user)  │
└──────┬──────┘
       │
       │ has many
       │
       ├─────────────────────────────┬───────────────────────┐
       │                             │                       │
       ▼                             ▼                       ▼
┌──────────────┐            ┌─────────────┐        ┌─────────────┐
│ Transactions │            │ Categories  │        │  Profile    │
│  (n records) │            │ (n records) │        │   Info      │
└──────┬───────┘            └──────┬──────┘        └─────────────┘
       │                           │
       │ references                │
       └───────────────────────────┘
           belongs to category
```

## Technology Stack Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
├─────────────────────────────────────────────────────────────┤
│  React.js │ Tailwind CSS │ Recharts │ React Router         │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
├─────────────────────────────────────────────────────────────┤
│  Express.js │ JWT │ Bcrypt │ Multer │ NodeMailer           │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      Business Logic Layer                    │
├─────────────────────────────────────────────────────────────┤
│  Controllers │ Services │ Validators │ Middleware           │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      Data Access Layer                       │
├─────────────────────────────────────────────────────────────┤
│  Mongoose │ Models │ Schemas │ Queries                      │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      Database Layer                          │
├─────────────────────────────────────────────────────────────┤
│  MongoDB │ Collections │ Documents │ Indexes                │
└─────────────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    Security Layers                          │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Transport Layer Security                               │
│     • HTTPS/TLS encryption                                 │
│     • Secure WebSocket connections                         │
│                                                             │
│  2. Authentication Layer                                    │
│     • JWT token validation                                 │
│     • Bcrypt password hashing                              │
│     • Token expiration handling                            │
│                                                             │
│  3. Authorization Layer                                     │
│     • Route protection middleware                          │
│     • User ownership verification                          │
│     • Role-based access control (ready)                    │
│                                                             │
│  4. Input Validation Layer                                  │
│     • Express Validator                                    │
│     • Mongoose schema validation                           │
│     • Sanitization middleware                              │
│                                                             │
│  5. Error Handling Layer                                    │
│     • Centralized error handler                            │
│     • Secure error messages                                │
│     • Logging and monitoring                               │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

This architecture provides a scalable, maintainable, and secure foundation for the Expense Tracker application.
