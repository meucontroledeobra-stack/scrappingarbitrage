import cors from "cors";
import express from "express";

export function createServer() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    cors({
      origin: [
        "https://radardashboard.com.br",
        "https://www.radardashboard.com.br",
      ],
      credentials: false,
    })
  );

  return app;
}
