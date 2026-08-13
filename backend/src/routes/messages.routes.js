import express from "express";

import {
  getMessages,
  sendMessage,
} from "../controllers/messages.controller.js";

import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.get(
  "/:id/messages",
  authenticate,
  getMessages
);

router.post(
  "/:id/messages",
  authenticate,
  sendMessage
);

export default router;