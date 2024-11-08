import { Router } from "express";
import {
  addClient,
  clientFormPage,
  clientListPage,
  linkContacts,
  unlinkContact,
} from "../controllers/client.controller";

// Initialize a new Router instance for handling client-related routes
const routes = Router();

// Route to display the list of all clients
// Calling the clientListPage controller
routes.get("/", clientListPage);

// Route to render a form for adding or editing a client
// Calling the clientFormPage controller
// This route displays the form for adding a new client if no clientId is provided,
// or displays an existing client's data for editing if clientId is specified.
routes.get("/client-form/:clientId?", clientFormPage);

// Route to handle the submission of a new client or updated client data
// Calling the addClient controller
routes.post("/add-client", addClient);

// endpoint to link contacts
routes.post("/link-contacts/:clientId", linkContacts);

// Endpoint to unlink a contact
routes.get("/unlink-contact/:clientId/:contactId", unlinkContact);

// Export the router to be used in the main application
export default routes;
