import express from "express";
import {
  addTodo,
  deleteTodo,
  editTodo,
  getTodos,
} from "../Controllers/TodosController.js";

const router = express.Router();

router.get("/", getTodos);
router.post("/", addTodo);
router.put("/:id", editTodo);
router.delete("/:id", deleteTodo);
export default router;
