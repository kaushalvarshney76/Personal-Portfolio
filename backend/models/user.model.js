import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new Schema({
    fullName: {
        type: String,
        required: [true, "Name must be required"],
    },
    email: {
        type: String,
        required: [true, "email must be required!!"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password must be required!!"],
        select: false
    },
    aboutMe: {
        type: String,
        required: [ true, "About me section is required!!"],
    },
    phone: {
        type: String,
        required: [true, "Phone number is required!!"]
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true
        }
    },
    resume: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true
        }
    },
    portfolio_url: {
        type: String,
        required: [true, "Portfolio url is required!!"]
    },
    facebookURL: {
        type: String
    },
    githubURL: {
        type: String
    },
    instagramURL: {
        type: String
    },
    linkedinURL: {
        type: String
    },
    refreshToken: {
        type: String,
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    }
})

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.getResetPasswordToken = function () {
  //Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //Hashing and Adding Reset Password Token To UserSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //Setting Reset Password Token Expiry Time
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};
export const User = mongoose.model("User", userSchema);
