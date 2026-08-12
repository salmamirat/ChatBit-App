import pool from "../config/database.js";
export const getMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const conversationId = Number(req.params.id);

        if (!Number.isInteger(conversationId)) {
            return res.status(400).json({
                message: "Invalid conversation ID",
            });
        }

        const conversationResult = await pool.query(
            `
      SELECT id, client_id, agent_id
      FROM conversations
      WHERE id = $1
      `,
            [conversationId]
        );

        if (conversationResult.rows.length === 0) {
            return res.status(404).json({
                message: "Conversation not found",
            });
        }

        const conversation = conversationResult.rows[0];

        const isClient = conversation.client_id === userId;
        const isAgent = conversation.agent_id === userId;

        if (!isClient && !isAgent) {
            return res.status(403).json({
                message: "You are not allowed to access this conversation",
            });
        }

        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Number(req.query.limit) || 30, 100);
        const offset = (page - 1) * limit;

        const result = await pool.query(
            `
      SELECT
        m.id,
        m.conversation_id,
        m.sender_id,
        m.content,
        m.is_read,
        m.sent_at,
        u.full_name AS sender_name,
        u.role AS sender_role
      FROM messages m
      JOIN users u ON u.id = m.sender_id
      WHERE m.conversation_id = $1
      ORDER BY m.sent_at ASC
      LIMIT $2 OFFSET $3
      `,
            [conversationId, limit, offset]
        );

        return res.status(200).json({
            page,
            limit,
            messages: result.rows,
        });
    } catch (error) {
        console.error("getMessages error:", error);

        return res.status(500).json({
            message: "Server error",
        });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const userId = req.user.id;
        const conversationId = Number(req.params.id);
        const { content } = req.body;

        if (!Number.isInteger(conversationId)) {
            return res.status(400).json({
                message: "Invalid conversation ID",
            });
        }

        if (!content || !content.trim()) {
            return res.status(400).json({
                message: "Message content is required",
            });
        }

        const conversationResult = await pool.query(
            `
      SELECT
        id,
        status,
        client_id,
        agent_id
      FROM conversations
      WHERE id = $1
      `,
            [conversationId]
        );

        if (conversationResult.rows.length === 0) {
            return res.status(404).json({
                message: "Conversation not found",
            });
        }

        const conversation = conversationResult.rows[0];

        if (conversation.status === "fermee") {
            return res.status(400).json({
                message: "Conversation is closed",
            });
        }
        const isClient = conversation.client_id === userId;
        const isAgent = conversation.agent_id === userId;

        if (!isClient && !isAgent) {
            return res.status(403).json({
                message: "You are not allowed to send messages here",
            });
        }

        const result = await pool.query(
            `
      INSERT INTO messages
        (conversation_id, sender_id, content)
      VALUES
        ($1, $2, $3)
      RETURNING
        id,
        conversation_id,
        sender_id,
        content,
        is_read,
        sent_at
      `,
            [conversationId, userId, content.trim()]
        );

        return res.status(201).json({
            message: "Message sent successfully",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("sendMessage error:", error);

        return res.status(500).json({
            message: "Server error",
        });
    }
};