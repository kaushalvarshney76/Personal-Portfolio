import { asyncHandler } from "../utils/asyncHandler.js";
import { Message } from "../models/message.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const sendMessage = asyncHandler(async (req, res) => {
    const { senderName, subject, message } = req.body;

    if (!senderName && !subject && !message) {
        return res.status(400).json({
          message: "All Sender fields are required!!",
          success: false
        });
    }

    const data = await Message.create({ senderName, subject, message });

    return res
        .status(201)
        .json(
            new ApiResponse(201, data, "Message Successfully recieved!!")
        )
})

const getAllMessage = asyncHandler(async (req, res) => {
    const allmessageList = await Message.find();
    if (!allmessageList) {
        return res.status(404).json({
          message: "Meesage not found!!",
          success: false
        });
    }
    return res.status(200)
        .json(
            new ApiResponse(200, allmessageList, "All message fetched successfully!!")
    )
})

const deleteMessage = asyncHandler(async (req, res) => {
    const { _id } = req.params;
    console.log("ID is ", _id);
    const message = Message.findById(_id);

    console.log("Message is ", message);
    if (!message) {
        return res.status(404).json({
          message: "Message not found for deleting!!",
          success: false
        });
    }
    await message.deleteOne();

    return res.status(200)
        .json(
        new ApiResponse(200, "Message deleted successfully!!")
    )
})

export { sendMessage, getAllMessage, deleteMessage };

