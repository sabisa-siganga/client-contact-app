import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import routes from "./routes";

// Load environment variables from a .env file into process.env
dotenv.config();

const app = express(); // Initialize Express application

// Set EJS as the template engine for rendering views
app.set("view engine", "ejs");

// Define the directory where the EJS view templates are located
app.set("views", path.join(__dirname, "views"));

// Serve static files (e.g., CSS, images) from the 'public' directory
app.use(express.static("public"));

// Middleware to parse incoming JSON requests
app.use(express.json());

const PORT = process.env.PORT || 4000; // Define the port number from environment variables or default to 4000

// Use routes defined in the 'routes' module
app.use(routes);

// Start the server and listen on the specified port
app
  .listen(PORT, () => {
    console.log("Server running at http://localhost:" + PORT); // Log server address on successful startup
  })
  .on("error", (error) => {
    // Handle server errors gracefully by throwing an error with a custom message
    throw new Error(error.message);
  });
