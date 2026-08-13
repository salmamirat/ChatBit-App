const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const app = require("./app");
const sequelize = require("./config/database");

require("./models");

const setupSocket = require("./socket/socket");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

setupSocket(io);

const PORT = process.env.PORT || 3000;

sequelize
  .sync()
  .then(() => {
    console.log("Database connected");

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Database error:", error.message);
  });