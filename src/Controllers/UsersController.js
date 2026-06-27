import { compare, genSalt, hash } from "bcrypt";
import { pool } from "../DB/db.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users");
    res.status(200).json(users.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStatus = async (req, res, next) => {
  if (!req.session || !req.session.user)
    return res
      .status(403)
      .json({ authorized: false, message: "No Cookie Found" });
  if (new Date(Date.now() + req.session.cookie.originalMaxAge) < Date.now())
    return res.status(401).json({
      authorized: false,
      message: "Cookie Expired, Please login again",
    });
  // if (req.session && req.session.user) {
  try {
    const response = await pool.query(
      `SELECT id,email,username,created_at
  FROM users WHERE id=$1`,
      [req.session.user.id],
    );

    if (response.rowCount == 0) return res.sendStatus(401);
    return res.json({
      authorized: true,
      userInfo: {
        id: response.rows[0].id,
        email: response.rows[0].email,
        username: response.rows[0].username,
        created_at: response.rows[0].created_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const register = async (req, res, next) => {
  if (!req.body) return res.status(400).json("Please provide all fields");
  const { email, username, password } = req.body;
  console.log(req.body);

  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);
  try {
    await pool.query(
      "INSERT INTO users (email,username,password) VALUES ($1,$2,$3)",
      [email, username, hashedPassword],
    );
    res.status(201).json("User registered successfully");
  } catch (error) {
    return next(error);
  }
};

export const signIn = async (req, res, next) => {
  if (!req.body) return res.status(400).json("Please provide all fields");
  const { email, password } = req.body;
  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (!user.rows[0]) return res.status(404).json("User not found");
    const isPasswordValid = await compare(password, user.rows[0].password);
    if (!isPasswordValid) return res.status(401).json("Invalid password");
    req.session.user = {
      id: user.rows[0].id,
      email: user.rows[0].email,
      username: user.rows[0].username,
    };
    req.session.save((err) => {
      if (err) {
        const error = new Error(err.message);
        error.status = 500;
        return next(error);
      }
      return res.status(200).json({
        message: "User signed in successfully",
        user: req.session.user,
      });
    });
  } catch (error) {
    return next(error);
  }
};

export const logOut = async (req, res, next) => {
  if (!req.session.user) return next(new Error("No Cookie Found"));
  req.session.destroy((err) => {
    if (err) return next(err);
    return res.status(200).json("User signed out successfully");
  });
};
