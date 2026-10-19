import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { parseResume, summarizeResume, atsCheck, getPersonalizedGuidance } from "../controllers/resume.controller.js";

const resumeRouter = express.Router();

resumeRouter.post("/parse", isAuth, parseResume);
resumeRouter.post("/summarize", isAuth, summarizeResume);
resumeRouter.post("/ats-check", isAuth, atsCheck);
resumeRouter.post("/guidance", isAuth, getPersonalizedGuidance);

export default resumeRouter;
