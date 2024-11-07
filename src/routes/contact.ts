import { Router } from "express";
import {
  addContactPage,
  contactListPage,
} from "../controllers/contact.controller";

const routes = Router();

routes.get("/contacts", contactListPage);
routes.post("/add-contact", addContactPage);

export default routes;
