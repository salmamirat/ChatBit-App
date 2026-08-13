import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",

    logging: false,
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();

    console.log("✅ PostgreSQL + Sequelize connected");

    console.log(
      `📦 Database: ${process.env.DB_NAME}`
    );
  } catch (error) {
    console.error(
      "❌ Sequelize database connection failed:"
    );

    console.error(error.message);

    process.exit(1);
  }
};

export default sequelize;