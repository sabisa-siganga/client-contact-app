import { DataTypes, ModelDefined, Optional } from "sequelize";
import dbSetup from "../config/db";
import Client from "./client.model";
import ClientContact from "./client-contact.model";

// Define attributes for the Contact model, which represent each contact's properties
interface ContactAttributes {
  id: number; // Unique identifier for each contact
  surname: string; // Surname of the contact
  name: string; // First name of the contact
  email: string; // Email address, unique to each contact
  createdAt: Date; // Date the contact was created

  clients: [];
}

// Define optional attributes for creating a new contact, allowing id and createdAt to be omitted
type ContactCreationAttributes = Optional<
  ContactAttributes,
  "id" | "createdAt" | "clients"
>;

// Define the Contact model using Sequelize's ModelDefined type
const Contact: ModelDefined<ContactAttributes, ContactCreationAttributes> =
  dbSetup.define(
    "Contact", // Model name
    {
      // Define columns for the contacts table in the database
      id: {
        type: DataTypes.INTEGER, // Data type is INTEGER
        primaryKey: true, // Set as the primary key
        autoIncrement: true, // Automatically increment the id for each new record
      },
      name: {
        type: DataTypes.STRING(50), // Data type is STRING with max length 50
        allowNull: false, // Name is required, cannot be null
      },
      surname: {
        type: DataTypes.STRING(50), // Data type is STRING with max length 50
        allowNull: false, // Surname is required, cannot be null
      },
      email: {
        type: DataTypes.STRING(50), // Data type is STRING with max length 50
        allowNull: false, // Email is required
        unique: true, // Email must be unique in the database
      },
      createdAt: {
        type: DataTypes.DATE, // Data type is DATE
        defaultValue: new Date(), // Default value is the current date
        allowNull: true, // Can be null, although default value is provided
        field: "created_at", // Maps to the column "created_at" in the database
      },
    },
    {
      tableName: "contacts", // Name of the table in the database
      timestamps: false, // Disable Sequelize's automatic timestamps
      indexes: [
        {
          fields: ["clientId"], // Index on clientId to speed up queries involving this field
        },
      ],
    }
  );

// Define a many-to-many relationship between Contact and Client through ClientContact
Contact.belongsToMany(Client, {
  through: ClientContact, // Junction table for the many-to-many relationship
  foreignKey: "contactId", // Foreign key in the junction table referencing Contact
  otherKey: "clientId", // Other key in the junction table referencing Client
  as: "clients", // Alias for accessing associated clients
});

// Define the inverse many-to-many relationship from Client to Contact
Client.belongsToMany(Contact, {
  through: ClientContact, // Junction table for the many-to-many relationship
  foreignKey: "clientId", // Foreign key in the junction table referencing Client
  otherKey: "contactId", // Other key in the junction table referencing Contact
  as: "contacts", // Alias for accessing associated contacts
});

export default Contact;
