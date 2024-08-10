import mongoose, { Schema } from "mongoose";

const softwareAppliicationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  svg: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }
}, {timestamps: true});

export const softwareApplication = mongoose.model(
  "softwareApplication",
  softwareAppliicationSchema
);