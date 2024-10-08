import express from "express";
import { usuarios } from "../controllers/usuariosController.js"
export const usuariosRouter = express.Router();

usuariosRouter
  .route("/")
  .post(usuarios.ingresar)
  .get(usuarios.consultar);

usuariosRouter.post('/login', usuarios.login);
usuariosRouter.get('/pacientes', usuarios.consultarPacientes)
usuariosRouter.get('/usuariosRol/:id', usuarios.usuariosRol)
usuariosRouter.get('/consultarCitas/:idUsuario', usuarios.consultarCitas)
usuariosRouter.get('/consultarPacienteLogin/:idUsuario', usuarios.consultarPacienteLogin)
usuariosRouter.get('/consultarRecetasPorPaciente/:idUsuario', usuarios.consultarRecetasPorPaciente)

usuariosRouter
  .route("/:id")
  .get(usuarios.consultarId)
  .put(usuarios.actualizar)
  .delete(usuarios.borrar);
