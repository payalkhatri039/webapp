import { config } from "dotenv";
config();
import { Sequelize } from "sequelize";

export const sequelizeInstance = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    logging: false,
  }
);

export const connection = async () => {
  try {
    logger.debug("Checking database connection");
    await sequelizeInstance.authenticate();
    return true;
  } catch (error) {
    logger.error('Database connection failed');
    return false;
  }
};
