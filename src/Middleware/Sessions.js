import connectPgSimple from "connect-pg-simple";
import session from "express-session";
import { pool } from "../DB/db.js";
const PgSession = connectPgSimple(session);
export const sessionMiddleware = session({
  // proxy: true,
  name: "TodosAppSession",
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  rolling: false,
  cookie: {
    maxAge: 60000 * 60 * 24 * 7,
    secure: true,
    sameSite: "none",
    httpOnly: true,
  },
  store: new PgSession({ pool, tableName: "sessions" }),
});
