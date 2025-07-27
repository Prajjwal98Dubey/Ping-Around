import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getCloseByUsers,
  userLocationDetails,
} from "../controllers/location.controller.js";

const locationRouter = express.Router();

locationRouter.route("/coordinates").post(userLocationDetails);
locationRouter.route("/get-near-user").get(authMiddleware, getCloseByUsers);

export default locationRouter;
