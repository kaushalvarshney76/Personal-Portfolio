import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { v2 as cloudinary } from "cloudinary";
import {softwareApplication} from "../models/softwareApplication.model.js"

const addApplication = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(500).json({
      message: "Application Name is required!!",
      success: false
    });
  }
  const { svg } = req.files;
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      message: "Application file is required!!",
      success: false
    });
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(
    svg.tempFilePath,
    {
      folder: "Application File"
    }
  )

  if (!cloudinaryResponse) {
    return res.status(500).json({
      message: "Application file is not uploaded!!",
      success: false
    });
  }

  const newApplication = await softwareApplication.create({
    name,
    svg: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  return res
    .status(201)
    .json(
    new ApiResponse(200, newApplication, "Application add successfully!!")
  )
})

const deleteApplication = asyncHandler(async (req, res) => {

  const { _id } = req.params;
  const softwareApplicationSVG = await softwareApplication.findById(_id);

  if (!softwareApplicationSVG) {
    return res.status(404).json({
      message: "software Application not found!!",
      success: false
    });
  }
  const softwareApplicationSVGPublicID = softwareApplicationSVG.svg.public_id;
  await cloudinary.uploader.destroy(softwareApplicationSVGPublicID);
  await softwareApplication.deleteOne();

  return res
    .status(200)
    .json(
    new ApiResponse(200, "software Application deleted successfully!!")
  )
})

const getAllApplication = asyncHandler(async (req, res) => {
  const getallApplication = await softwareApplication.find();
  return res
    .status(200)
    .json(
      new ApiResponse(200, getallApplication, "fetched all application successfully!!")
  )
})

export { addApplication, deleteApplication, getAllApplication };