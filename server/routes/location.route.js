import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  changeUserLocationStatus,
  getCloseByUsers,
  userLocationDetails,
} from "../controllers/location.controller.js";

const locationRouter = express.Router();

locationRouter.route("/coordinates").post(userLocationDetails);
locationRouter.route("/get-near-user").get(authMiddleware, getCloseByUsers);
locationRouter.route("/turnoff").post(changeUserLocationStatus);
export default locationRouter;
