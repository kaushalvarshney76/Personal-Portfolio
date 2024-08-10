export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateRefreshToken();
  res
    .status(statusCode)
    .cookie("token", token, {
      expireIn: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      sameSite: "None",
      secure: false,
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};

