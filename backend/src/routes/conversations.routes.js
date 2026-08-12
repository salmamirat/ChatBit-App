import express from "express";

import {
  getConversations,
  createConversation,
  closeConversation,
} from "../controllers/conversations.controller.js";

import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", authenticate, getConversations);

router.post("/", authenticate, createConversation);

router.patch(
  "/:id/close",
  authenticate,
  closeConversation
);

export default router;