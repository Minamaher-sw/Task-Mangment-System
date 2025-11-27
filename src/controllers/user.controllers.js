import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncWrapper from "../middlewares/async.wrapper.js";
import StatusCodes from "../utils/status.codes.js";
import appErrors from "../utils/app.errors.js";
import JSEND_STATUS from "../utils/http.status.message.js";
import { setCache } from "../services/cacheService.js";
const signup = asyncWrapper(async (req, res) => {
  const createdUser = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({
    status: "success",
    data: createdUser,
  });
});
const userLogin = asyncWrapper(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    const error = appErrors.createError(
      "Invalid username or password",
      StatusCodes.UNAUTHORIZED,
      JSEND_STATUS.FAIL
    );
    throw error;
  }
  const valid = bcrypt.compare(password, user.password);
  if (!valid) {
    const error = appErrors.createError(
      "Invalid username or password",
      StatusCodes.UNAUTHORIZED,
      JSEND_STATUS.FAIL
    );
    throw error;
  }
  const token = jwt.sign(
    {
      username: user.username,
      id: user._id,
    },
    // eslint-disable-next-line no-undef
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  res.status(StatusCodes.OK).json({
    message: "Login successful",
    token,
  });
});

const getAllUser = asyncWrapper(async (req, res) => {
  const allUsers = await User.find();
  res.status(StatusCodes.OK).json({
    status: JSEND_STATUS.SUCCESS,
    data: allUsers,
  });
});

const getUserById = asyncWrapper(async (req, res) => {
  const userId = req.params.id;

//   // 1️⃣ Check cache first
// we do it at middleware
//   const cachedUser = await getCache(`user:${userId}`);
//   if (cachedUser) return res.status(StatusCodes.OK).json({
//     status: JSEND_STATUS.SUCCESS,
//     data: cachedUser,
//   });
  const user = await User.findById(userId);
  if (!user) {
    const error = appErrors.createError(
      "Invalid username or password",
      StatusCodes.UNAUTHORIZED,
      JSEND_STATUS.FAIL
    );
    throw error;
  }
  await setCache(`user:${userId}`, user);
  res.status(StatusCodes.OK).json({
    status: JSEND_STATUS.SUCCESS,
    data: user,
  });
});

const updateUser = asyncWrapper(async (req, res) => {
  const userId = req.params.id;
  const { username, firstname, lastname, email, password } = req.body;

  const user = await User.findOne({ _id: userId });
  if (!user) {
    const error = appErrors.createError(
      "Invalid username or password",
      StatusCodes.UNAUTHORIZED,
      JSEND_STATUS.FAIL
    );
    throw error;
  }

  if (username !== undefined) user.username = username;
  if (firstname !== undefined) user.firstname = firstname;
  if (lastname !== undefined) user.lastname = lastname;
  if (email !== undefined) user.email = email;
  if (password !== undefined) user.password = password;

  const updatedUser = await user.save();
  res.status(StatusCodes.OK).json({
    status: JSEND_STATUS.SUCCESS,
    data: updatedUser,
  });
});

const deleteUser = asyncWrapper(async (req, res) => {
  const userId = req.params.id;
  await User.deleteOne({ _id: userId });
  res.status(StatusCodes.OK).json({
    status: JSEND_STATUS.SUCCESS,
    data: { message: "User is deleted" },
  });
});

export { signup, userLogin, getAllUser, getUserById, updateUser, deleteUser };
