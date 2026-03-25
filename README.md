# Backend Developer Intern Assignment

A Scalable REST API with Authentication & Role-Based Access, built on the MERN stack with a basic React frontend.

## Features Built
### Backend (Node.js, Express, MongoDB)
- **User Authentication:** Registration, Login with JWT and bcrypt password hashing.
- **Role-Based Access:** Admin vs User roles (Admins can view all tasks, users only their own).
- **Secondary Entity (Tasks):** Full CRUD for Tasks.
- **Forgot Password:** Integration with SendGrid for sending password reset emails with tokens.
- **Security:** Input sanitization, Express Validator, and JWT handling.
- **API Documentation:** Swagger UI integration available at `/api-docs`.

### Frontend (React, Vite, TailwindCSS)
- **Authentication UI:** Login and Registration pages handling API responses.
- **Dashboard UI:** Protected Route that fetches tasks conditionally based on user role.
- **CRUD Operations:** Modal interface to Add, Edit, and Delete tasks.

## Setup Instructions

### Backend
1. Go to the `server` directory: `cd server`
2. Install dependencies: `npm install`
3. Update `server/.env` with your actual credentials:
   - `MONGO_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: Random string for JWT signing.
   - `SENDGRID_API_KEY`: Your SendGrid API Key.
4. Run the API Server: `npm run dev`
   - The server will start on `http://localhost:5000`
   - View API Documentation at `http://localhost:5000/api-docs`

### Frontend
1. Go to the `client` directory: `cd client`
2. Install dependencies: `npm install`
3. Run the Vite dev server: `npm run dev`
   - The application will be accessible at `http://localhost:5173`

## Scalability Note
To ensure this application handles increased load and traffic effectively, the following concepts are critical:

1. **Microservices Architecture:** As the app grows, splitting the monolithic backend into smaller services (Auth Service, Task Service, Notification Service) allows independent scaling.
2. **Caching:** Integrating **Redis** to cache frequently accessed queries (e.g., fetching a user's task list) reduces database load and speeds up response times significantly.
3. **Load Balancing:** Deploying multiple instances of the Node.js server behind a Load Balancer (like Nginx, AWS ALB) distributes incoming traffic, preventing any single instance from becoming a bottleneck.
4. **Database Indexing & Sharding:** Ensuring MongoDB collections are properly indexed on heavily queried fields (like `user_id` inside Tasks). As data scales, distributing data across multiple replica sets (sharding) improves read/write capacity.
5. **Containerization:** Using **Docker** to containerize the application ensures environment consistency. Combined with Kubernetes, it allows automated horizontal scaling based on resource usage.
