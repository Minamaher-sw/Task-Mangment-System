import express from "express"
import { getAllUser, signup ,userLogin ,getUserById ,updateUser ,deleteUser} from "../controllers/user.controllers.js"
const userRouter =express.Router();


userRouter.post("/",signup)
userRouter.post("/login",userLogin)
userRouter.get("/",getAllUser)
userRouter.get("/:id",getUserById)
userRouter.patch("/:id",updateUser)
userRouter.delete("/:id",deleteUser);

export default userRouter;