import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Skill } from "../models/skills.model.js";
import { v2 as cloudinary } from "cloudinary";

const addSkill = asyncHandler(async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        message: "Image For Skill Required!",
        success: false
      });
    }
  const { svg } = req.files;
  // console.log("req file is", req.files);
    const { title, proficiency } = req.body;
    if (!title || !proficiency) {
      return res.status(500).json({
        message: "Please Fill Full Form!",
        success: false
      });
  }
  // console.log("title amd proficiency is", title, proficiency);
    const cloudinaryResponse = await cloudinary.uploader.upload(
      svg.tempFilePath,
      { folder: "PORTFOLIO SKILL IMAGES" }
  );
  // console.log("cloudinary response is: ", cloudinaryResponse);
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponse.error || "Unknown Cloudinary error"
      );
      console.log("clodinary error is :", cloudinaryResponse.error)
      return res.status(500).json({
        message: "Failed to upload avatar to Cloudinary",
        success: false
      })
    }
    const skill = await Skill.create({
      title,
      proficiency,
      svg: {
        public_id: cloudinaryResponse.public_id, 
        url: cloudinaryResponse.secure_url,
        },
    });
  // console.log("Skills is :", skill);
    return res.status(201).json({
      success: true,
      message: "New Skill Added",
      skill,
    });
})

const deleteSkill = asyncHandler(async (req, res) => {
    const { _id } = req.params;
    const findskill = await Skill.findById(_id);
    if (!findskill) {
      return res.status(404).json({
        message: "Skills not found!!",
        success: false
      });
    }
    const findskillSVG = findskill.svg.public_id;
    await cloudinary.uploader.destroy(findskillSVG);
    await Skill.deleteOne();
    return res
        .status(200)
        .json(
            new ApiResponse(200, "Skill deleted successfully!!")
    )
})

const getAllSkill = asyncHandler(async (req, res) => {
    const allSkills = await Skill.find();
    return res
        .status(200)
        .json(
        new ApiResponse(200, allSkills, "All skills fetched successfully!!")
    )
})

const updateSkill = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  let skill = await Skill.findById(_id);
  if (!skill) {
    return res.status(404).json({
      message: "Skill not found",
      success: false
    });
  }
  const { proficiency } = req.body;
  skill = await Skill.findByIdAndUpdate(
    _id,
    { proficiency },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
    message: "Skill Updated!",
    skill,
  });

});
export { addSkill, deleteSkill, getAllSkill, updateSkill };