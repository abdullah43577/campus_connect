import "dotenv/config";
import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
const { PORT } = process.env;
import Cache from "node-cache";
import { router } from "./routes/router";
import { authRouter } from "./routes/auth.routes";
import { initializeSocket } from "./helper/socket";
import { connectDB, sequelize } from "./lib/connectDB";
import { eventRouter } from "./routes/event.routes";
import axios from "axios";
const { PAYSTACK_TEST_SECRET_KEY } = process.env;

const app = express();
export const cache = new Cache({ stdTTL: 600, checkperiod: 120 });

app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));
app.use(helmet());

export const api = axios.create({
  baseURL: "https://api.paystack.co",
  timeout: 1000,
  headers: {
    Authorization: `Bearer ${PAYSTACK_TEST_SECRET_KEY}`,
  },
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/event", eventRouter);
app.use("/api/v1", router);

app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested endpoint does not exist!",
    explorableSolutions: {
      solution1: 'ensure the "METHOD" used to call the endpoint is correct!',
      solution2: "ensure the relative paths to the server url is defined correctly",
    },
  });
});

const server = app.listen(PORT, async () => {
  await connectDB();
  await sequelize.sync({ alter: true });
  console.log(`server started on http://localhost:${PORT}`);
});

//* initialize socket instance
initializeSocket(server);
