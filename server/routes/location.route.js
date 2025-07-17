import express from "express";
import { userLocationDetails } from "../controllers/location.controller.js";

const locationRouter = express.Router();

locationRouter.route("/coordinates").post(userLocationDetails);

export default locationRouter;
