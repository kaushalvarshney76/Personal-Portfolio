import express, { Router } from "express";
import {
  loginUser,
  register,
  logoutUser,
  myProfile,
  updateProfile,
  updatePassword,
  getUserPortfolio,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controller.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";

const router = Router();
//routes for users
router.route("/register").post(register);
router.route("/login").post(loginUser);
router.route("/logout").get(jwtVerify, logoutUser)
router.route("/profile").get(jwtVerify, myProfile)
router.route("/update/profile").patch(jwtVerify, updateProfile);
router.route("/update/password").patch(jwtVerify, updatePassword);
router.route("/getPortfolio").get(jwtVerify,getUserPortfolio);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

export default router;
