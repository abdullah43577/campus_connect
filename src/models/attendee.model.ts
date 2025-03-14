import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../lib/connectDB";
import User from "./user.model";
import Event from "./event.model";

class Attendee extends Model<InferAttributes<Attendee>, InferCreationAttributes<Attendee>> {
  declare id: CreationOptional<string>;
  declare attendee_id: string;
  declare event_id: string;
  declare amount_paid: CreationOptional<number>;
  declare status: "confirmed" | "cancelled" | "pending";
}

Attendee.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    attendee_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    event_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Event,
        key: "id",
      },
    },
    amount_paid: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("confirmed", "cancelled", "pending"),
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["attendee_id", "event_id"],
      },
    ],
  }
);

//* one event has many attendees
Event.hasMany(Attendee, { foreignKey: "event_id", onDelete: "CASCADE" });
Attendee.belongsTo(Event, { foreignKey: "event_id" });

//* one user can attend many events
User.hasMany(Attendee, { foreignKey: "attendee_id" });
Attendee.belongsTo(User, { foreignKey: "attendee_id" });

export default Attendee;
