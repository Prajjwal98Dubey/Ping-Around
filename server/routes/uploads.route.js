import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getPresignedUrl } from "../controllers/uploads.controller.js";

const uploadRouter = express.Router();

uploadRouter.route("/generate-url").post(authMiddleware, getPresignedUrl);

export default uploadRouter;
