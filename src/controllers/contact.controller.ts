import { Request, Response } from "express";
import Contact from "../models/contact.model";

export const contactListPage = async (req: Request, res: Response) => {
  try {
    const contacts = await Contact.findAll({
      order: [["name", "ASC"]],
    });
    console.log(contacts);

    res.render("contact-list", {
      contacts,
    });
  } catch (error) {
    console.error(error);

    res.status(500).send("Error fetching contacts");
  }
};

export const addContactPage = async (req: Request, res: Response) => {
  try {
    const contacts = await Contact.findAll();
    res.render("add-contact", {
      contacts,
    });
  } catch (error) {
    console.error(error);

    res.status(500).send("Error adding contact");
  }
};
