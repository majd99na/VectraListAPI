import { pool } from "../DB/db.js";

export const getTodos = async (req, res, next) => {
  if (!req.session.user) return next(new Error("Please sign in first"));
  try {
    const todos = await pool.query("SELECT * FROM todos WHERE user_id=$1", [
      req.session.user.id,
    ]);

    res.status(200).json(todos.rows);
  } catch (error) {
    return next(error);
  }
};

export const addTodo = async (req, res, next) => {
  if (!req.session.user) return next(new Error("Please sign in first"));
  if (!req.body) return next(new Error("No todo data"));
  let { id, todo, due_at, priority, status, category } = req.body;
  if (!status) status = "Pending";
  if (!category) category = "Personal";

  try {
    console.log(req.session.user.id);

    await pool.query(
      "INSERT INTO todos (id,todo,due_at,priority,status,category,user_id) VALUES ($1,$2,$3,$4,$5,$6,$7)",
      [id, todo, due_at, priority, status, category, req.session.user.id],
    );
    res.status(201).json("Todo added successfully");
  } catch (error) {
    return next(error);
  }
};

export const editTodo = async (req, res, next) => {
  if (!req.session.user) return next(new Error("Please sign in first"));
  if (!req.body) return next(new Error("No todo data"));
  const { id } = req.params;
  const allowedKeys = new Set([
    "todo",
    "due_at",
    "status",
    "category",
    "priority",
  ]);
  const updatedKeys = Object.keys(req.body);
  const validKeys = updatedKeys.filter((key) => allowedKeys.has(key));
  if (validKeys.length === 0) return next(new Error("No valid keys"));
  const updateQuery = validKeys
    .map((key) => `${key}=$${validKeys.indexOf(key) + 1}`)
    .join(",");
  const values = validKeys.map((key) => req.body[key]);
  try {
    await pool.query(
      `UPDATE todos set ${updateQuery} WHERE id=$${values.length + 1}`,
      [...values, id],
    );
    res.status(200).json("Todo updated successfully");
  } catch (error) {
    return next(error);
  }
};

export const deleteTodo = async (req, res, next) => {
  if (!req.session.user) return next(new Error("Please sign in first"));
  if (!req.params)
    return next(new Error("Please provide the todo's ID to be deleted"));
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM todos WHERE id=$1", [id]);
    res.status(200).json("Todo deleted successfully");
  } catch (error) {
    return next(error);
  }
};
