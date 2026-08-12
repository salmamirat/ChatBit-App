import pool from "../config/database.js";

export const registerSocketHandlers = (io, socket) => {

    socket.on("conversation:join", async ({ conversationId }) => {
        try {
            const id = Number(conversationId);

            if (!Number.isInteger(id)) {
                return socket.emit("error", {
                    message: "Invalid conversation ID",
                });
            }

            const result = await pool.query(
                `
        SELECT
          id,
          status,
          client_id,
          agent_id
        FROM conversations
        WHERE id = $1
        `,
                [id]
            );

            if (result.rows.length === 0) {
                return socket.emit("error", {
                    message: "Conversation not found",
                });
            }

            const conversation = result.rows[0];

            const isClient =
                conversation.client_id === socket.user.id;

            let isAgent =
                conversation.agent_id === socket.user.id;

            if (socket.user.role === "agent" && !conversation.agent_id) {
                await pool.query(
                    "UPDATE conversations SET agent_id = $1, status = 'en_cours' WHERE id = $2",
                    [socket.user.id, id]
                );
                isAgent = true;
                conversation.status = 'en_cours';
            }

            if (!isClient && !isAgent) {
                if (socket.user.role === "agent") {
                }
                return socket.emit("error", {
                    message: "You are not allowed to join this conversation",
                });
            }

            const room = `conversation:${id}`;

            socket.join(room);

            console.log(
                `User ${socket.user.id} joined ${room}`
            );

            socket.emit("conversation:updated", {
                conversationId: id,
                status: conversation.status,
                joined: true,
            });
        } catch (error) {
            console.error("conversation:join error:", error);

            socket.emit("error", {
                message: "Unable to join conversation",
            });
        }
    });

    socket.on("conversation:leave", ({ conversationId }) => {
        const id = Number(conversationId);

        if (!Number.isInteger(id)) {
            return;
        }

        const room = `conversation:${id}`;

        socket.leave(room);

        console.log(
            `User ${socket.user.id} left ${room}`
        );
    });

    socket.on(
        "message:send",
        async ({ conversationId, content }) => {
            try {
                const id = Number(conversationId);

                if (!Number.isInteger(id)) {
                    return socket.emit("error", {
                        message: "Invalid conversation ID",
                    });
                }

                if (!content || !content.trim()) {
                    return socket.emit("error", {
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
                    [id]
                );

                if (conversationResult.rows.length === 0) {
                    return socket.emit("error", {
                        message: "Conversation not found",
                    });
                }

                const conversation = conversationResult.rows[0];

                if (conversation.status === "fermee") {
                    return socket.emit("error", {
                        message: "Conversation is closed",
                    });
                }

                const isClient =
                    conversation.client_id === socket.user.id;

                const isAgent =
                    conversation.agent_id === socket.user.id;

                if (!isClient && !isAgent) {
                    return socket.emit("error", {
                        message: "You are not allowed to send messages",
                    });
                }

                const messageResult = await pool.query(
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
                    [
                        id,
                        socket.user.id,
                        content.trim(),
                    ]
                );

                const message = messageResult.rows[0];
                const room = `conversation:${id}`;

                io.to(room).emit("message:new", {
                    ...message,
                    sender_role: socket.user.role,
                });
            } catch (error) {
                console.error("message:send error:", error);

                socket.emit("error", {
                    message: "Unable to send message",
                });
            }
        }
    );
    socket.on(
        "typing:start",
        async ({ conversationId }) => {
            try {
                const id = Number(conversationId);

                if (!Number.isInteger(id)) {
                    return;
                }

                const allowed = await checkConversationAccess(
                    id,
                    socket.user.id
                );

                if (!allowed) {
                    return socket.emit("error", {
                        message: "Not allowed",
                    });
                }

                socket
                    .to(`conversation:${id}`)
                    .emit("typing:update", {
                        userId: socket.user.id,
                        isTyping: true,
                    });
            } catch (error) {
                console.error("typing:start error:", error);
            }
        }
    );

    socket.on(
        "typing:stop",
        async ({ conversationId }) => {
            try {
                const id = Number(conversationId);

                if (!Number.isInteger(id)) {
                    return;
                }

                const allowed = await checkConversationAccess(
                    id,
                    socket.user.id
                );

                if (!allowed) {
                    return;
                }

                socket
                    .to(`conversation:${id}`)
                    .emit("typing:update", {
                        userId: socket.user.id,
                        isTyping: false,
                    });
            } catch (error) {
                console.error("typing:stop error:", error);
            }
        }
    );

    socket.on("disconnect", async () => {
        try {
            console.log(
                `Socket disconnected: ${socket.id}`
            );

            await pool.query(
                `
        UPDATE users
        SET is_online = false
        WHERE id = $1
        `,
                [socket.user.id]
            );

            io.emit("presence:update", {
                userId: socket.user.id,
                isOnline: false,
            });
        } catch (error) {
            console.error("disconnect error:", error);
        }
    });
};

const checkConversationAccess = async (
    conversationId,
    userId
) => {
    const result = await pool.query(
        `
    SELECT id
    FROM conversations
    WHERE id = $1
      AND (
        client_id = $2
        OR agent_id = $2
      )
    `,
        [conversationId, userId]
    );

    return result.rows.length > 0;
};