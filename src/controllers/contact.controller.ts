import { Request, Response } from "express";
import Contact from "../models/contact.model";
import Client from "../models/client.model";
import { Op } from "sequelize";
import ClientContact from "../models/client-contact.model";

// Controller function to render a page displaying the list of all contacts
export const contactListPage = async (req: Request, res: Response) => {
  try {
    // Fetch all contacts from the database, ordered by surname and then by name alphabetically
    const contacts = await Contact.findAll({
      order: [
        ["surname", "ASC"], // Sort by surname in ascending order
        ["name", "ASC"], // Sort by name in ascending order for contacts with the same surname
      ],
      include: [
        {
          model: Client, // Include associated clients for each contact
          as: "clients", // Alias for accessing associated clients
          through: { attributes: [] }, // Exclude junction table attributes
        },
      ],
    });
    console.log(contacts); // Log contacts list for debugging

    // Render the contact list view, passing the fetched contacts to the template
    res.render("contact-list", {
      contacts,
    });
  } catch (error) {
    console.error(error); // Log any errors that occur

    // Send a 500 error response if an error occurs while fetching contacts
    res.status(500).send("Error fetching contacts");
  }
};

/**
 * Controller function to render a page for adding a new contact
 * - If a `contactId` parameter is present, it loads the contact's information.
 * - If no `contactId` is provided,  create a new contact.
 */
export const contactFormPage = async (req: Request, res: Response) => {
  try {
    const { contactId } = req.params; // Get contactId from request parameters
    let contactDetails = { name: "", surname: "", email: "" }; // Default contact details for a new contact
    const { show } = req.query;

    const showTab = show === "clients" ? "clients" : "general";

    // If no contactId is provided, create new contact
    if (!contactId) {
      res.render("contact-form", {
        contactDetails,
        clients: [],
        availableClients: [],
        contactId,
        showTab,
      });
      return;
    }

    // Find the contact by primary key (contactId), including linked clients
    const contact = await Contact.findByPk(contactId, {
      include: [
        {
          model: Client,
          as: "clients", // Alias for related clients
          through: { attributes: [] }, // Exclude junction table attributes
        },
      ],
    });

    // If contact not found, render the form with empty contact details and no clients
    if (!contact) {
      res.render("contact-form", {
        contactDetails,
        clients: [],
        availableClients: [],
        contactId,
        showTab,
      });
      return;
    }

    // Get linked clients for the contact to show existing clients
    const linkedClients: { id: number; name: string; clientCode: string }[] =
      contact.getDataValue("clients");

    // Fetch available contacts that are not already linked to the client
    const availableClients = await Client.findAll({
      where: {
        id: { [Op.notIn]: linkedClients.map((client) => client.id) },
      },
    });

    // Render the contact form view, passing the list of clients to the template
    res.render("contact-form", {
      contactDetails: {
        name: contact.getDataValue("name"),
        surname: contact.getDataValue("surname"),
        email: contact.getDataValue("email"),
      },
      clients: linkedClients,
      availableClients,
      contactId,
      showTab,
    });
  } catch (error) {
    console.error(error); // Log any errors that occur

    // Send a 500 error response if an error occurs while rendering the contact form page
    res.status(500).send("Error adding contact");
  }
};

// Controller function to create a new contact in the database
export const createContact = async (req: Request, res: Response) => {
  try {
    const { name, surname, email } = req.body; // Extract name, surname, and email from the request body

    // Check for required fields; if any are missing, return a 400 error
    if (!name || !surname || !email) {
      res.status(400).json({
        success: false,
        message: "Please provide all required fields. Name, Surname, and Email",
      });
      return;
    }

    // Create and save the new contact in the database
    const contact = await Contact.create({
      name,
      surname,
      email,
    });

    // Respond with a success message upon successful creation
    res.status(201).json({
      success: true,
      contactId: contact.getDataValue("id"),
      message: "Contact created successfully",
    });
  } catch (error) {
    console.error(error); // Log any errors that occur

    // Send a 500 error response if an error occurs while creating the contact
    res.status(500).json({
      success: false,
      message: "Error adding contact",
    });
  }
};

export const linkClients = async (req: Request, res: Response) => {
  try {
    const { contactId } = req.params;
    const { clientIds } = req.body; // Array of client IDs

    if (!clientIds || !clientIds.length) {
      res.status(400).json({ message: "No clients selected" });
      return;
    }

    if (!contactId) {
      res.status(400).json({ message: "Contact ID is required" });
      return;
    }

    // Link each selected client to the contact
    const links = clientIds.map((clientId: number) => ({
      contactId: contactId,
      clientId: clientId,
    }));

    // Use bulkCreate to add multiple records in ClientContacts
    await ClientContact.bulkCreate(links, { ignoreDuplicates: true });

    res.status(201).json({ message: "Clients linked successfully" });
  } catch (error) {
    console.error("Error linking clients:", error);
    res.status(500).json({ message: "Error linking clients" });
  }
};

export const unlinkClient = async (req: Request, res: Response) => {
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

    res.redirect(`/contact-form/${contactId}#link-client`);
  } catch (error) {
    console.error(error);

    res.send("Error while unlinking a client");
  }
};
