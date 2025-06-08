import asyncWrapper from "../middlewares/async.wrapper.js";
import Task from "../models/task.model.js";
import appErrors from "../utils/app.errors.js";
import JSEND_STATUS from "../utils/http.status.message.js";

import StatusCodes from "../utils/status.codes.js";


const createTask = asyncWrapper(
    async (req, res) => {
        const user = req.user;
        const createdTask = await Task.create({ userID: user._id, ...req.body });
        res.status(StatusCodes.CREATED).json({ status: "success", data: createdTask });
    }
);

const getAllTasks = asyncWrapper(
    async (req, res) => {
        const allTasks = await Task.find({ userID: req.user._id },{__v :false}).populate("userID");
        res.status(StatusCodes.OK).json({ status: "success", data: allTasks });
}
)

const getTask = asyncWrapper(async (req, res) => {
    const taskId = req.params.id;
    const task = await Task.findOne({ _id: taskId, userID: req.user._id });

    if (!task) 
        { 
            const error = appErrors.createError("Task not found",StatusCodes.NOT_FOUND,JSEND_STATUS.ERROR);
            throw error ;
        };
    
    const retTask = await Task.findOne({ _id: taskId });
    res.status(StatusCodes.OK).json({ status: "success", data: retTask });
})

const updateTask = asyncWrapper(async (req, res) => {
    const taskId = req.params.id;
    const { title, description, priority, category, dueDate, status } = req.body;
    const task = await Task.findOne({ _id: taskId, userID: req.user._id });
    if(!task){
        const error = appErrors.createError("Task not found",StatusCodes.NOT_FOUND,JSEND_STATUS.ERROR);
        throw error ;
    }
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (category !== undefined) task.category = category;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (status !== undefined) task.status = status;

    const updatedTask = await task.save();
    res.status(StatusCodes.OK).json({ status: "success", data: updatedTask });
})

const deleteTask = asyncWrapper(
    async (req, res) => {
    const taskId = req.params.id;
    const task = await Task.findOne({ _id: taskId, userID: req.user._id });
    if (!task)
    {
        const error = appErrors.createError("Task not found",StatusCodes.NOT_FOUND,JSEND_STATUS.ERROR);
        throw error ;
    }
    await Task.deleteOne({ _id: taskId });
    res.status(StatusCodes.OK).json({ status: "success", data: null });
}
)
export{
    createTask, 
    getAllTasks ,
    getTask ,
    updateTask ,
    deleteTask
}