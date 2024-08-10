import express, { Router } from "express";
import { addApplication, deleteApplication, getAllApplication } from "../controllers/softwareApplication.controller.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add").post(jwtVerify, addApplication);
router.route("/delete/:_id").delete(jwtVerify, deleteApplication);
router.route("/getall").get(jwtVerify, getAllApplication);

export default router;