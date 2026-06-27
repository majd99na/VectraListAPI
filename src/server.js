import express, { json } from "express";
import { config } from "dotenv";
import cors from "cors";
import todosRouter from "./Routes/Todos.js";
import userRouter from "./Routes/Users.js";
import errorHandler from "./Middleware/ErrorHandler.js";
import { sessionMiddleware } from "./Middleware/Sessions.js";
config();

const server = express();
server.use(json({ limit: "10mb" }));
server.use(cors({ origin: process.env.FRONT_END, credentials: true }));
server.use("/todos", sessionMiddleware, todosRouter);
server.use("/users", sessionMiddleware, userRouter);
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
server.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
server.use(errorHandler);
