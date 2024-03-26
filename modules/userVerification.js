import { sequelizeInstance } from "../services/database.js";
import { DataTypes } from "sequelize";
import logger from "./winstonLogger.js";

const UserVerification = sequelizeInstance.define(
  "userVerification",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    verifyLinkTimestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export const syncUserVerificationDb = async () => {
  try {
    await UserVerification.sync();
    logger.info("UserVerification table synced");
  } catch (err) {
    logger.error("not able to sync the UserVerification table");
  }
};

export default UserVerification;
