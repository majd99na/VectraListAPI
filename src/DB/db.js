import dotenv from "dotenv";

import { Pool } from "pg";
dotenv.config();
export const pool = new Pool({
  connectionString: process.env.DB_LINK,
  ssl:
    process.env.ENVIRONMENT === "PRODUCTION"
      ? { rejectUnauthorized: false }
      : false,
  max: 5,
});
