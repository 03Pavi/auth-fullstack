const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const SECRET = process.env.SECRET;
const isAuthorised = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(403).json({
      success: false,
      message: "Please login first.",
    });
  }
  try {
    const isValid = await verifyToken(token);
    if (!isValid) {
      return res.status(403).json({
        success: false,
        message: "Token is expired.",
      });
    }
    req.userId = isValid;
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
const verifyToken = async (token) => jwt.verify(token, SECRET);
module.exports = isAuthorised;
