import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../lib/connectDB";
import Event from "./event.model";

class Package extends Model<InferAttributes<Package>, InferCreationAttributes<Package>> {
  declare package_id: CreationOptional<string>;
  declare event_id: string;
  declare title: string;
  declare description: string;
  declare price: number;
}

Package.init(
  {
    package_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
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
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

Event.hasMany(Package, { foreignKey: "event_id" });
Package.belongsTo(Event, { foreignKey: "event_id" });

export default Package;
