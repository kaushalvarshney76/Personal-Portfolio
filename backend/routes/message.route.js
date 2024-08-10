import { Router } from "express";
import { deleteMessage, getAllMessage, sendMessage } from "../controllers/message.controller.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";

const router = Router();
//routes for messages
router.route("/sendMessage").post(sendMessage);
router.route("/getMessage").get(getAllMessage);
router.route("/deleteMessage/:_id").delete(jwtVerify, deleteMessage);

export default router;