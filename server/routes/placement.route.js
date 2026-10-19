import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  startPlacementTest,
  savePlacementTest,
  getMyPlacementTests,
  getPlacementTestReport
} from "../controllers/placement.controller.js";

const placementRouter = express.Router();

placementRouter.post("/start", isAuth, startPlacementTest);
placementRouter.post("/save", isAuth, savePlacementTest);
placementRouter.get("/my-tests", isAuth, getMyPlacementTests);
placementRouter.get("/report/:id", isAuth, getPlacementTestReport);

export default placementRouter;
