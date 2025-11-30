# Task Management App

A full-featured Task Management backend application built with **Node.js**, **Express**, **MongoDB**, **Redis**, **Socket.IO**, **Nginx**, and fully containerized using **Docker**, supporting both development and production environments.

The application runs in **Docker Swarm** on **AWS EC2** with auto‑updates using **Watchtower**, load balancing via **NGINX**, and database caching using **Redis**.

---

## 📁 Project Structure
```
TASK MANAGEMENT
├── nginx
│   └── default.conf
├── node_modules
├── src
│   ├── config
│   │   ├── db.connection.js
│   │   └── redis.js
│   ├── controllers
│   │   ├── Task.controllers.js
│   │   └── user.controllers.js
│   ├── middlewares
│   │   ├── async.wrapper.js
│   │   ├── auth.middleware.js
│   │   ├── authoriz.middleware.js
│   │   └── cacheMiddleware.js
│   ├── models
│   │   ├── task.model.js
│   │   └── user.model.js
│   ├── routes
│   │   ├── task.route.js
│   │   └── user.route.js
│   ├── services
│   │   └── cacheService.js
│   └── utils
│       ├── app.errors.js
│       ├── email.notifications.js
│       ├── http.status.message.js
│       ├── reminder.scheduler.js
│       ├── sms.notification.twilio.js
│       ├── status.codes.js
│       ├── subscriptionStore.js
│       └── web.push.js
├── .dockerignore
├── .env
├── .env.production
├── .gitignore
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── docker-compose.yml
├── Dockerfile
├── eslint.config.js
├── index.js
├── package-lock.json
├── package.json
└── README.md
```

---

## 📦 Dependencies & Features
This app uses all features corresponding to dependencies in `package.json`:

### **Core Backend**
- **express** → HTTP server for REST APIs
- **dotenv** → Load environment variables
- **cors** → Secure API access
- **mongoose** → MongoDB ODM
- **redis** → Cache, rate-limit, session handling
- **socket.io** → Real-time task updates
- **jsonwebtoken** → Authentication + access tokens
- **bcrypt / bcryptjs** → Hashing passwords

### **Messaging & Notifications**
- **nodemailer** → Email notifications
- **twilio** → SMS notifications
- **web-push** → Browser push notifications
- **node-schedule** → Scheduled reminder jobs

### **Dev Tools**
- **nodemon** → Auto-reload in development
- **eslint** → Code linting

---

## 🚀 Development Setup
```bash
npm install
npm run dev
```
Requires:
- Node.js ≥ 14
- MongoDB local or via Docker
- Redis local or via Docker

---

## 🐳 Docker (Development)
Run containers locally with:
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```

---

## 🐳 Docker (Production)
The production environment uses:
- **NGINX** load balancer
- **MongoDB + Mongo Express**
- **Redis** with password
- **Watchtower** for automatic image updates
- **Multiple replicas** for the Node app
- **Docker Swarm** overlay network

### 📌 Production Deployment (Docker Swarm)
Initialize swarm:
```bash
docker swarm init
```
Deploy stack:
```bash
docker stack deploy -c docker-compose.yml task_app
```

---

## 🖥 AWS EC2 Deployment
### Steps:
1. Launch EC2 Ubuntu server
2. Install Docker + Docker Swarm
3. Clone project from GitHub
4. Add environment variables to `.env.production`
5. Deploy via Docker Swarm
6. Configure NGINX load balancer

The stack handles:
- Load balancing across 4 replicas
- Automatic rollback on failure
- Auto-updates using Watchtower
- Persistent MongoDB storage using volumes

---

## 🐳 Docker Compose (Production) — Full Stack
Docker services used:
- **node-app** (4 replicas)
- **mongo** (DB)
- **mongo-express** UI
- **redis** (cache)
- **nginx** (reverse proxy)
- **watchtower** (auto-update)

All network is `overlay` for Swarm.

---

## 🔐 Environment Variables
Place in `.env` and `.env.production`:
```
PORT=4000
MONGO_URI=mongodb://root:example@mongo:27017/taskdb
JWT_SECRET=your_secret
REDIS_PASSWORD=mypassword
EMAIL_USER=...
EMAIL_PASS=...
TWILIO_SID=...
TWILIO_AUTH=...
PUSH_PUBLIC_KEY=...
PUSH_PRIVATE_KEY=...
```

---

## 🧪 API Endpoints
Below are the full documented routes based on your actual code.

---

## 👤 User Routes
**Base Path:** `/api/users`

### **POST /** — Register User
- Creates a new user account.

### **POST /login** — User Login
- Authenticates user and returns JWT token.

### **GET /** — Get All Users
- Returns all users.

### **GET /:id** — Get User By ID *(with cache)*
- Uses `cacheMiddleware` to speed up repeated requests.

### **PATCH /:id** — Update User
- Updates user's data.

### **DELETE /:id** — Delete User
- Removes user from database.

---

## 📝 Task Routes
**Base Path:** `/api/tasks`

🔐 All task routes require authorization middleware.

### Middleware Used
- `authorize(["user"])` — normal user permission
- `authorize(["admin"])` — admin permission

---

### **POST /** — Create Task
- Allowed for: `user`
- Creates a new task.

### **GET /** — Get All Tasks
- Allowed for: `user`
- Returns all tasks of authenticated user.

### **GET /:id** — Get Task By ID
- Allowed for: `user`

### **PATCH /:id** — Update Task
- Allowed for: `user`, `admin`
- Admins can update any task.

### **DELETE /:id** — Delete Task
- Allowed for: `user`

---

## 📡 Real-Time Modules
- **Socket.IO** → Live updates when tasks are created/updated
- **Redis** → Cache tasks and improve performance

---

## 🔔 Notifications System
Supported notifications:
- ✔ Email (Nodemailer)
- ✔ SMS (Twilio)
- ✔ Push Notifications (Web Push)
- ✔ Scheduled reminders (node-schedule)

---

## 👤 Author
Mina Maher Mosadef

