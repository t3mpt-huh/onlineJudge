const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

const authMiddleware = async (req, res, next) => {
  // Extract the token from the Authorization header
  const authHeader = req.header("Authorization");
  
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized. Token not provided." });
  }

  // Assuming the token is in the format "Bearer <jwtToken>"
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : authHeader.trim();
  console.log("Token from auth middleware:", token);

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Find the user by email extracted from the token
    const userData = await User.findOne({ email: decodedToken.email }).select({ password: 0 });
    if (!userData) {
      return res.status(401).json({ message: "Unauthorized. User not found." });
    }

    req.user = userData;
    req.token = token;
    req.userID = userData._id;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized. Invalid token." });
  }
};

module.exports = authMiddleware;
