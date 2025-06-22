import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
  try {
   const token = req.headers.authorization?.split(" ")[1] || 
                 req.headers.Authorization?.split(" ")[1]; // Add this line
    console.log("Token received:", token);
    if (!token) {
      console.log("No token found");
      return res.status(401).json({ error: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = {
      _id: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role
    };
    
    console.log("User authenticated:", req.user);
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    
    res.status(401).json({ error: "Not authorized" });
  }
};
export { protect };