import { Router } from "express";
import clientRoute from "./client";

export const routes = Router();

routes.use(clientRoute);

export default routes;
