import ApiResponse from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'

function handelUserAuthentication(req, res, next) {
  try {
    const token =
      req.cookies?.token || req.cookies?.jwt ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json(
        new ApiResponse(401, {}, "Unauthorized: Please login first")
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = {
      _id: decoded.userId,
      email: decoded.email,
      username: decoded.username,
      role : decoded.role
    };

    next();
  } catch (error) {
    return res.status(401).json(
      new ApiResponse(401, {}, "Invalid or expired token")
    );
  }
}

export { handelUserAuthentication };
