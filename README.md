# CampusX - College Asset Monetization Platform

CampusX is a full-stack demo platform for monetizing underused college infrastructure such as classrooms, labs, auditoriums, and sports complexes.

## Tech Stack

- Frontend: React.js with Vite, Tailwind CSS, Framer Motion
- Backend: Node.js, Express
- Database: MongoDB with an in-memory fallback for instant demo use

## Features

- Landing page with vibrant gradient styling and glassmorphism cards
- Login and signup flows with role-based access for `admin`, `user`, and `organizer`
- Admin dashboard for asset CRUD and revenue analytics
- User and organizer dashboard for bookings and profile management
- Asset listing page with filters for location, type, price, and capacity
- Booking flow with availability checks, mock payment success/failure support, and UI notifications
- Reusable components, loading states, error handling, and bundled sample data

## Project Structure

```text
campusX/
  backend/
    src/
      config/
      controllers/
      data/
      middleware/
      models/
      routes/
      utils/
  frontend/
    src/
      components/
      context/
      data/
      layouts/
      pages/
      services/
      utils/
```

## Backend Setup

1. Open a terminal in [backend](c:\Web Develop\campusX\backend)
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env`
4. Start the API:

```bash
npm run dev
```

5. Optional: seed MongoDB sample data after MongoDB is running:

```bash
npm run seed
```

### Backend Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/campusx
JWT_SECRET=campusx-super-secret
CLIENT_URL=http://localhost:5173
```

## Frontend Setup

1. Open a terminal in [frontend](c:\Web Develop\campusX\frontend)
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env`
4. Start the frontend:

```bash
npm run dev
```

5. Create a production build when needed:

```bash
npm run build
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
```

## Demo Accounts

- Admin: `admin@campusx.com`
- Organizer: `organizer@campusx.com`
- User: `user@campusx.com`
- Password for all accounts: `password123`

## API Endpoints

- `POST /api/auth/login`
- `POST /api/auth/signup`
- `GET /api/auth/me`
- `GET /api/assets`
- `POST /api/assets`
- `PUT /api/assets/:id`
- `DELETE /api/assets/:id`
- `GET /api/bookings`
- `GET /api/bookings/availability/check`
- `POST /api/bookings`
- `GET /api/bookings/analytics/revenue`
- `POST /api/payments`

## Notes

- If MongoDB is unavailable, the backend falls back to in-memory demo data so the app still runs locally.
- Payment integration currently uses a mock flow, but the `/payments` route is structured so Razorpay can be added next.
