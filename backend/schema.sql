CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,

    role VARCHAR(20) NOT NULL DEFAULT 'client'
        CHECK (role IN ('client', 'agent')),

    is_online BOOLEAN NOT NULL DEFAULT false,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,

    subject VARCHAR(255) NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'en_attente'
        CHECK (status IN ('en_attente', 'en_cours', 'fermee')),

    client_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    agent_id INTEGER
        REFERENCES users(id)
        ON DELETE SET NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    closed_at TIMESTAMP NULL
);


CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,

    conversation_id INTEGER NOT NULL
        REFERENCES conversations(id)
        ON DELETE CASCADE,

    sender_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    content TEXT NOT NULL,

    is_read BOOLEAN NOT NULL DEFAULT false,

    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX IF NOT EXISTS idx_conversations_client
ON conversations(client_id);

CREATE INDEX IF NOT EXISTS idx_conversations_agent
ON conversations(agent_id);

CREATE INDEX IF NOT EXISTS idx_conversations_status
ON conversations(status);

CREATE INDEX IF NOT EXISTS idx_messages_conversation
ON messages(conversation_id);

CREATE INDEX IF NOT EXISTS idx_messages_sent_at
ON messages(sent_at);