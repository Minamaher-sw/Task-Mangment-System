import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    firstname: {
      type: String,
      minlength: [3, "First name must be at least 3 characters"],
      maxlength: [20, "First name must not be more than 10 characters"],
      required: true,
    },
    lastname: {
      type: String,
      minlength: [3, "Last name must be at least 3 characters"],
      maxlength: [20, "Last name must not be more than 10 characters"],
      required: true,
    },
    username: {
      type: String,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username must not be more than 10 characters"],
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minlength: [10, "Password must be at least 3 characters"],
      maxlength: [64, "Password must not be more than 10 characters"],
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    roles: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.roles;
        return ret;
      },
    },
  }
);
userSchema.pre("save" , async function(next){
  if(!this.isModified("password")) return next();
  try{
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  }
  catch(err){
    next(err);
  }
})
const User = mongoose.model("User", userSchema);
export default User;
