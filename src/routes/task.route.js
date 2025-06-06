
import express from "express"
import { createTask, getAllTasks ,getTask ,updateTask ,deleteTask} from "../controllers/Task.controllers.js";
import authorize  from "../middlewares/authoriz.middleware.js"
const taskRouter =express.Router();

taskRouter.post("/",authorize(["user"]),createTask)
taskRouter.get("/",authorize(["user"]) ,getAllTasks)
taskRouter.get("/:id",authorize(["user"]),getTask)
taskRouter.patch("/:id",authorize(["user","admin"]),updateTask)
taskRouter.delete("/:id",authorize(["user"]),deleteTask);

export default taskRouter;

