import express from "express";
import {
  getAllUsers,
  getStatus,
  logOut,
  register,
  signIn,
} from "../Controllers/UsersController.js";
import { sessionMiddleware } from "../Middleware/Sessions.js";
const router = express.Router();
router.get("/", getAllUsers);
router.post("/signup", register);
router.post("/signin", sessionMiddleware, signIn);
router.get("/status", sessionMiddleware, getStatus);
router.post("/signout", logOut);
export default router;
