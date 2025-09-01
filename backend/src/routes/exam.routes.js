import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  startExam,
  updateAnswer,
  submitExam,
  getResult,
} from "../controllers/exam.controller.js";

const router = Router();

router.post("/start", protect, startExam);
router.patch("/:sessionId/answer", protect, updateAnswer);
router.post("/:sessionId/submit", protect, submitExam);
router.get("/:sessionId/result", protect, getResult);

export default router;
