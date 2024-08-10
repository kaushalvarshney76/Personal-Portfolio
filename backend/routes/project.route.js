import { Router } from "express";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import { addProject, deleteProject, getallProject, getSingleProject, updateProject } from "../controllers/project.controller.js";

const router = Router();
router.route("/add").post(jwtVerify, addProject);
router.route("/delete/:_id").delete(jwtVerify, deleteProject);
router.route("/update/:_id").patch(jwtVerify, updateProject);
router.route("/get").get(jwtVerify, getallProject);
router.route("/getSingleProject/:_id").get(jwtVerify, getSingleProject);

export default router;