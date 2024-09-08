import express from "express";
import { citas } from "../controllers/citasController.js"
export const citasRouter = express.Router();

citasRouter
.route("/")
.get(citas.consultar)
.post(citas.ingresar)

citasRouter
.route("/:id")
.get(citas.consultarId)