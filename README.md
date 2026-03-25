# TaskFlow - Full-Stack MERN Task Manager

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge&logo=mongodb)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Node](https://img.shields.io/badge/Node.js-22-green?style=for-the-badge&logo=node.js)

TaskFlow is a beautifully designed, scalable full-stack task management application built as part of the backend developer internship assignment. It features robust role-based access control, JWT-based authentication, interactive UI elements, and email integration.

---

## 🌟 Core Features

### 🔐 Authentication & Security
*   **JWT Authentication**: Secure user sessions using JSON Web Tokens.
*   **Password Hashing**: Passwords strongly encrypted using `bcryptjs`.
*   **SendGrid Integration**: Real, functioning "Forgot Password" and "Reset Password" workflows delivering stunning HTML emails directly to users.
*   **Password Strength Validations**: Client-side reactive progress bars enforcing complex security standards.
*   **Robust Data Validations**: Extensive RegEx checks across all forms avoiding malformed data parsing.

### 👥 Role-Based Access Control (RBAC)
*   **Admin Control Center**: Custom dashboard view for Administrators to oversee platform-wide metrics (Completion Rates, Active Users) and manage any user's tasks.
*   **User Workspace**: Personalized task dashboard preventing horizontal privilege escalation (Users can only see and edit their own tasks).
*   **Profile Settings**: Both roles have access to account settings to update their Display Name and Email.

### 📝 Task Management & Delegation
*   **Deadlines & Tracking**: Set specific deadlines with dynamic UI feedback alerting users of overdue task priorities.
*   **Admin Delegation**: Administrators have the exclusive ability to assign or reassign tasks seamlessly to other users via their registered Email Address.
*   Interact with a custom-built API allowing users to Create, Read, Update, and Delete tasks.

### 🎨 Stunning UI/UX
*   Built using React 19 + Tailwind CSS v4.
*   Premium aesthetics: Glassmorphism gradients, deep shadows, hover-animations, and empty-state placeholders.
*   Responsive layout optimized for both desktop and mobile views.

---

## 🛠️ Technology Stack

*   **Frontend**: React.js (Vite), React Router v7, Tailwind CSS v4, Lucide React (Icons), Axios, Date-Fns.
*   **Backend**: Node.js, Express.js (v5), MongoDB, Mongoose (v9).
*   **Utilities**: SendGrid Mail (for transactional password reset emails), JsonWebToken, Bcrypt.js, Dotenv.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18+) installed. You will also need a MongoDB database URL and a verified SendGrid account API Key.

### 1. Backend Setup

1. Open your terminal and navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Environment Variables:
   Create a `.env` file in the `server` directory and add your credentials:
   ```env
   NODE_ENV=development
   PORT=5000

   # MongoDB
   MONGO_URI=your_mongodb_connection_string

   # JWT
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=30d

   # SendGrid (Requires Single Sender Verification)
   SENDGRID_API_KEY=your_sendgrid_api_key
   FROM_EMAIL=your_verified_sendgrid_email@domain.com
   FROM_NAME=TaskFlow
   
   # Frontend URL for emailing
   CLIENT_URL=http://localhost:5173
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Open a new terminal and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5173`.

---

## 📡 API Endpoints

The backend exposes a structured RESTful API.

**Authentication Routes (`/api/v1/auth`)**
*   `POST /register` - Register a new user (`user` or `admin`).
*   `POST /login` - Login and receive JWT.
*   `GET /me` - Get current logged-in user profile.
*   `PUT /updatedetails` - Update user profile settings.
*   `POST /forgotpassword` - Send password reset email.
*   `PUT /resetpassword/:resettoken` - Reset password.

**Task Routes (`/api/v1/tasks`)**
*   `GET /` - Fetch tasks (Users see their own; Admins see all).
*   `POST /` - Create a new task.
*   `PUT /:id` - Update a task.
*   `DELETE /:id` - Delete a task.

---

## 📈 Scalability Considerations

This architecture is prepared for future scalability:
*   **Modular Routing**: Express routers and controllers are separated cleanly to allow painless feature scaling.
*   **Stateless Authentication**: JWT completely detaches session storage from the database, allowing backend servers to be horizontally scaled smoothly.
*   **ES Modules**: Setup natively using ES modules on Node (v22+) natively avoiding legacy CommonJS bundle size issues.
*   **React Context**: Implemented scalable Global React Context allowing the authentication state to be easily managed tree-wide without prop drilling.

*Designed with ❤️ for the Primetrade Backend Assignment.*
