import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.on("connect", () => {
  console.log("✅ PostgreSQL connected");
});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL error:", err);
});
pool.query("SELECT NOW()")
  .then((result) => {
    console.log("✅ Database connected!");
    console.log("🕐 Database time:", result.rows[0].now);
  })
  .catch((error) => {
    console.error("❌ Database connection failed:");
    console.error(error.message);
  });
export default pool;