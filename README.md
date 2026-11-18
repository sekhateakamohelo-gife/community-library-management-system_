# Community Library Management System

Student project for Web Application Development (BIWA2110). React/Vite frontend, Express REST API, and MySQL database.

## Requirements
- Node.js 18+ and npm
- MySQL Server (e.g. MySQL Community Server)

## 1. Database setup
1. Open MySQL Workbench or your MySQL command line.
2. Run the full `database.sql` script. It creates the `community_library` database, tables, and example books.

## 2. Backend setup
From a terminal, enter the backend directory:
```bash
cd backend
npm install
```
Copy `.env.example` to `.env` and edit the MySQL password/user values. Keep the database name `community_library` unless you also change the SQL and environment file. Start the API:
```bash
npm start
```
The API uses `http://localhost:5000`; check `http://localhost:5000/api/health`.
On its first startup, the backend creates a demo administrator if one does not already exist:
- Email: `admin@library.local`
- Password: `Admin123!`

## 3. Frontend setup
In another terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL, normally `http://localhost:5173`.

## API overview
- `POST /api/auth/login` - sign in
- `GET /api/dashboard` - dashboard summary (authenticated)
- `/api/books` - GET and POST; `/:id` - PUT and DELETE
- `/api/users` - GET and POST; `/:id` - PUT and DELETE (administrator)
- `/api/transactions` - GET and POST (administrator)

All API requests except health and login require a bearer token. Admin-only routes require an administrator account. Passwords are hashed with bcryptjs. The database password belongs in the local `.env` file and must never be committed.

## Project notes
- Borrowing reduces available copies (calculated from transaction records).
- Returning books increases availability by creating a return transaction.
- Adding stock increases total quantity and records the stock transaction.
- The dashboard flags titles with fewer than two copies available.
