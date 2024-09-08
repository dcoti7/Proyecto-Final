import express from "express";
import { horarios } from "../controllers/horariosController.js";
export const horariosRouter = express.Router();

horariosRouter
  .route("/")
  .post(horarios.ingresar)
  .get(horarios.consultar);


horariosRouter
  .route("/:id")
  .get(horarios.consultarId)
  .put(horarios.actualizar)
  .delete(horarios.borrar)