import { sequelizeInstance } from "../services/database.js";
import { DataTypes } from "sequelize";

const UserVerification = sequelizeInstance.define("userVerification", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV1,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true },
  },
  verifyLinkTimestamp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export const syncUserVerificationDb = async () => {
  try {
    await UserVerification.sync();
  } catch (err) {
    console.log("not able to sync the UserVerification table", err);
  }
};

export default UserVerification;
