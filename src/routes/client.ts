import { Request, Response, Router } from "express";
import {
  addClient,
  addClientPage,
  clientListPage,
} from "../controllers/client.controller";

const routes = Router();

routes.get("/", clientListPage);
routes.get("/add-client", addClientPage);
routes.post("/add-client", addClient);

export default routes;
