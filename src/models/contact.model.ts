import { DataTypes, ModelDefined, Optional } from "sequelize";
import dbSetup from "../config/db";
import Client from "./client.model";

interface ContactAttributes {
  id: number;
  clientId: string;
  name: string;
  email: string;
  createdAt: Date;
}

type ContactCreationAttributes = Optional<
  ContactAttributes,
  "id" | "createdAt"
>;

const Contact: ModelDefined<ContactAttributes, ContactCreationAttributes> =
  dbSetup.define(
    "Contact",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      clientId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Clients",
          key: "id",
        },
        onDelete: "CASCADE",
        field: "client_id",
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
      tableName: "contacts",
      timestamps: false,
      indexes: [
        {
          fields: ["clientId"],
        },
      ],
    }
  );

Client.hasMany(Contact, {
  foreignKey: "clientId",
  as: "contacts",
});

Contact.belongsTo(Client, { foreignKey: "clientId", as: "client" });

export default Contact;
