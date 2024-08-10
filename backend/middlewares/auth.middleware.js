import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const jwtVerify = asyncHandler(async (req, _, next) => {
    const { token } = req.cookies;

    if (!token) {
        throw new ApiError(400, "User not authenticated!!");
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    req.user = await User.findById(decoded._id);
    next();
})

export { jwtVerify };