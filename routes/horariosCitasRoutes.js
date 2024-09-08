import express from "express";
import { horariosCitas } from "../controllers/horariosCitasController.js";
export const horariosCitasRouter = express.Router();

horariosCitasRouter
    .route("/")
    .post(horariosCitas.ingresar)
    .get(horariosCitas.consultar)

horariosCitasRouter
    .route("/:id")
    .get(horariosCitas.consultarId)
    .put(horariosCitas.actualizar)
    .delete(horariosCitas.borrar)