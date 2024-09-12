import express from "express";
import { historial } from "../controllers/especialidadController.js";
export const especialidadRouter = express.Router();

historialRouter
    .route("/")
    .post(historial.ingresar)
    .get(historial.consultar)

historialRouter
    .route("/:id")
    .get(historial.consultarId)
    .put(historial.actualizar)
    .delete(historial.borrar)