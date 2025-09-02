import { Router } from "express";
import { register, login, logout, getUser } from "../controllers/auth.controller.js";
import {protect} from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/user", protect, getUser);

export default router;
