const {
  Message,
  Conversation,
  User
} = require("../models");

const getMessages = async (
  req,
  res
) => {
  try {
    const conversation =
      await Conversation.findByPk(
        req.params.id
      );

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found"
      });
    }

    if (
      conversation.client_id !== req.user.id &&
      conversation.agent_id !== req.user.id
    ) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    const messages =
      await Message.findAll({
        where: {
          conversation_id:
            req.params.id
        },
        include: [
          {
            model: User,
            as: "sender",
            attributes: [
              "id",
              "full_name",
              "role"
            ]
          }
        ],
        order: [["sent_at", "ASC"]]
      });

    res.json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getMessages
};