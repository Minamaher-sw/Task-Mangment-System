import jwt from "jsonwebtoken"
import User from "../models/user.model.js";
import StatusCodes from "../utils/status.codes.js";
import JSEND_STATUS from "../utils/http.status.message.js";
const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: JSEND_STATUS.FAIL,
                message: "Authentication failed: Token missing or invalid"
            });
        }
        const token = authHeader.split(" ")[1];
        // eslint-disable-next-line no-undef
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ username: payload.username });

        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: JSEND_STATUS.FAIL,
                message: "User not registered"
            });
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            status: JSEND_STATUS.ERROR,
            message: err.message  || "Invalid or expired token" 
        });
    }
};
export default auth;