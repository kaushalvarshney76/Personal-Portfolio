import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    senderName: {
      type: String,
      required: true,
      lowercase: true,
      minlength: [4, "Discriptive Name must be required!!"],
    },
    subject: {
      type: String,
      required: true,
      minlength: [2, "Discriptive Subject must be required!!"],
    },
    message: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);