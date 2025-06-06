import jwt from "jsonwebtoken"
import User from "../models/user.model.js";
const auth= async (req,res,next)=>{
    try{
        const authHeader = req.headers.authorization
        console.log(authHeader);
        if (!authHeader) {
            return res.status(401).json({ message: "Authentication failed: Token missing or invalid" });
        }
        const payload = jwt.verify(authHeader ,process.env.JWT_SECRET);
        const user =await User.findOne({username:payload.username});

        if(!user){
            return res.status(401).json({message:"user not reqist 2"})
        }
        req.user =user;
        next();
    }
    catch(err){
        next(err);
    }
}
export default auth;