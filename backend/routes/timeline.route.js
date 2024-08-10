import express, { Router } from "express";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import { addTimeline, deleteTimmeline, getAllTimeline } from "../controllers/timeline.controller.js";

const router = Router();
//routes for timeline
router.route("/add").post(jwtVerify, addTimeline);
router.route("/getall").get(jwtVerify, getAllTimeline);
router.route("/delete/:_id").delete(jwtVerify, deleteTimmeline);

export default router;