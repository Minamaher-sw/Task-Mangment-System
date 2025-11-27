/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import express from "express";
import "dotenv/config.js";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import dbConnect from "./src/config/db.connection.js";
import userRouter from "./src/routes/user.route.js";
import auth from "./src/middlewares/auth.middleware.js";
import taskRouter from "./src/routes/task.route.js";
import JSEND_STATUS from "./src/utils/http.status.message.js";
import { setSubscription } from "./src/utils/subscriptionStore.js";
import { connectRedis } from "./src/config/redis.js";

const app = express();
app.use(cors());
app.use(express.json());
// socketio
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    credentials: true,
  },
});

const Port = process.env.PORT || 3001;
const hostname = "0.0.0.0";

//
app.post("/api/save-subscription", (req, res) => {
  let subscriptionStore = req.body;
  setSubscription(subscriptionStore);
  console.log("📥 Subscription saved", subscriptionStore);
  res.status(201).json({ message: "Subscription saved" });
});
// database connection
// server listen
app.get("/", (req, res) => {
  res.send("Server is running successfully");
});
try {
  await dbConnect();
  await connectRedis();
  console.log("Database and Redis connected successfully");
} catch (err) {
  console.error("Database connection failed:", err);
  process.exit(1); // exit if DB connection fails
}
server
  .listen(Port, hostname, () => {
    console.log(`Server is running on the port  ${Port}`);
  })
  .on("error", (err) => {
    console.error("Server failed to start:", err);
    process.exit(1);
  });

// // THEN handle connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
    io.emit("notification", {
      title: "hi",
      message: "complete",
      unreadCount: 12,
    });
  });
});
// Send via socket

app.use("/user", userRouter);
app.use(auth);
app.use("/task", taskRouter);

// wildcard route
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});
// // error handler
// // eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Error:", err);
  let statusCode = err.statusCode !== 200 ? err.statusCode : 500;
  let statusText = err.statusText || JSEND_STATUS.ERROR;
  let message = err.message || "Internal Server Error";
  //     //Validation Error from Mongoose Schema
  if (err.name === "ValidationError") {
    statusCode = 400;
    statusText = JSEND_STATUS.FAIL;
    const errors = Object.values(err.errors).map((e) => e.message);
    message = `Validation Error: ${errors.join(", ")}`;
  }

  // Cast Error (e.g. ObjectId or invalid date)
  if (err.name === "CastError") {
    statusCode = 400;
    statusText = JSEND_STATUS.FAIL;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Duplicate key error from MongoDB
  if (err.code && err.code === 11000) {
    statusCode = 409;
    statusText = JSEND_STATUS.FAIL;
    const fields = Object.keys(err.keyValue).join(", ");
    message = `Duplicate field value(s): ${fields}`;
  }

  res.status(statusCode).json({
    status: statusText,
    data: { message },
  });
});
