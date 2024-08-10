import { Router } from "express";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import { addSkill, deleteSkill, getAllSkill, updateSkill } from "../controllers/skill.controller.js";

const router = Router();
router.route("/add").post(jwtVerify, addSkill);
router.route("/delete/:_id").delete(jwtVerify, deleteSkill);
router.route("/getall").get(jwtVerify, getAllSkill);
router.route("/update/skill/:_id").patch(jwtVerify, updateSkill);
export default router