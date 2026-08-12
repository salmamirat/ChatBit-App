import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import conversationsRoutes from "./routes/conversations.routes.js";
import messagesRoutes from "./routes/messages.routes.js";

const app = express();


app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());


app.get("/", (req, res) => {
  res.json({
    message: "ChatBit API is running 🚀",
  });
});


app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/users",
  usersRoutes
);

app.use(
  "/api/conversations",
  conversationsRoutes
);

app.use(
  "/api/conversations",
  messagesRoutes
);


app.use((req, res) => {
  res.status(404).json({
    message: "Route introuvable",
  });
});


app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "Erreur serveur",
  });
});


export default app;