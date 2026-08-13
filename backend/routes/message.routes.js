const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../middleware/auth.middleware");

const {
  getMessages
} = require("../controllers/message.controller");

router.get(
  "/conversations/:id/messages",
  authMiddleware,
  getMessages
);

module.exports = router;