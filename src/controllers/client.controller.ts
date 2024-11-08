import { Request, Response } from "express";
import Client from "../models/client.model";
import { generateClientCode } from "../utils/client-code-generator";
import Contact from "../models/contact.model";
import { Op } from "sequelize";
import ClientContact from "../models/client-contact.model";

// Controller function to render a page displaying the list of all clients
export const clientListPage = async (req: Request, res: Response) => {
  try {
    // Fetch all clients from the database, ordered alphabetically by the client's name
    const clients = await Client.findAll({
      order: [["name", "ASC"]],
    });
    console.log(clients); // Log the clients list for debugging

    // Render the client list view, passing the fetched clients to the template
    res.render("client-list", {
      clients,
    });
  } catch (error) {
    console.error(error); // Log any errors that occur

    // Send a 500 error response if an error occurs while fetching clients
    res.status(500).send("Error fetching clients");
  }
};

/**
 * Controller function to render a form page for adding or viewing a client.
 * - If a `clientId` parameter is present, it loads the client's information.
 * - If no `clientId` is provided,  create a new client.
 */
export const clientFormPage = async (req: Request, res: Response) => {
  try {
    const { clientId } = req.params; // Get clientId from request parameters
    let clientDetails = { name: "", clientCode: "" }; // Default client details for a new client
    const { show } = req.query;

    const showTab = show === "contacts" ? "contacts" : "general";

    // If no clientId is provided, create new client
    if (!clientId) {
      res.render("client-form", {
        clientDetails,
        contacts: [],
        availableContacts: [],
        clientId,
        showTab,
      });
      return;
    }

    // Find the client by primary key (clientId), including linked contacts
    const client = await Client.findByPk(clientId, {
      include: [
        {
          model: Contact,
          as: "contacts", // Alias for related contacts
          through: { attributes: [] }, // Exclude junction table attributes
        },
      ],
    });

    // If client not found, render the form with empty client details and no contacts
    if (!client) {
      res.render("client-form", {
        clientDetails,
        contacts: [],
        availableContacts: [],
        clientId,
        showTab,
      });
      return;
    }

    // Get linked contacts for the client to show existing contacts
    const linkedContacts: { id: number }[] = client.getDataValue("contacts");

    // Fetch available contacts that are not already linked to the client
    const availableContacts = await Contact.findAll({
      where: {
        id: { [Op.notIn]: linkedContacts.map((contact) => contact.id) },
      },
    });

    // Render the client form view with the client's details and contacts information
    res.render("client-form", {
      clientDetails: {
        name: client.getDataValue("name"),
        clientCode: client.getDataValue("clientCode"),
      },
      contacts: linkedContacts,
      availableContacts,
      clientId,
      showTab,
    });
  } catch (error) {
    console.error(error); // Log any errors that occur

    // Send a 500 error response if an error occurs while rendering the client form
    res.status(500).send("Error adding client");
  }
};

/**
 * Controller function to handle creating a new client
 * - Validates the request data to ensure a client name is provided
 * - Generates a unique client code using the `generateClientCode` utility
 * - Saves the new client to the database and responds with a success message
 */
export const addClient = async (req: Request, res: Response) => {
  try {
    const data = req.body as {
      name: string;
    };

    // Check if the client name is provided; if not, respond with a 400 error
    if (!data.name) {
      res.status(400).json({
        success: false,
        message: "Please provide client [name].",
      });
      return;
    }

    // Generate a unique client code based on the provided name
    const clientCode = await generateClientCode(data.name);

    // Create and save the new client in the database
    const client = await Client.create({
      name: data.name,
      clientCode,
    });

    // Respond with success, including client details and a creation timestamp
    res.status(201).json({
      success: true,
      clientId: client.getDataValue("id"),
      message: "Client created successfully!",
    });
  } catch (error) {
    console.error(error); // Log any errors that occur

    // Send a 500 error response if an error occurs while adding a new client
    res.status(500).json({
      success: false,
      message: "Error adding client",
    });
  }
};

export const linkContacts = async (req: Request, res: Response) => {
  try {
    const { clientId } = req.params;
    const { contactIds } = req.body; // Array of contact IDs

    if (!contactIds || !contactIds.length) {
      res.status(400).json({ message: "No contacts selected" });
      return;
    }

    if (!clientId) {
      res.status(400).json({ message: "Client ID is required" });
      return;
    }

    // Link each selected contact to the client
    const links = contactIds.map((contactId: number) => ({
      clientId: clientId,
      contactId: contactId,
    }));

    // Use bulkCreate to add multiple records in ClientContacts
    await ClientContact.bulkCreate(links, { ignoreDuplicates: true });

    res.status(201).json({ message: "Contacts linked successfully" });
  } catch (error) {
    console.error("Error linking contacts:", error);
    res.status(500).json({ message: "Error linking contacts" });
  }
};

export const unlinkContact = async (req: Request, res: Response) => {
  try {
    const { clientId, contactId } = req.params as {
      contactId: string;
      clientId: string;
    };

    await ClientContact.destroy({
      where: {
        clientId,
        contactId,
      },
    });

    res.redirect(`/client-form/${clientId}#link-contact`);
  } catch (error) {
    console.error(error);

    res.send("Error while unlinking a contact");
  }
};
