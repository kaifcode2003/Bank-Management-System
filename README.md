# BankMate - Core Banking System

Full-stack project with Node.js (Express) + MongoDB + JWT + bcrypt on the backend and React + Vite + Tailwind on the frontend. Deployment targets: Render (backend) and Vercel (frontend).

## Monorepo Structure

- `backend/` — Express API with Mongoose, JWT auth, RBAC, and transactions
- `frontend/` — Vite + React + Tailwind application

## Requirements

- Node.js 18+
- MongoDB 6+

## Backend Setup

1. Copy env example

```bash
cp backend/.env.example backend/.env
```

2. Install dependencies and run dev server

```bash
cd backend
npm install
npm run dev
```

3. Seed sample data (admin + customer + accounts)

```bash
npm run seed
```

API base: `http://localhost:4000/api`

### Key API Routes

- `POST /api/auth/register` — name, email, phone, password
- `POST /api/auth/login` — email, password
- `POST /api/accounts` — create account (auth)
- `GET /api/accounts/mine` — list my accounts (auth)
- `GET /api/accounts/:accountNumber` — account details (auth, owner/admin)
- `PATCH /api/accounts/:accountNumber/status` — admin only
- `POST /api/transactions/deposit` — auth, owner/admin
- `POST /api/transactions/withdraw` — auth, owner/admin
- `POST /api/transactions/transfer` — auth, owner/admin for source account
- `GET /api/transactions/history/:accountNumber` — auth, owner/admin
- `GET /api/users` — admin list users
- `GET /api/accounts` — admin list accounts
- `GET /api/transactions` — admin list all transactions

## Frontend Setup

1. Env

```bash
cp frontend/.env.example frontend/.env
```

2. Install and run

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## Demo Credentials

- Admin
  - email: `admin@bankmate.local`
  - password: `Admin@12345`
- Customer
  - email: `customer@bankmate.local`
  - password: `Customer@12345`

## Deployment

### Render (Backend)

- Create new Web Service from the `backend` directory
- Build Command: `npm install`
- Start Command: `npm start`
- Set environment variables:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `JWT_EXPIRES_IN` (e.g. `7d`)
  - `CLIENT_ORIGIN` (your Vercel frontend URL)
- Expose port 10000 if using render.yaml, or default PORT provided by Render

### Vercel (Frontend)

- Import the repo, set Root Directory to `frontend`
- Framework Preset: Vite
- Environment Variables:
  - `VITE_API_BASE_URL` — your Render backend URL, e.g. `https://bankmate-backend.onrender.com/api`
- Deploy

## Notes

- JWT stored in localStorage; Axios attaches `Authorization: Bearer <token>` automatically.
- Transactions use Mongo sessions; ensure your Mongo deployment supports transactions (Replica Set).
