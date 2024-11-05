import { DataTypes, ModelDefined, Optional } from "sequelize";
import dbSetup from "../config/db";

interface ClientAttributes {
  id: number;
  name: string;
  clientCode: string;
  email: string;
  createdAt: Date;
}

type ClientCreationAttributes = Optional<ClientAttributes, "id" | "createdAt">;

const Client: ModelDefined<ClientAttributes, ClientCreationAttributes> =
  dbSetup.define(
    "Client",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      clientCode: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "client_code",
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
        allowNull: true,
        field: "created_at",
      },
    },
    {
      tableName: "clients",
      timestamps: false,
    }
  );

export default Client;
