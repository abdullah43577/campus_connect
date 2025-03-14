import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../lib/connectDB";
import User from "./user.model";

class Event extends Model<InferAttributes<Event>, InferCreationAttributes<Event>> {
  declare id: CreationOptional<string>;
  declare organizer_id: string;
  declare title: string;
  declare description: string;
  declare date: Date;
  declare location: string;
  declare target_amount: number;
  declare contributed_so_far: number;
  declare bank_name: string;
  declare bank_code: string;
  declare account_no: string;
  declare account_name: string;
  declare recipient_code: string;
  declare status: "upcoming" | "ongoing" | "completed" | "cancelled";
}

Event.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    organizer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    target_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    contributed_so_far: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bank_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bank_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recipient_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("upcoming", "ongoing", "completed", "cancelled"),
      defaultValue: "upcoming",
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

User.hasMany(Event, { foreignKey: "organizer_id" });
Event.belongsTo(User, { foreignKey: "organizer_id" });

export default Event;
