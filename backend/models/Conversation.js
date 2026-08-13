const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Conversation = sequelize.define(
  "Conversation",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM(
        "en_attente",
        "en_cours",
        "fermee"
      ),
      defaultValue: "en_attente"
    },

    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    agent_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },

    closed_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: "conversations",
    timestamps: false
  }
);

module.exports = Conversation;