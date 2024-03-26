import { sequelizeInstance } from "../services/database.js";
import { DataTypes, literal } from "sequelize";
import logger from "./winstonLogger.js";

const User = sequelizeInstance.define("user", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV1,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  accountCreated: {
    type: DataTypes.STRING,
    defaultValue: literal("CURRENT_TIMESTAMP"),
  },
  accountUpdated: {
    type: DataTypes.STRING,
    defaultValue: literal("CURRENT_TIMESTAMP"),
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export const syncDb = async () => {
  try {
    await User.sync();
    logger.info(" Users table synced");

  } catch (err) {
    logger.error("not able to sync users table");
  }
};

export default User;
