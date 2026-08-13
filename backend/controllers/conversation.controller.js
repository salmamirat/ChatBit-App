const {
  Conversation,
  User
} = require("../models");

const getConversations = async (
  req,
  res
) => {
  try {
    let where = {};

    if (req.user.role === "client") {
      where.client_id = req.user.id;
    }

    if (req.user.role === "agent") {
      where.status = [
        "en_attente",
        "en_cours"
      ];
    }

    const conversations =
      await Conversation.findAll({
        where,
        include: [
          {
            model: User,
            as: "client",
            attributes: [
              "id",
              "full_name",
              "email"
            ]
          },
          {
            model: User,
            as: "agent",
            attributes: [
              "id",
              "full_name",
              "email"
            ]
          }
        ],
        order: [["created_at", "DESC"]]
      });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const createConversation = async (
  req,
  res
) => {
  try {
    if (req.user.role !== "client") {
      return res.status(403).json({
        message:
          "Only clients can create conversations"
      });
    }

    const {
      subject
    } = req.body;

    const conversation =
      await Conversation.create({
        subject,
        client_id: req.user.id,
        status: "en_attente"
      });
res.status(201).json(
      conversation
    );
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const closeConversation = async (
  req,
  res
) => {
  try {
    if (req.user.role !== "agent") {
      return res.status(403).json({
        message: "Only agents can close conversations"
      });
    }

    const conversation =
      await Conversation.findByPk(
        req.params.id
      );

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found"
      });
    }

    conversation.status = "fermee";
    conversation.closed_at = new Date();

    await conversation.save();

    res.json({
      message: "Conversation closed",
      conversation
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getConversations,
  createConversation,
  closeConversation
};
