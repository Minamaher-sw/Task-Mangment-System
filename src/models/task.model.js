import mongoose from "mongoose";

const {Schema} =mongoose;

const taskSchema =new Schema({

    title:{
        type:String,
        minlength: [3, "Task title must be at least 3 characters"],
        maxlength: [60, "Task title must not be more than 60 characters"],
        required: true,
    },
    description:{
        type:String,
        minlength: [1, "Task description must be at least 1 character"],
        maxlength: [300, "Task description must not be more than 300 characters"],
    },
    dueDate:{
        type:Date,
        required:true,
    },
    priority:{
        type:String,
        enum:["Low", "Medium", "High"],
        default: "Low",
    },
    status:{
        type:String,
        enum:["Pending", "In Progress", "Completed"],
        default:"In Progress",
    },
    category:{
        type:String,
        minlength: [1, "Task category must be at least 1 character"],
        maxlength: [30, "Task category must not be more than 30 characters"],
        required:true
    },
    reminderTime:{
        type:Date,
        default:null,
        required:false,
    },
    userID:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"User",
        required:true,
    }
},{timestamps:true})

// text indexes 
taskSchema.index({ title: "text", description: "text", category: "text" });

const Task = mongoose.model("Task",taskSchema);

export default Task;