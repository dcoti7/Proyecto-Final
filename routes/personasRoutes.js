import express from "express";
import { personas } from "../controllers/personasController.js"
export const personasRouter = express.Router();

personasRouter
  .route("/")
  .post(personas.ingresar)
  .get(personas.consultar);


personasRouter
  .route("/:id")
  .get(personas.consultarId)
  .put(personas.actualizar)
  .delete(personas.borrar);
