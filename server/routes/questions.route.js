import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  generateQuestionsMaster,
  generateTechnical,
  generateWritten,
  generateAptitude,
  generateSoftskills,
  generateProject
} from "../controllers/questions.controller.js";

const questionsRouter = express.Router();

questionsRouter.post("/generate", isAuth, generateQuestionsMaster);
questionsRouter.post("/technical", isAuth, generateTechnical);
questionsRouter.post("/written", isAuth, generateWritten);
questionsRouter.post("/aptitude", isAuth, generateAptitude);
questionsRouter.post("/softskills", isAuth, generateSoftskills);
questionsRouter.post("/project", isAuth, generateProject);

export default questionsRouter;
