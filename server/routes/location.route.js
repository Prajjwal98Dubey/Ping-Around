import express from "express";
import {
  getCloseByUsers,
  userLocationDetails,
} from "../controllers/location.controller.js";

const locationRouter = express.Router();

locationRouter.route("/coordinates").post(userLocationDetails);
locationRouter.route("/get-near-user").get(getCloseByUsers);

export default locationRouter;
