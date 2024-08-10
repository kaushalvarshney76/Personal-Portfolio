import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema({

    title: {
        type: String
    },
    description: {
        type: String
    },
    gitRepoLink: {
        type: String
    },
    projectLink: {
        type: String
    },
    technologies: {
        type: String
    },
    stack: {
        type: String
    },
    deployed: {
        type: String
    },
    projectBanner: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }
}, {timestamps: true})

export const Project = mongoose.model("Project", projectSchema);