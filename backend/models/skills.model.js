import mongoose, { Schema } from "mongoose";

const skillsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    proficiency: {
        type: Number,
        required: true
    },
    svg: {
        public_id: {
            type: String,
            required :true
        },
        url: {
            type: String,
            required: true
        }
    }
}, {timestamps: true})

export const Skill = mongoose.model("Skill", skillsSchema);