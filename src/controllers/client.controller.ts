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
      include: [
        {
          model: Contact, // Include associated contacts for each client
          as: "contacts", // Alias for accessing associated contacts
          through: { attributes: [] }, // Exclude junction table attributes
        },
      ],
    });

    // Create a simplified list of clients with relevant details and the count of linked contacts
    const clientList = clients.map((client) => ({
      // Extract the client's ID from the Sequelize instance
      id: client.getDataValue("id"),

      // Extract the client's name
      name: client.getDataValue("name"),

      // Extract the client's unique code
      clientCode: client.getDataValue("clientCode"),

      // Count the number of linked contacts by getting the length of the contacts array
      linkedContacts: client.getDataValue("contacts").length,
    }));

    console.log(clientList);

    // Render the client list view, passing the fetched clients to the template
    res.render("client-list", {
      clients: clientList,
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
    // // Extract show from the request parameters
    const { show } = req.query;

    // Check the show query parameter to decide which tab should be active (contacts or general).
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

// Controller function to link multiple contacts to a client
export const linkContacts = async (req: Request, res: Response) => {
  try {
    // Extract clientId from the URL parameters and contactIds from the request body
    const { clientId } = req.params;
    const { contactIds } = req.body; // Array of contact IDs to be linked

    // Check if contactIds are provided in the request
    if (!contactIds || !contactIds.length) {
      res.status(400).json({ message: "No contacts selected" });
      return; // Exit early if no contacts were selected
    }

    // Check if clientId is present in the request
    if (!clientId) {
      res.status(400).json({ message: "Client ID is required" });
      return; // Exit early if clientId is missing
    }

    // Link each selected contact to the client
    const links = contactIds.map((contactId: number) => ({
      clientId: clientId, // The client to link
      contactId: contactId, // The contact to link
    }));

    // Use bulkCreate to add multiple records in ClientContacts
    // ignoreDuplicates: true ensures that no duplicate records are created
    await ClientContact.bulkCreate(links, { ignoreDuplicates: true });

    // Respond with a success message if linking was successful
    res.status(201).json({ message: "Contacts linked successfully" });
  } catch (error) {
    // Log the error for debugging
    console.error("Error linking contacts:", error);

    // Respond with a generic error message if something went wrong
    res.status(500).json({ message: "Error linking contacts" });
  }
};

// Controller function to unlink a specific contact from a client
export const unlinkContact = async (req: Request, res: Response) => {
  try {
    // Extract clientId and contactId from the URL parameters
    const { clientId, contactId } = req.params as {
      contactId: string;
      clientId: string;
    };

    // Delete the link between the specified client and contact from the ClientContact table
    await ClientContact.destroy({
      where: {
        clientId,
        contactId,
      },
    });

    // Redirect back to the client form page with a URL anchor to highlight the "link contact" section
    res.redirect(`/client-form/${clientId}#link-contact`);
  } catch (error) {
    // Log the error for debugging
    console.error(error);

    // Send a response with a generic error message if something went wrong
    res.send("Error while unlinking a contact");
  }
};
