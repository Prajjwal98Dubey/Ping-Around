import { Router } from "express";
import {
  editUser,
  editUserImage,
  getUserDetails,
  loginUser,
  logoutUser,
  registerUser,
  userAuth,
  validateGoogleAuth,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.route("/auth-google").post(validateGoogleAuth);
authRouter.route("/register").post(registerUser);
authRouter.route("/login").post(loginUser);
authRouter.route("/user-auth").get(authMiddleware, userAuth);
authRouter.route("/edit-user").patch(authMiddleware, editUser);
authRouter.route("/edit-user-image").get(authMiddleware, editUserImage);
authRouter.route("/get-user-details").get(getUserDetails);
authRouter.route("/logout").post(authMiddleware, logoutUser);

export default authRouter;
