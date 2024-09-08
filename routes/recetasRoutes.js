import express from "express";
import { recetas } from "../controllers/recetasController.js"
export const recetasRouter = express.Router();

recetasRouter
  .route("/")
  .post(recetas.ingresar)
  .get(recetas.consultar);


recetasRouter
  .route("/:id")
  .get(recetas.consultarId)
  .put(recetas.actualizar)
  .delete(recetas.borrar);
