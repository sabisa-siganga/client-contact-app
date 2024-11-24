import { Router } from "express";
import clientRoute from "./client"; // Import client-related routes
import contactRoute from "./contact"; // Import contact-related routes

// Initialize the main router to group all routes
export const routes = Router();

// separate these two routes because when the app becomes big it will be easy to maintain

// Use client-related routes under the main router
// This will include all routes defined in `clientRoute`, e.g., /clients, /add-client
routes.use(clientRoute);

// Use contact-related routes under the main router
// This will include all routes defined in `contactRoute`, e.g., /contacts, /add-contact
routes.use(contactRoute);

// Export the main router to be used in the application entry point
export default routes;
