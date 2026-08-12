import express from "express";
import { getMe } from "../controllers/users.controller.js";
import { authenticate } from "../middlewares/auth.js";
const router = express.Router();

router.get("/me", authenticate, getMe);

export default router;