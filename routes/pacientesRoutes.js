import express from "express";
import { pacientes } from "../controllers/pacientesController.js"; 
export const pacientesRouter = express.Router();


pacientesRouter
  .route("/")
  .post(pacientes.ingresar)
  .get(pacientes.consultar);


pacientesRouter
  .route("/:id")
  .get(pacientes.consultarId)
  .put(pacientes.actualizar)
  .delete(pacientes.borrar);
