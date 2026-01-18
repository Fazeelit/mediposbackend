// backend/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT token
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    req.role = decoded.role || "user";

    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

const verifyAdmin = (req, res, next) => {
  if (!req.role) return res.status(401).json({ message: "User not authenticated" });
  if (req.role.toLowerCase() !== "admin") return res.status(403).json({ message: "Access denied. Admins only." });
  next();
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.role) return res.status(401).json({ message: "User not authenticated" });
  if (!roles.map(r => r.toLowerCase()).includes(req.role.toLowerCase())) {
    return res.status(403).json({ message: "Access denied. Insufficient permissions." });
  }
  next();
};

export default verifyToken;
export { verifyAdmin, authorizeRoles };
