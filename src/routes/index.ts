import { Router } from "express";
import clientRoute from "./client";
import contactRoute from "./contact";

export const routes = Router();

routes.use(clientRoute);
routes.use(contactRoute);

export default routes;
