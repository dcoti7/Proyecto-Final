import express from "express";
import { medicos } from "../controllers/medicosController.js"; 
export const medicosRouter = express.Router();

medicosRouter
  .route("/")
  .post(medicos.ingresar)
  .get(medicos.consultar);

medicosRouter.get('/consultarMedico', medicos.obtenerMedicos);
medicosRouter
  .route("/:id")
  .get(medicos.consultarId)
  .put(medicos.actualizar)
  .delete(medicos.borrar);
