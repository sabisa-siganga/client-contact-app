import { DataTypes, ModelDefined, Optional } from "sequelize";
import dbSetup from "../config/db";
import Contact from "./contact.model";

// Define the attributes for the Client model, representing each client's properties
interface ClientAttributes {
  id: number; // Unique identifier for each client
  name: string; // Name of the client
  clientCode: string; // Unique code for the client
  createdAt: Date; // Date the client was created

  contacts: []; // Array to store associated contacts for the client
}

// Define optional attributes for creating a new client; id, createdAt, and contacts can be omitted
type ClientCreationAttributes = Optional<
  ClientAttributes,
  "id" | "createdAt" | "contacts"
>;

// Define the Client model using Sequelize's ModelDefined type
const Client: ModelDefined<ClientAttributes, ClientCreationAttributes> =
  dbSetup.define(
    "Client", // Model name for Sequelize
    {
      // Define columns for the clients table in the database
      id: {
        type: DataTypes.INTEGER, // Data type is INTEGER
        primaryKey: true, // Set as the primary key
        autoIncrement: true, // Automatically increment the id for each new record
      },
      clientCode: {
        type: DataTypes.STRING(100), // Data type is STRING with max length 100
        allowNull: false, // Client code is required
        field: "client_code", // Maps to the "client_code" column in the database
      },
      name: {
        type: DataTypes.STRING(50), // Data type is STRING with max length 50
        allowNull: false, // Name is required
      },
      createdAt: {
        type: DataTypes.DATE, // Data type is DATE
        defaultValue: new Date(), // Default value is the current date
        allowNull: true, // Can be null, although default value is provided
        field: "created_at", // Maps to "created_at" column in the database
      },
    },
    {
      tableName: "clients", // Name of the table in the database
      timestamps: false, // Disable Sequelize's automatic timestamps
    }
  );

export default Client;
