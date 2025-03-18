import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../lib/connectDB";
import User from "./user.model";
import Event from "./event.model";

class Payment extends Model<InferAttributes<Payment>, InferCreationAttributes<Payment>> {
  declare id: CreationOptional<string>;
  declare user_id: string;
  declare event_id: string;
  declare amount: number;
  declare reference: string;
  declare status: "pending" | "completed";
}

Payment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    event_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Event,
        key: "event_id",
      },
      onDelete: "CASCADE",
    },
    amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed"),
      defaultValue: "pending",
    },
  },
  { sequelize, timestamps: true }
);

Event.hasMany(Payment, { foreignKey: "event_id" });
Payment.belongsTo(Event, { foreignKey: "event_id" });

User.hasMany(Payment, { foreignKey: "user_id" });
Payment.belongsTo(User, { foreignKey: "user_id" });

export default Payment;
