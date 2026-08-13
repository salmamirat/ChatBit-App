import fs from "fs";
import pool from "./src/config/database.js";

async function initDB() {
  try {
    const sql = fs.readFileSync("./schema.sql", "utf8");
    await pool.query(sql);
    console.log("✅ Database schema initialized successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Schema initialization error:", err);
    process.exit(1);
  }
}

initDB();
