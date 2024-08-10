import mongoose, { Schema } from "mongoose";

const timelineSchema = new Schema({
    title: {
        type: String,
        required: [true, "Timeline title is required!!"]
    },
    description: {
        type: String,
        required: [true, "Timeline discription is required!!"],
    },
    timeline: {
        from: String,
        to: String
    }
})

export const Timeline = mongoose.model("Timeline", timelineSchema);