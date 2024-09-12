import express from "express";
import { especialidad } from "../controllers/especialidadController.js";
export const especialidadRouter = express.Router();

especialidadRouter
    .route("/")
    .post(especialidad.ingresar)
    .get(especialidad.consultar)

especialidadRouter
    .route("/:id")
    .get(especialidad.consultarId)
    .put(especialidad.actualizar)
    .delete(especialidad.borrar)