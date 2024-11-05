import { Request, Response } from "express";
import Client from "../models/client.model";
import { generateClientCode } from "../utils/client-code-generator";

export const clientListPage = async (req: Request, res: Response) => {
  try {
    const clients = await Client.findAll();
    console.log(clients);

    res.render("client-list", {
      clients,
    });
  } catch (error) {
    console.error(error);

    res.status(500).send("Error fetching clients");
  }
};

export const addClientPage = async (req: Request, res: Response) => {
  try {
    res.render("add-client");
  } catch (error) {
    console.error(error);

    res.status(500).send("Error adding client");
  }
};

export const addClient = async (req: Request, res: Response) => {
  try {
    const data = req.body as {
      name: string;
      phone: string;
      email: string;
    };

    if (!data.name || !data.email || !data.phone) {
      res.status(400).json({
        success: false,
        message: "Please submit all required fields",
      });
      return;
    }

    // Add logic to create a new client
    const clientCode = await generateClientCode(data.name);

    const client = await Client.create({
      name: data.name,
      email: data.email,
      clientCode,
    });

    res.status(201).json({
      success: true,
      data: {
        name: client.getDataValue("name"),
        email: client.getDataValue("email"),
        clientCode: client.getDataValue("clientCode"),
        createdAt: client.getDataValue("createdAt"),
      },
      message: "Client added successfully!",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error adding client",
    });
  }
};
