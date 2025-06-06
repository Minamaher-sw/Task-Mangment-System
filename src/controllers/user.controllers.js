import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import  jwt from 'jsonwebtoken';
const signup= async (req,res)=>{
        try{
            const { firstname,lastname , username, password ,email } = req.body;
            const createdUser =await User.create({ firstname,lastname , username, password ,email})
            res.send(createdUser)
        }
        catch(err)
        {
            res.status(500).json({message:"internal server error" ,err:err});
        }
    }
const userLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const token = jwt.sign(
            {
                username: user.username,
                id: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login successful",
            token
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message || err });
    }
};
const getAllUser =async (req,res)=>{
        try{
            const allUsers =await User.find();
            res.send(allUsers)
        }
        catch(err)
        {
            res.status(500).json({message:"internal server error"});
        }
    }

const getUserById =async (req,res)=>{
        const userId = req.params.id;
        try{
            const user =await User.find({_id:userId});
            if(user)
            {
                res.send(user)
            }
            else{
                throw "internal server error"
            }
        }
        catch(err)
        {
            res.status(500).json({message:"internal server error"});
        }
    }
const updateUser = async (req, res) => {
    const userId = req.params.id;
    const { username,firstname ,lastname ,email,password} = req.body;

    try {

        const user = await User.findOne({ _id: userId });
        if (!user) return res.status(404).json({ message: "user not found" });

        if (username !== undefined) user.username = username;
        if (firstname !== undefined) user.firstname = firstname;
        if (lastname !== undefined) user.lastname = lastname;
        if (email !== undefined) user.email = email;
        if (password !== undefined) user.password = password;

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
        
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: "Update failed", error: err.message || err });
    }
};


const deleteUser =async (req,res)=>{
    try{
            const userId =req.params.id;
            await User.deleteOne({_id :userId});
            res.send("User Is Delelted")
        }
        catch(err){
        res.status(500).json({message:"internal server error"});
    }
    }

export{
    signup,
    userLogin,
    getAllUser,
    getUserById,
    updateUser,
    deleteUser
}