import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Project } from "../models/project.model.js";
import { v2 as cloudinary } from "cloudinary";

const addProject = asyncHandler(async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      message: "Project Banner is required!!",
      success: false
    });
  }
  const { projectBanner } = req.files;
  const {
    title,
    description,
    gitRepoLink,
    projectLink,
    stack,
    technologies,
    deployed,
  } = req.body;
  if (
    !title ||
    !description ||
    !gitRepoLink ||
    !projectLink ||
    !stack ||
    !technologies ||
    !deployed
  ) {
    return res.status(400).json({
      message: "Please provide all details!!",
      success: false
    });
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    projectBanner.tempFilePath,
    { folder: "PORTFOLIO PROJECT IMAGES" }
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return res.status(500).json({
      message: "Failed to upload avatar to Cloudinary",
      success: false
    });
  }
  const project = await Project.create({
    title,
    description,
    gitRepoLink,
    projectLink,
    stack,
    technologies,
    deployed,
    projectBanner: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url, 
    },
  });
  res.status(201).json({
    success: true,
    message: "New Project Added!",
    project,
  });
});

const deleteProject = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const existedProject = await Project.findById(_id);

  if (!existedProject) {
    return res.status(404).json({
      message: "Project Not found!!",
      success: false
    });
  }

  const existedProjectBanner = existedProject.projectBanner.public_id;
  await cloudinary.uploader.destroy(existedProjectBanner);
  await Project.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, "Project deleted successfully!!"));
});

const updateProject = asyncHandler(async (req, res) => {
  const newProjectData = {
    title: req.body.title,
    description: req.body.description,
    stack: req.body.stack,
    technologies: req.body.technologies,
    deployed: req.body.deployed,
    projectLink: req.body.projectLink,
    gitRepoLink: req.body.gitRepoLink,
  };
  if (req.files && req.files.projectBanner) {
    const ProjectBanner = req.files.projectBanner;
    const project = await Project.findById(req.params._id);
    const projectImageId = project.projectBanner.public_id;
    await cloudinary.uploader.destroy(projectImageId);
    const newProjectImage = await cloudinary.uploader.upload(
      ProjectBanner.tempFilePath,
      {
        folder: "PORTFOLIO PROJECT IMAGES",
      }
    );
    newProjectData.projectBanner = {
      public_id: newProjectImage.public_id,
      url: newProjectImage.secure_url,
    };
  }
  const project = await Project.findByIdAndUpdate(
    req.params._id,
    newProjectData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
    message: "Project Updated!",
    project,
  });
});

const getallProject = asyncHandler(async (req, res) => {
  const project = await Project.find();
  return res
    .status(200)
    .json(new ApiResponse(200, project, "All Project fetched successfully!!"));
});

const getSingleProject = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  try {
    const project = await Project.findById(_id);
    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
});

export {
  addProject,
  deleteProject,
  updateProject,
  getallProject,
  getSingleProject,
};
