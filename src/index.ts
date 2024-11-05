import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import routes from "./routes";

// configures dotenv to work in your application
dotenv.config();
const app = express();

// set the view engine to ejs
app.set("view engine", "ejs");
// Set the views directory
app.set("views", path.join(__dirname, "views"));
// Serve static files from the 'public' folder
app.use(express.static("public"));

app.use(express.json());

const PORT = process.env.PORT || 4000;

app.use(routes);

app
  .listen(PORT, () => {
    console.log("Server running at http://localhost:" + PORT);
  })
  .on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
  });
