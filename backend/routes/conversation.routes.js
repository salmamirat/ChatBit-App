const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../middleware/auth.middleware");

const {
  getConversations,
  createConversation,
  closeConversation
} = require("../controllers/conversation.controller");

router.get(
  "/",
  authMiddleware,
  getConversations
);

router.post(
  "/",
  authMiddleware,
  createConversation
);

router.patch(
  "/:id/close",
  authMiddleware,
  closeConversation
);

module.exports = router;