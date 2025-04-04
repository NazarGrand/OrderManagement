import "reflect-metadata";
import express, { NextFunction } from "express";
import { AppDataSource } from "./db/data-source";
import router from "./routes/index";
import cors from "cors";

import { constants } from "./env-constants";
import rateLimit from "express-rate-limit";

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((error: unknown) => {
    console.error("Error during Data Source initialization:", error);
  });

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many requests from this IP, please try again after 1 minutes",
  statusCode: 429,
});

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: constants.CLIENT_URL,
  })
);

app.use(limiter);

app.use(router);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Express + TypeScript + TypeORM server" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
