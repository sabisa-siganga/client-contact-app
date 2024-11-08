import { Router } from "express";
import {
  contactFormPage,
  contactListPage,
  createContact,
  linkClients,
  unlinkClient,
} from "../controllers/contact.controller";

// Initialize a new Router instance for handling contact-related routes
const routes = Router();

// Route to display the list of contacts
// Calling the contactListPage controller
routes.get("/contacts", contactListPage);

// Route to render the form for adding a new contact
// Calling the contactFormPage controller
routes.get("/contact-form/:contactId?", contactFormPage);

// Route to handle the form submission for creating a new contact
// Calling the createContact controller
routes.post("/create-contact", createContact);

// endpoint to link contacts
routes.post("/link-clients/:contactId", linkClients);

// Endpoint to unlink a contact
routes.get("/unlink-client/:contactId/:clientId", unlinkClient);

// Export the router to be used in the main app
export default routes;
