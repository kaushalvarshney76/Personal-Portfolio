import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

const register = asyncHandler(async (req, res) => {
  const { avatar} = req.files;

    console.log("Avatar is ", avatar);
    //handle for Avatar file
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(404).json({
        message: "Avatar file is required!!",
        success: false
        })
    }
    
    const cloudinaryResponseforAvatar = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        {
            folder: "Avatar",
        }
    );

    if (!cloudinaryResponseforAvatar || cloudinaryResponseforAvatar.error) {
        console.log("CLOUDINARY_ERROR: ", cloudinaryResponseforAvatar.error);
      return res.status(500).json({
        message: "Cloudinary Avatar Uploaded error!!",
        success: false
      });
    }
    
    //handle for Resume files
    const { resume } = req.files;
    console.log("Resume; ", resume);
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(404).json({
        message: "Resume files must be required!!",
        success: false
      });
    }

  const cloudinaryResponseforResume = await cloudinary.uploader.upload(
    resume.tempFilePath,
    {
      folder: "Resume",
    }
  );

  if (!cloudinaryResponseforResume || cloudinaryResponseforResume.error) {
    console.log("CLOUDINARY_ERROR: ", cloudinaryResponseforResume.error);
    return res.status(404).json({
      message: "Cloudinary Uploaded error!!",
      success: false
    });
  }

  //handle for other fields--
  const {
    fullName,
    email,
    password,
    aboutMe,
    phone,
    portfolio_url,
    facebookURL,
    githubURL,
    instagramURL,
    linkedinURL,
    } = req.body;
    
    if (!fullName && !email && !password && !aboutMe && phone && portfolio_url) {
      return res.status(400).json({
        message: "All fields must be required!!",
        success: false
      });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      aboutMe,
      phone,
      portfolio_url,
      facebookURL,
      githubURL,
      instagramURL,
        linkedinURL,
        avatar: {
            public_id: cloudinaryResponseforAvatar.public_id,
            url: cloudinaryResponseforAvatar.secure_url
        },
        resume: {
            public_id: cloudinaryResponseforResume.public_id,
            url: cloudinaryResponseforResume.secure_url
        }
    });
  
  generateToken(user, "Register Successfully!!", 201, res);
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required!!",
      success: false
    })
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(404).json({
      message: "User not found!!",
      success: false
    })
  }

   const isValidPassword = await user.isPasswordCorrect(password);

   if (!isValidPassword) {
     return res.status(400).json({
       message: "Correct password is required",
       success: false
     })
  }
  //  const getuser = await User.findById(user._id).select("-password");
    generateToken(user, "Login Successfully!", 200, res);
});

const logoutUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie(
      "token",
      {
        httpOnly: true,
        sameSite: "None",
      }
    )
    .json(
    new ApiResponse(200, "User logout Successfully!!")
  )
})

const myProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  return res
    .status(200)
    .json(
    new ApiResponse(200, user, "My profile Fetched successfully!!")
  )
})

const updateProfile = asyncHandler(async (req, res) => {
  const newUserdata = {
    fullName: req.body.fullName,
    email: req.body.email,
    aboutMe: req.body.aboutMe,
    phone: req.body.phone,
    portfolio_url: req.body.portfolio_url,
    facebookURL: req.body.facebookURL,
    githubURL: req.body.githubURL,
    instagramURL: req.body.instagramURL,
    linkedinURL: req.body.linkedinURL,
  };
//update avatar file
  if (req.files?.avatar) {
    const avatar = req.files.avatar;
    const user = await User.findById(req.user._id);
    const avatarPublicId = user.avatar.public_id;
    await cloudinary.uploader.destroy(avatarPublicId);
    const cloudinaryResponse = await cloudinary.uploader.upload(
      avatar.tempFilePath,
      {
        folder: "Avatar",
      }
    );
    newUserdata.avatar = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }
  //update resume file
  if (req.files?.resume) {
    const resume = req.files.resume;
    const user = await User.findById(req.user._id);
    const resumePublicId = user.resume.public_id;
    await cloudinary.uploader.destroy(resumePublicId);
    const cloudinaryResponse = await cloudinary.uploader.upload(
      resume.tempFilePath,
      {
        folder: "Resume",
      }
    );
    newUserdata.resume = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url
    }
  }

  const user = await User.findByIdAndUpdate(req.user._id, newUserdata, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })

  return res
    .status(200)
    .json(new ApiResponse(200, user, "All details updated successfully!!"));
  
})

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword && !newPassword && !confirmPassword) {
    return res.status(400).json({
      message: "All fields are required for update password!!",
      success:false
    });
  }

  const user = await User.findById(req.user._id).select("+password");
  const matchPassword = await user.isPasswordCorrect(oldPassword);

  if (!matchPassword) {
    return res.status(400).json({
      message: "Password not matched!!",
      success: false
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "newPassword and confirmPassword not matched!!",
      success: false
    });
  }
  
  user.password = newPassword;
  await user.save();

  return res.status(200).json(new ApiResponse(200, {}, "Password update successfully!!"));
})

const getUserPortfolio = asyncHandler(async (req, res) => {
  const _id = "66af283f337e61cec7cb5e59";
  const user = await User.findById(_id);
  // console.log(user);
  return res.status(200).json(
    new ApiResponse(200, user, "User fetched our Porfolio successfully")
  )
})

const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({
      message: "User not found!!",
      success: false
    });
  }
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;

  const message = `Your Reset Password Token is:- \n\n ${resetPasswordUrl}  \n\n If 
  You've not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Personal Portfolio Dashboard Password Recovery`,
      message,
    });
    res
      .status(201)
      .json(new ApiResponse(200, `Email sent to ${user.email} successfully`));
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return res.json(
      new ApiResponse(400, "Bad request!!")
    );
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(500).json({
      message: "Reset password token is invalid or has been expired!!",
      success: false
    });
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json({
      message: "Password or confirm PAssword not matched!!",
      success: false
    });
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  generateToken(user, "Password Reset successfully!", 200, res);

})

export {
  register,
  loginUser,
  logoutUser,
  myProfile,
  updateProfile,
  updatePassword,
  getUserPortfolio,
  forgotPassword,
  resetPassword,
};
