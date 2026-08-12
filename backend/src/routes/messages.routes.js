import express from "express";

import {
  getMessages,
  sendMessage,
} from "../controllers/messages.controller.js";

import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.get(
  "/conversations/:id/messages",
  authenticate,
  getMessages
);

router.post(
  "/conversations/:id/messages",
  authenticate,
  sendMessage
);

export default router;