import express from "express";
import "dotenv/config.js";
import dbConnect from "./src/config/db.connection.js";
import userRouter from "./src/routes/user.route.js";
import auth from "./src/middlewares/auth.middleware.js";
import taskRouter from "./src/routes/task.route.js";

const app =express();
app.use(express.json());
// eslint-disable-next-line no-undef
const Port =process.env.PORT || 3001 ;
const hostname="127.0.0.1"

// database connection 
dbConnect();
// server listen 
app.listen(Port,hostname,() => {
    console.log(`Server is running on port ${Port}`);
}).on('error', (err) => {
    console.error("Server failed to start:", err);
    // eslint-disable-next-line no-undef
    process.exit(1);
});

app.use("/user",userRouter)
app.use(auth)
app.use("/task",taskRouter)
// error handler 
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error("Error:", err.message);

    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});
