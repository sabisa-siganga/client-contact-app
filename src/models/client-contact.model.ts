import { DataTypes, ModelDefined } from "sequelize";
import dbSetup from "../config/db";

// Define the attributes for the ClientContact model, representing each client-contact association
interface ClientContactAttributes {
  clientId: number; // Foreign key referencing the client
  contactId: number; // Foreign key referencing the contact
}

// Define the ClientContact model as a junction table for the many-to-many relationship
// between Client and Contact models
const ClientContact: ModelDefined<
  ClientContactAttributes,
  ClientContactAttributes
> = dbSetup.define(
  "ClientContact", // Model name for Sequelize
  {
    clientId: {
      type: DataTypes.INTEGER, // Data type for clientId is INTEGER
      references: {
        model: "Clients", // References the Clients table
        key: "id", // References the id column in the Clients table
      },
      field: "client_id", // Maps to the client_id column in the database
      onDelete: "CASCADE", // Cascade deletion to remove associations if a client is deleted
      onUpdate: "CASCADE", // Cascade updates to keep associations in sync if clientId changes
    },
    contactId: {
      type: DataTypes.INTEGER, // Data type for contactId is INTEGER
      references: {
        model: "Contacts", // References the Contacts table
        key: "id", // References the id column in the Contacts table
      },
      field: "contact_id", // Maps to the contact_id column in the database
      onDelete: "CASCADE", // Cascade deletion to remove associations if a contact is deleted
      onUpdate: "CASCADE", // Cascade updates to keep associations in sync if contactId changes
    },
  },
  {
    tableName: "client_contacts", // Define the name of the table in the database
    timestamps: false, // Disable automatic timestamp fields (createdAt, updatedAt)
  }
);

export default ClientContact;
