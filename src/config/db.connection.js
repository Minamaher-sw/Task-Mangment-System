/* eslint-disable no-undef */
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const dbConnect = async () => {

    const conn = await mongoose.connect(process.env.MONGO_URI_DOCKER);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    // Optional: handle connection events
    mongoose.connection.on("connected", () => {
        console.log("Mongoose connected to DB");
    });

    mongoose.connection.on("error", (err) => {
        console.error(" Mongoose connection error:", err);
        process.exit(1); // Exit process with failure
    });

    mongoose.connection.on("disconnected", () => {
        console.warn("Mongoose disconnected from DB");
});
}

export default dbConnect;