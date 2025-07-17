import jwt from "jsonwebtoken";

// AUTHENTICATION
export const authMiddleware = async (req, res, next) => {
  if (!req.headers.cookie)
    return res.status(400).json({ message: "user not authenticated" });
  if (req.headers.cookie && req.headers.cookie.length == 0)
    return res.status(400).json({ message: "user not authenticated" });
  const token = req.headers.cookie
    .split(";")
    .map((c) => c.trim())
    .filter((c) => c.includes("accessToken"));
  if (token.length == 0)
    return res.status(400).json({ message: "user not authenticated" });
  let accessToken = token[0].split("=").at(-1).trim();

  const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
  if (!decodedToken)
    return res.status(400).json({ message: "user not authenticated" });
  req.userId = decodedToken.user_id;
  next();
};
