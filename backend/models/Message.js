const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    conversation_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    sent_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: "messages",
    timestamps: false
  }
);

module.exports = Message;