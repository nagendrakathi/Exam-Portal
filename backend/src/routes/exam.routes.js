import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  startExam,
  updateAnswer,
  submitExam,
  getSessions,
  getSession,
} from "../controllers/exam.controller.js";

const router = Router();

router.post("/start", protect, startExam);
router.get("/my-sessions", protect, getSessions);
router.get("/:sessionId", protect, getSession);
router.patch("/:sessionId/answer", protect, updateAnswer);
router.post("/:sessionId/submit", protect, submitExam);

export default router;
