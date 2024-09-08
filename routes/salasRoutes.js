import express from "express";
import { salas } from "../controllers/salasController.js"
export const salasRouter = express.Router();

salasRouter
  .route("/")
  .post(salas.ingresar)
  .get(salas.consultar);


salasRouter
  .route("/:id")
  .get(salas.consultarId)
  .put(salas.actualizar)
  .delete(salas.borrar);
