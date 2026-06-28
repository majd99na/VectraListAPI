import express from "express";
import {
  getAllUsers,
  getStatus,
  logOut,
  register,
  signIn,
} from "../Controllers/UsersController.js";
const router = express.Router();
router.get("/", getAllUsers);
router.post("/signup", register);
router.post("/signin", signIn);
router.get("/status", getStatus);
router.post("/signout", logOut);
export default router;
