# EmpTrack

EmpTrack is a full-stack employee management dashboard built with a React + Vite frontend and an Express + MongoDB backend.

## Project preview
<img width="1917" height="911" alt="front_page_emptrack" src="https://github.com/user-attachments/assets/404ee634-2fc0-4f64-a437-47623d30a332" />

---

<img width="1917" height="910" alt="2nd_page" src="https://github.com/user-attachments/assets/fb5ad248-8733-4084-94d0-a49cd85cb010" />

---

<img width="1917" height="912" alt="3rd_apge" src="https://github.com/user-attachments/assets/f3f77746-6c7b-4d1a-a6d6-1034046e0e70" />

---

## Project structure

- `client/` - React application using Vite and Tailwind CSS.
- `server/` - Express API server with MongoDB, JWT authentication, email support, and Inngest event handling.

## Features

- Employee login and profile management
- Attendance check-in and history
- Leave application and history
- Payslip generation and listing
- Admin dashboard and employee management
- Email notifications via SMTP
- MongoDB persistence

## Prerequisites

- Node.js 18+ or compatible LTS version
- npm
- MongoDB connection string
- SMTP credentials for email delivery (Brevo/Sendinblue or another SMTP provider)

## Setup

### 1. Backend (server)

```bash
cd server
npm install
```

Create a `.env` file in `server/` with values similar to:

```env
PORT=4000
MONGO_DB_URL=mongodb+srv://username:password@cluster0.example.mongodb.net/emptrack?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SENDER_EMAIL=sender@example.com
ADMIN_EMAIL=admin@example.com
```

Start the server:

```bash
npm run server
```

Optional: seed the database with default data:

```bash
npm run seed
```

### 2. Frontend (client)

```bash
cd client
npm install
npm run dev
```

Open the local Vite URL shown in the terminal (typically `http://localhost:5173`).

## API Endpoints

The backend exposes REST endpoints under `/api` for:

- `/api/auth`
- `/api/employees`
- `/api/profile`
- `/api/attendance`
- `/api/leave`
- `/api/payslips`
- `/api/dashboard`

## Notes

- The server uses `dotenv` to load environment variables.
- The frontend is configured with React Router and Axios for API calls.
- Update the frontend API base URL in `client/src/utils/axios.js` or `.env` if the server runs on a non-default port.

## License

This project does not include a license file. Add one if you want to share or publish the code.
