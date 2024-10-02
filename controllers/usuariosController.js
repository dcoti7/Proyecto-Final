import bcrypt from "bcrypt";
import { db } from "../database/conexion.js"; // agregar .js

class UsuariosController {
  consultar(req, res) {
    try {
      db.query("SELECT * FROM usuario", (err, data) => {
        if (err) {
          return res
            .status(400)
            .json({ error: "Error al consultar la tabla.", details: err });
        }

        // Verificar si la tabla está vacía
        if (data.length === 0) {
          return res
            .status(200)
            .json({ mensaje: "No existen registros en la tabla." });
        }

        // Si hay datos, devolverlos
        return res.status(200).json(data);
      });
    } catch (err) {
      return res
        .status(500)
        .send({ error: "Error interno del servidor.", details: err.message });
    }
  }

  async ingresar(req, res) {
    try {
      const {
        username,
        password,
        dpi,
        nombres,
        apellidos,
        fechaNacimiento,
        email,
        numero,
        idRol,
        estado,
      } = req.body;

      // Validaciones de entrada
      if (
        !username ||
        !password ||
        !dpi ||
        !nombres ||
        !apellidos ||
        !fechaNacimiento ||
        !email ||
        !numero ||
        !idRol ||
        !estado
      ) {
        return res
          .status(400)
          .json({ error: "Todos los campos son requeridos." });
      }

      // Verificar si el usuario ya existe
      const userExists = await new Promise((resolve, reject) => {
        db.query(
          "SELECT * FROM usuario WHERE username = ?",
          [username],
          (err, results) => {
            if (err) reject(err);
            else resolve(results.length > 0);
          }
        );
      });

      if (userExists) {
        return res
          .status(409)
          .json({ error: "El usuario ya está registrado." });
      }

      // Encriptar la contraseña antes de guardarla
      const hashedPassword = await bcrypt.hash(password, 10);

      // Inserción con la contraseña encriptada
      await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO usuario(username, password, dpi, nombres, apellidos, fechaNacimiento, email, numero, idRol, estado) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          [
            username,
            hashedPassword,
            dpi,
            nombres,
            apellidos,
            fechaNacimiento,
            email,
            numero,
            idRol,
            estado,
          ],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });

      return res
        .status(201)
        .json({ respuesta: "Usuario registrado con éxito" });
    } catch (err) {
      if (err.code === "ER_NO_REFERENCED_ROW_2") {
        return res
          .status(400)
          .json({ error: "El idRol no existe en la tabla correspondiente." });
      }
      if (err.code === "ER_DUP_ENTRY") {
        return res
          .status(409)
          .json({ error: "El username ya está registrado." });
      }
      console.error(err);
      return res
        .status(500)
        .json({ error: "Error interno del servidor.", details: err.message });
    }
  }

  actualizar(req, res) {
    const { id } = req.params;

    try {
      const {
        username,
        password,
        dpi,
        nombres,
        apellidos,
        fechaNacimiento,
        email,
        numero,
        idRol,
        estado,
      } = req.body;

      // Validaciones de entrada
      if (
        !username ||
        !password ||
        !dpi ||
        !nombres ||
        !apellidos ||
        !fechaNacimiento ||
        !email ||
        !numero ||
        !idRol ||
        !estado
      ) {
        return res
          .status(400)
          .json({ error: "Todos los campos son requeridos." });
      }
      db.query(
        "UPDATE usuario SET username = ?, password = ?, dpi = ?, nombres = ?, apellidos = ?, fechaNacimiento = ?, email = ?, numero = ?, idRol = ?, estado = ? WHERE idUsuario = ?",
        [
          username,
          password,
          dpi,
          nombres,
          apellidos,
          fechaNacimiento,
          email,
          numero,
          idRol,
          estado,
          id,
        ],
        (err, rows) => {
          if (err) {
            // Manejo de errores de clave foránea o duplicación
            if (err.code === "ER_NO_REFERENCED_ROW_2") {
              return res
                .status(400)
                .json({
                  error: "idRol no existen en las tablas correspondientes.",
                });
            }
            if (err.code === "ER_DUP_ENTRY") {
              return res
                .status(400)
                .json({ error: "El username ya está registrado." });
            }
            return res
              .status(400)
              .json({
                error: "Error al actualizar el registro.",
                details: err,
              });
          }

          // Si no se afecta ninguna fila, significa que el registro con ese id no existe
          if (rows.affectedRows === 0) {
            return res.status(404).json({ error: "Registro no encontrado." });
          }

          // Si se afecta una fila, el registro fue actualizado con éxito
          return res
            .status(200)
            .json({ respuesta: "Registro actualizado con éxito" });
        }
      );
    } catch (err) {
      return res
        .status(500)
        .send({ error: "Error interno del servidor.", details: err.message });
    }
  }

  consultarId(req, res) {
    const { id } = req.params;

    try {
      // Validar que el id sea un número
      if (isNaN(id)) {
        return res.status(400).json({ error: "El id debe ser un número." });
      }

      // Consulta por ID
      db.query(
        "SELECT * FROM usuario WHERE idUsuario = ?",
        [id],
        (err, data) => {
          if (err) {
            return res
              .status(400)
              .json({ error: "Error al consultar el registro.", details: err });
          }

          // Si no se encuentra el registro
          if (data.length === 0) {
            return res.status(404).json({ error: "Registro no encontrado." });
          }

          // Si se encuentra el registro
          return res.status(200).json(data);
        }
      );
    } catch (err) {
      return res
        .status(500)
        .send({ error: "Error interno del servidor.", details: err.message });
    }
  }

  borrar(req, res) {
    const { id } = req.params;

    try {
      // Validar que el id sea un número
      if (isNaN(id)) {
        return res.status(400).json({ error: "El id debe ser un número." });
      }

      // Borrar el registro
      db.query(
        "DELETE FROM usuario WHERE idUsuario = ?;",
        [id],
        (err, rows) => {
          if (err) {
            return res
              .status(400)
              .json({ error: "Error al borrar el registro.", details: err });
          }

          // Si no se elimina ninguna fila, significa que el registro con ese id no existe
          if (rows.affectedRows === 0) {
            return res.status(404).json({ error: "Registro no encontrado." });
          }

          // Si se elimina el registro con éxito
          return res
            .status(200)
            .json({ respuesta: "Registro eliminado con éxito" });
        }
      );
    } catch (err) {
      return res
        .status(500)
        .send({ error: "Error interno del servidor.", details: err.message });
    }
  }

  async login(req, res) {
    const { username, password } = req.body;

    // Validar que ambos campos estén presentes
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username y contraseña son requeridos." });
    }

    try {
      // Buscar el usuario en la base de datos, excluyendo password y estado
      db.query(
        "SELECT idUsuario, username, dpi, nombres, apellidos, fechaNacimiento, email, numero, idRol FROM usuario WHERE username = ?",
        [username],
        async (err, data) => {
          if (err) {
            return res
              .status(400)
              .json({
                error: "Error al consultar la base de datos.",
                details: err,
              });
          }

          // Verificar si el usuario existe
          if (data.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado." });
          }

          const usuario = data[0];

          // Obtener la contraseña del usuario para la verificación
          db.query(
            "SELECT password FROM usuario WHERE username = ?",
            [username],
            async (err, passwordData) => {
              if (err) {
                return res
                  .status(500)
                  .json({
                    error: "Error al verificar la contraseña.",
                    details: err,
                  });
              }

              if (passwordData.length === 0 || !passwordData[0].password) {
                return res
                  .status(500)
                  .json({
                    error:
                      "Error interno: no se pudo recuperar la contraseña del usuario.",
                  });
              }

              // Comparar la contraseña ingresada con la encriptada
              const match = await bcrypt.compare(
                password,
                passwordData[0].password
              );

              if (!match) {
                return res
                  .status(401)
                  .json({ error: "Contraseña incorrecta." });
              }

              // Si la contraseña coincide, devolver todos los campos excepto password y estado
              return res.status(200).json(usuario);
            }
          );
        }
      );
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Error interno del servidor.", details: err.message });
    }
  }

  consultarPacientes(req, res) {
    try {
      // Consulta para obtener solo los usuarios que sean de tipo paciente
      db.query("SELECT * FROM usuario WHERE idRol = ?", [1], (err, data) => {
        if (err) {
          return res
            .status(400)
            .json({ error: "Error al consultar la tabla.", details: err });
        }

        // Verificar si hay usuarios con el rol de paciente
        if (data.length === 0) {
          return res
            .status(200)
            .json({ mensaje: "No existen pacientes registrados en la tabla." });
        }

        // Si hay usuarios, devolverlos
        return res.status(200).json(data);
      });
    } catch (err) {
      return res
        .status(500)
        .send({ error: "Error interno del servidor.", details: err.message });
    }
  }

  usuariosRol(req, res) {
    const { id } = req.params;

    try {
      // Validar que el id sea un número
      if (isNaN(id)) {
        return res.status(400).json({ error: "El idRol debe ser un número." });
      }

      // Consulta SQL para obtener el idUsuario y nombres de usuarios con el idRol variable
      const sql = `
                SELECT idUsuario, CONCAT(nombres, " ", apellidos) AS Nombre 
                FROM usuario 
                WHERE idRol = ?;
            `;

      // Ejecutar la consulta
      db.query(sql, [id], (err, data) => {
        if (err) {
          return res
            .status(400)
            .json({ error: "Error al realizar la consulta.", details: err });
        }

        // Si no se encuentran registros
        if (data.length === 0) {
          return res
            .status(404)
            .json({
              error: "No se encontraron usuarios con el rol especificado.",
            });
        }

        // Si se encuentran registros, devolverlos
        return res.status(200).json(data);
      });
    } catch (err) {
      return res
        .status(500)
        .send({ error: "Error interno del servidor.", details: err.message });
    }
  }

  consultarCitas(req, res) {
    const { idUsuario } = req.params; // Obtener el idUsuario del paciente de los parámetros de la URL

    try {
      // Validar que el idUsuario sea un número
      if (isNaN(idUsuario)) {
        return res
          .status(400)
          .json({ error: "El idUsuario debe ser un número." });
      }

      // Consulta SQL para obtener las citas del paciente
      const sql = `
                SELECT 
                    c.idCita, 
                    CONCAT(p.nombres, " ", p.apellidos) AS Paciente, 
                    CONCAT(uMedico.nombres, " ", uMedico.apellidos) AS Medico, 
                    c.fechaCita, 
                    c.estado 
                FROM 
                    cita c 
                JOIN 
                    usuario p ON c.idPaciente = p.idUsuario 
                JOIN 
                    medico m ON c.idMedico = m.idMedico 
                JOIN 
                    usuario uMedico ON m.idUsuario = uMedico.idUsuario 
                JOIN 
                    horario h ON c.idHorario = h.idHorario
                WHERE 
                    p.idUsuario = ?;
            `;

      // Realizar la consulta a la base de datos
      db.query(sql, [idUsuario], (err, results) => {
        if (err) {
          return res
            .status(400)
            .json({
              error: "Error al consultar las citas del paciente.",
              details: err,
            });
        }

        // Verificar si hay resultados
        if (results.length === 0) {
          return res
            .status(200)
            .json({ mensaje: "No hay citas para este paciente." });
        }

        // Devolver los resultados de la consulta
        return res.status(200).json(results);
      });
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Error interno del servidor.", details: err.message });
    }
  }

  /*  consultarRecetasPorPaciente(req, res) {
        const { idUsuario } = req.params; // Obtener el idUsuario del paciente de los parámetros de la URL
    
        try {
            // Validar que el idUsuario sea un número
            if (isNaN(idUsuario)) {
                return res.status(400).json({ error: "El idUsuario debe ser un número." });
            }
    
            // Consulta SQL para obtener las recetas del paciente
            const sql = `
                SELECT 
                    r.idReceta, 
                    c.idCita,  
                    CONCAT(p.nombres, " ", p.apellidos) AS Paciente, 
                    r.descripcion 
                FROM 
                    receta r
                JOIN 
                    cita c ON r.idCita = c.idCita
                JOIN 
                    usuario p ON c.idPaciente = p.idUsuario
                WHERE 
                    p.idUsuario = ?;
            `;
    
            // Realizar la consulta a la base de datos
            db.query(sql, [idUsuario], (err, results) => {
                if (err) {
                    return res.status(400).json({ error: "Error al consultar las recetas del paciente.", details: err });
                }
    
                // Verificar si hay resultados
                if (results.length === 0) {
                    return res.status(200).json({ mensaje: "No hay recetas para este paciente." });
                }
    
                // Devolver los resultados de la consulta
                return res.status(200).json(results);
            });
        } catch (err) {
            return res.status(500).json({ error: "Error interno del servidor.", details: err.message });
        }
    } */

  /* consultarRecetasPorPaciente(req, res) {
    const { idUsuario } = req.params; // Obtener el idUsuario del paciente de los parámetros de la URL

    try {
        
      const id = parseInt(idUsuario);

      // Validar que el idUsuario sea un número
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ error: "El idUsuario debe ser un número." });
      }

      // Consulta SQL para obtener las recetas del paciente
      const sql = `
            SELECT 
                r.idReceta, 
                c.idCita,  
                CONCAT(p.nombres, " ", p.apellidos) AS Paciente, 
                r.descripcion 
            FROM 
                receta r
            JOIN 
                cita c ON r.idCita = c.idCita
            JOIN 
                usuario p ON c.idPaciente = p.idUsuario
            WHERE 
                p.idUsuario = ?;
        `;

      // Realizar la consulta a la base de datos
      db.query(sql, [id], (err, results) => {
        if (err) {
          // Manejo de errores en la consulta SQL
          return res
            .status(400)
            .json({
              error: "Error al consultar las recetas del paciente.",
              details: err,
            });
        }

        // Verificar si se encontraron resultados
        if (results.length === 0) {
          return res
            .status(404)
            .json({ error: "No hay recetas para este paciente." });
        }

        // Si se encuentran recetas, devolver los resultados
        return res.status(200).json(results);
      });
    } catch (err) {
      // Manejo de errores internos del servidor
      return res
        .status(500)
        .json({ error: "Error interno del servidor.", details: err.message });
    }
  } */

    consultarRecetasPorPaciente(req, res) {
        const { idUsuario } = req.params; // Obtener el idUsuario del paciente de los parámetros de la URL
        
        try {
          // Consulta SQL para obtener las recetas del paciente
          const sql = `
            SELECT 
                r.idReceta, 
                c.idCita,  
                CONCAT(p.nombres, " ", p.apellidos) AS Paciente, 
                r.descripcion 
            FROM 
                receta r
            JOIN 
                cita c ON r.idCita = c.idCita
            JOIN 
                usuario p ON c.idPaciente = p.idUsuario
            WHERE 
                p.idUsuario = ?;
          `;
      
          // Realizar la consulta a la base de datos
          db.query(sql, [idUsuario], (err, results) => {
            if (err) {
              // Manejo de errores en la consulta SQL
              return res
                .status(400)
                .json({
                  error: "Error al consultar las recetas del paciente.",
                  details: err,
                });
            }
      
            // Verificar si se encontraron resultados
            if (results.length === 0) {
              return res
                .status(404)
                .json({ error: "No hay recetas para este paciente." });
            }
      
            // Si se encuentran recetas, devolver los resultados
            return res.status(200).json(results);
          });
        } catch (err) {
          // Manejo de errores internos del servidor
          return res
            .status(500)
            .json({ error: "Error interno del servidor.", details: err.message });
        }
      }
      

  consultarPacienteLogin(req, res) {
    const { idUsuario } = req.params; // Obtener el idUsuario de los parámetros de la URL

    try {
      // Validar que el idUsuario sea un número
      /* if (isNaN(idUsuario)) {
                return res.status(400).json({ error: "El idUsuario debe ser un número." });
            } */

      // Consulta SQL para obtener el usuario por su id y con idRol = 1
      const sql = `
                SELECT 
                    idUsuario, 
                    CONCAT(nombres, " ", apellidos) AS Nombre 
                FROM 
                    usuario 
                WHERE 
                    idRol = 1 
                    AND idUsuario = ?;
            `;

      // Realizar la consulta a la base de datos
      db.query(sql, [idUsuario], (err, results) => {
        if (err) {
          return res
            .status(400)
            .json({ error: "Error al consultar el usuario.", details: err });
        }

        // Verificar si hay resultados
        if (results.length === 0) {
          return res
            .status(200)
            .json({ mensaje: "No se encontró el usuario con este id." });
        }

        // Devolver los resultados de la consulta
        return res.status(200).json(results);
      });
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Error interno del servidor.", details: err.message });
    }
  }
}

export const usuarios = new UsuariosController();
