import Task from "../models/task.model.js";

const createTask =async(req,res)=>{

    const TaskData =req.body ;
    const user =req.user ;
    const inserTask ={
        title :TaskData.title,
        description :TaskData.description ?TaskData.description  :" ",
        dueDate:TaskData.dueDate,
        priority:TaskData.priority ?TaskData.priority:"Low",
        status :TaskData.status ?TaskData.status:"In Progress",
        category:TaskData.category,
        userID : user._id 
    }
    try{
        const createdTask = await Task.create(inserTask);
        res.status(201).json(createdTask);
    }
    catch(err){
        res.status(500).json({message:err});
    }

}

const getAllTasks = async (req,res)=>{

    try{
        const allTasks = await Task.find({userID: req.user._id }).populate("userID");
        res.status(201).json(allTasks);
    }
    catch(err){
        res.status(500).json({ message: err.message || err || "update is failed" });
    }
}

const getTask = async (req,res)=>{

    const taskId = req.params.id;
    const task = await Task.findOne({ _id: taskId, userID: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    try{
        const retTask = await Task.findOne({_id:taskId});
        res.status(201).json(retTask);
    }
    catch(err){
        res.status(500).json({ message: err.message || err || "update is failed" });
    }
}

const updateTask = async (req, res) => {
    const taskId = req.params.id;
    const { title, description, priority, category, dueDate, status } = req.body;

    try {

        const task = await Task.findOne({ _id: taskId, userID: req.user._id });
        if (!task) return res.status(404).json({ message: "Task not found" });

        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (priority !== undefined) task.priority = priority;
        if (category !== undefined) task.category = category;
        if (dueDate !== undefined) task.dueDate = dueDate;
        if (status !== undefined) task.status = status;

        const updatedTask = await task.save();
        res.status(200).json(updatedTask);
        
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: "Update failed", error: err.message || err });
    }
};

const deleteTask = async (req,res)=>{
    const taskId = req.params.id;

    const task = await Task.findOne({ _id: taskId, userID: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    try{
        await Task.deleteOne({_id:taskId});
        res.json({ message: "Task deleted successfully" })
    }
    catch(err){
        res.status(500).json({ message: err.message || err || "Task deleted failed" });
    }
}
export{
    createTask, 
    getAllTasks ,
    getTask ,
    updateTask ,
    deleteTask
}