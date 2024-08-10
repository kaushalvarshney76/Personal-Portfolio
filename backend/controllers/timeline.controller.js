import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Timeline } from "../models/timeline.model.js";

const addTimeline = asyncHandler(async (req, res) => {
    const { title, description, from, to } = req.body;

    if (!title && !description) {
        return res.status(400).json({
          message: "title or discription required!!",
            success: false
        });
    }
    const newTimeline = await Timeline.create({
        title,
        description,
        timeline: {from, to}
    })
    return res
        .status(201)
        .json(
            new ApiResponse(200, newTimeline, "New timeline created successfully")
    )
})

const getAllTimeline = asyncHandler(async (req, res) => {
    const timelines = await Timeline.find();

    if (!timelines) {
        return res.status(404).json({
          message: "Any timeline not found!!",
          success: false
        });
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, timelines, "All timeline fetched successfully")
    )
})

const deleteTimmeline = asyncHandler(async (req, res) => {
    const { _id } = req.params;
    const findtimeline = await Timeline.findById(_id);

    if (!findtimeline) {
        return res.status(404).json({
          message: "Timeline not found!!",
          success: false
        });
    }
    await Timeline.deleteOne();
    return res
        .status(200)
        .json(
        new ApiResponse(200, "Timeline deleted successfully!!")
    )
})

export { addTimeline, getAllTimeline, deleteTimmeline };