import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../lib/connectDB";
import User from "./user.model";

class OTP extends Model<InferAttributes<OTP>, InferCreationAttributes<OTP>> {
  declare id?: CreationOptional<string>;
  declare email: string;
  declare code: string;
  declare expires_at: Date;
}

OTP.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Users",
        key: "email",
      },
      onDelete: "CASCADE",
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { sequelize, modelName: "OTP", timestamps: true }
);

User.hasOne(OTP, { foreignKey: "email" });
OTP.belongsTo(User, { foreignKey: "email" });

export default OTP;
