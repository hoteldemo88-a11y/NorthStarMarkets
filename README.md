# North Star Markets Platform

Modern multi-page fintech platform with client and admin portals.

## Project Structure

- `frontend/` - Frontend React + Vite application (public website + dashboards)
- `backend/` - Node.js + Express + MySQL API (JWT auth, user/admin endpoints)

## Frontend Features

- Marketing pages: Home, About, Markets, FAQ, Careers, Contact, Clients Reviews
- Navbar includes `Login` and `Open Account` on all public pages
- Multi-step account opening form:
  - Create account
  - Personal information
  - Financial information
  - Compliance questions
  - Risk profile
  - Trading experience
  - Investment preferences
- Client dashboard:
  - Account balance
  - Open trades
  - Trade history
  - Deposit requests
  - Withdrawal requests
  - Profile settings
- Admin dashboard:
  - Admin login
  - Manage users
  - Adjust balances
  - Create trades
  - Approve/reject funding requests
  - View activity logs

## Backend Features

- Express REST API with MySQL
- JWT authentication and role authorization
- Password hashing with bcrypt
- Separate client and admin route groups

## Backend Setup

1. Create database and tables:

```sql
SOURCE backend/schema.sql;
```

2. Configure environment:

- Copy `backend/.env.example` to `backend/.env`
- Update MySQL credentials and JWT secret

3. Install and run backend:

```bash
cd backend
npm install
npm run dev
```

API base URL defaults to `http://localhost:5000/api`

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Optional environment variable for API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

## Production Notes

- Use strong `JWT_SECRET`
- Rotate admin bootstrap credentials
- Add HTTPS, rate limiting, and audit monitoring before production launch
