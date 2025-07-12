import jwt from "jsonwebtoken";

// also add expiresIn in the jwt config
export const generateToken = (userId, userEmail) => {
  const token = jwt.sign(
    {
      user_id: userId,
      email: userEmail,
    },
    process.env.JWT_SECRET_KEY
  );
  return token;
};
