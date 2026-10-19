import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  evaluateMcq,
  evaluateWritten,
  evaluateSoftskill,
  evaluateProject,
  getTestScore,
  getFinalReport,
  getOverallScore
} from "../controllers/evaluate.controller.js";

const evaluateRouter = express.Router();

evaluateRouter.post("/mcq", isAuth, evaluateMcq);
evaluateRouter.post("/written", isAuth, evaluateWritten);
evaluateRouter.post("/softskill", isAuth, evaluateSoftskill);
evaluateRouter.post("/project", isAuth, evaluateProject);
evaluateRouter.post("/test-score", isAuth, getTestScore);
evaluateRouter.post("/final-report", isAuth, getFinalReport);
evaluateRouter.post("/overall-score", isAuth, getOverallScore);

export default evaluateRouter;
