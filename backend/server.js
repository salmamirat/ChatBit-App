import "dotenv/config";
import http from "http";

import app from "./src/app.js";
import { initSocket } from "./src/config/socket.js";

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);


initSocket(httpServer);


httpServer.listen(PORT, () => {
  console.log(
    `🚀 ChatBit server running on port ${PORT}`
  );

  console.log(
    `🌐 http://localhost:${PORT}`
  );
});