import ApiResponse from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'

function handelUserAuthentication(req, res, next) {

  console.log("request come for user authenication")

  try {
    const token =
      req.cookies?.token ||
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
      role: decoded.role
    };

    next();
  } catch (error) {
    return res.status(401).json(
      new ApiResponse(401, {}, "Invalid or expired token")
    );
  }
}

function handelUserLogin(req, res, next) {

  console.log("request come for user authenication")

  try {
    const token =
      req.cookies?.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = {
        _id: decoded.userId,
        email: decoded.email,
        username: decoded.username,
        role: decoded.role
      };
    }

    next();

  } catch (error) {
    return res.status(401).json(
      new ApiResponse(401, {}, "Invalid or expired token")
    );
  }
}

export { handelUserAuthentication , handelUserLogin };
