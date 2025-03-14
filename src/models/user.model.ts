import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../lib/connectDB";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<string>;
  declare first_name: string;
  declare last_name: string;
  declare email: string;
  declare password: string | null;
  declare phone_no: string;
  declare user_type: "attendee" | "event_organizer" | "admin";
  declare is_verified: CreationOptional<boolean>;
  declare profile_picture: CreationOptional<string>;
  declare country: CreationOptional<string>;
  declare state: CreationOptional<string>;
  declare city: CreationOptional<string>;
  declare institution: CreationOptional<string>;
  declare department: CreationOptional<string>;
  declare faculty: CreationOptional<string>;
  declare failedLoginAttempts: CreationOptional<number>;
  declare is_locked: CreationOptional<boolean>;
  declare google_id: CreationOptional<string | null>;
  declare last_login: CreationOptional<Date | null>;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    phone_no: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    user_type: {
      type: DataTypes.ENUM("attendee", "event_organizer", "admin"),
      allowNull: false,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    profile_picture: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    country: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    state: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    city: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    institution: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    department: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    faculty: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    failedLoginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_locked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    google_id: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  { sequelize, timestamps: true }
);

export default User;
