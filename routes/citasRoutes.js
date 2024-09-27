import express from "express";
import { citas } from "../controllers/citasController.js"
export const citasRouter = express.Router();

citasRouter
    .route("/")
    .get(citas.consultar)
    .post(citas.ingresar)

citasRouter.get('/obtenerCitas', citas.obtenerCitas);
citasRouter.get('/obtenerHorarios', citas.obtenerHorarios);
citasRouter.get('/citaPaciente/:id', citas.consultaPaciente);

citasRouter
    .route("/:id")
    .get(citas.consultarId)
    .put(citas.actualizar)
    .delete(citas.borrar)