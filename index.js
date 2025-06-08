import express from "express";
import "dotenv/config.js";
import dbConnect from "./src/config/db.connection.js";
import userRouter from "./src/routes/user.route.js";
import auth from "./src/middlewares/auth.middleware.js";
import taskRouter from "./src/routes/task.route.js";
import JSEND_STATUS from "./src/utils/http.status.message.js";

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

// wildcard route
app.use("*",(req,res)=>{
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
})
// error handler 
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error("Error:", err);
    let statusCode = err.statusCode !== 200 ? err.statusCode : 500;
    let statusText = err.statusText || JSEND_STATUS.ERROR;
    let message = err.message || "Internal Server Error";

    //Validation Error from Mongoose Schema
    if (err.name === "ValidationError") {
        statusCode = 400;
        statusText = JSEND_STATUS.FAIL;
        const errors = Object.values(err.errors).map(e => e.message);
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