import pool from "../config/database.js";

export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    let result;

    if (userRole === "agent") {
      result = await pool.query(`SELECT * FROM conversations ORDER BY created_at DESC`);
    } else {
      result = await pool.query(`SELECT * FROM conversations WHERE client_id = $1 ORDER BY created_at DESC`, [userId]);
    }
    
    return res.status(200).json({ conversations: result.rows });
  } catch (error) {
    console.error("GET CONVERSATIONS ERROR:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

export const createConversation = async (req, res) => {
  try {
    const { subject } = req.body;
    const userId = req.user.id;

    if (!subject) {
      return res.status(400).json({ message: "Sujet obligatoire" });
    }

    const result = await pool.query(
      `INSERT INTO conversations (subject, client_id) VALUES ($1, $2) RETURNING *`,
      [subject, userId]
    );

    return res.status(201).json({
      message: "Conversation créée",
      conversation: result.rows[0],
    });
  } catch (error) {
    console.error("CREATE CONVERSATION ERROR:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

export const closeConversation = async (req, res) => {
  try {
    const conversationId = req.params.id;
    const userId = req.user.id;

    if (req.user.role !== "agent") {
      return res.status(403).json({
        message: "Seul un agent peut fermer une conversation",
      });
    }

    const conversationResult = await pool.query(
      `
      SELECT *
      FROM conversations
      WHERE id = $1
      `,
      [conversationId]
    );

    if (conversationResult.rows.length === 0) {
      return res.status(404).json({
        message: "Conversation introuvable",
      });
    }

    const conversation = conversationResult.rows[0];

    if (conversation.agent_id !== userId) {
      return res.status(403).json({
        message: "Vous n'êtes pas l'agent de cette conversation",
      });
    }

    if (conversation.status === "fermee") {
      return res.status(400).json({
        message: "Conversation déjà fermée",
      });
    }

    const result = await pool.query(
      `
      UPDATE conversations
      SET
        status = 'fermee',
        closed_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
      `,
      [conversationId]
    );

    return res.status(200).json({
      message: "Conversation fermée",
      conversation: result.rows[0],
    });
  } catch (error) {
    console.error("CLOSE CONVERSATION ERROR:", error);

    return res.status(500).json({
      message: "Erreur serveur",
    });
  }
};