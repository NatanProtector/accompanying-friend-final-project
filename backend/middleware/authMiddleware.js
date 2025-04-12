const jwt = require("jsonwebtoken");

module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Example: { _id, role, email }
    console.log("[AUTH] Authenticated user:", decoded);
    next();
  } catch (err) {
    console.error("[AUTH] Token verification failed:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};
