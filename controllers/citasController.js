import { db } from "../database/conexion.js"; // agregar .js

class CitasController{
    
    consultar(req, res) {
        try {
            db.query('SELECT * FROM cita', (err, data) => {
                if (err) {
                    return res.status(400).json({ error: "Error al consultar la tabla.", details: err });
                }
    
                // Verificar si la tabla está vacía
                if (data.length === 0) {
                    return res.status(200).json({ mensaje: "No existen registros en la tabla." });
                }
    
                // Si hay datos, devolverlos
                return res.status(200).json(data);
            });
        } catch (err) {
            return res.status(500).send({ error: "Error interno del servidor.", details: err.message });
        }
    }
    
    ingresar(req, res) {
        try {
            const { idMedico, idPaciente, idHorario, estado, fechaCita } = req.body;
    
            // Validaciones de entrada
            if (!idMedico || !idPaciente || !idHorario || !estado || !fechaCita ) {
                return res.status(400).json({ error: "Todos los campos son requeridos." });
            }
    
            if (isNaN(idMedico) || isNaN(idPaciente) || isNaN(idHorario)) {
                return res.status(400).json({ error: "idMedico, idPaciente y idHorario deben ser números." });
            }
    
    
            // Inserción
            db.query('INSERT INTO cita (idMedico, idPaciente, idHorario, estado, fechaCita) VALUES(?, ?, ?, ?, ?);',
                [idMedico, idPaciente, idHorario, estado, fechaCita],
                (err, rows) => {
                    if (err) {
                        // Verificar si es un error de clave foránea
                        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                            return res.status(400).json({ error: "El idMedico, idPaciente o idHorario no existen en las tablas correspondientes." });
                        }
                        return res.status(400).json({ error: "Error al insertar el registro.", details: err });
                    }
                    if (rows.affectedRows === 1) {
                        return res.status(200).json({ respuesta: "Registro ingresado con éxito" });
                    }
                }
            );
        } catch (err) {
            return res.status(500).send({ error: "Error interno del servidor.", details: err.message });
        }
    }
    
    actualizar(req, res) {
        const { id } = req.params;
    
        try {
            const { idMedico, idPaciente, idHorario, estado, fechaCita } = req.body;
    
            // Validaciones de entrada
            if (!idMedico || !idPaciente || !idHorario || !estado || !fechaCita) {
                return res.status(400).json({ error: "Todos los campos son requeridos." });
            }
    
            if (isNaN(idMedico) || isNaN(idPaciente) || isNaN(idHorario) || isNaN(id)) {
                return res.status(400).json({ error: "idMedico, idPaciente, idHorario e id deben ser números." });
            }
    
    
            // Actualización
            db.query('UPDATE cita SET idMedico = ?, idPaciente = ?, idHorario = ?, estado = ?, fechaCita = ? WHERE idCita = ?',
                [idMedico, idPaciente, idHorario, estado, fechaCita, id],
                (err, rows) => {
                    if (err) {
                        return res.status(400).json({ error: "Error al actualizar el registro.", details: err });
                    }
    
                    // Si no se afecta ninguna fila, significa que el registro con ese id no existe
                    if (rows.affectedRows === 0) {
                        return res.status(404).json({ error: "Registro no encontrado." });
                    }
    
                    // Si se afecta una fila, el registro fue actualizado con éxito
                    return res.status(200).json({ respuesta: "Registro actualizado con éxito" });
                }
            );
        } catch (err) {
            return res.status(500).send({ error: "Error interno del servidor.", details: err.message });
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
            db.query('SELECT * FROM cita WHERE idCita = ?',
                [id],
                (err, data) => {
                    if (err) {
                        return res.status(400).json({ error: "Error al consultar el registro.", details: err });
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
            return res.status(500).send({ error: "Error interno del servidor.", details: err.message });
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
            db.query('DELETE FROM cita WHERE idCita = ?;',
                [id],
                (err, rows) => {
                    if (err) {
                        return res.status(400).json({ error: "Error al borrar el registro.", details: err });
                    }
    
                    // Si no se elimina ninguna fila, significa que el registro con ese id no existe
                    if (rows.affectedRows === 0) {
                        return res.status(404).json({ error: "Registro no encontrado." });
                    }
    
                    // Si se elimina el registro con éxito
                    return res.status(200).json({ respuesta: "Registro eliminado con éxito" });
                }
            );
        } catch (err) {
            return res.status(500).send({ error: "Error interno del servidor.", details: err.message });
        }
    } 


    async obtenerCitas(req, res) {
        try {
            // Consulta SQL para obtener la información de las citas
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
                    horario h ON c.idHorario = h.idHorario;
            `;

            // Realizar la consulta a la base de datos
            db.query(sql, (err, results) => {
                if (err) {
                    return res.status(400).json({ error: "Error al consultar las citas.", details: err });
                }

                // Verificar si hay resultados
                if (results.length === 0) {
                    return res.status(200).json({ mensaje: "No hay citas disponibles." });
                }

                // Devolver los resultados de la consulta
                return res.status(200).json(results);
            });
        } catch (err) {
            return res.status(500).json({ error: "Error interno del servidor.", details: err.message });
        }
    }

    obtenerHorarios(req, res) {
        try {
            const sql = `
                SELECT 
                    h.idHorario, 
                    CONCAT(
                        CONCAT(uMedico.nombres, " ", uMedico.apellidos),
                        " - ",
                        CONCAT("Sala ", s.idSalaConsulta, " Nivel ", s.nivel)
                    ) AS Horario
                FROM horario h
                JOIN medico m ON h.idMedico = m.idMedico 
                JOIN usuario uMedico ON m.idUsuario = uMedico.idUsuario 
                JOIN salaconsulta s ON s.idSalaConsulta = h.idSala;
            `;

            db.query(sql, (err, results) => {
                if (err) {
                    return res.status(400).json({ error: "Error al consultar los horarios.", details: err });
                }

                if (results.length === 0) {
                    return res.status(200).json({ mensaje: "No hay horarios disponibles." });
                }

                return res.status(200).json(results);
            });
        } catch (err) {
            return res.status(500).json({ error: "Error interno del servidor.", details: err.message });
        }
    }

    consultaPaciente(req, res) {
        const { id } = req.params;

        try {
            // Validar que el id sea un número
            if (isNaN(id)) {
                return res.status(400).json({ error: "El idPaciente debe ser un número." });
            }

            // Consulta SQL para obtener las citas del paciente
            const sql = `
                SELECT * 
                FROM cita 
                WHERE idPaciente = ? 
                LIMIT 0, 1000;
            `;

            // Ejecutar la consulta
            db.query(sql, [id], (err, data) => {
                if (err) {
                    return res.status(400).json({ error: "Error al realizar la consulta.", details: err });
                }

                // Si no se encuentran registros
                if (data.length === 0) {
                    return res.status(404).json({ error: "No se encontraron citas para el paciente especificado." });
                }

                // Si se encuentran registros, devolverlos
                return res.status(200).json(data);
            });
        } catch (err) {
            return res.status(500).send({ error: "Error interno del servidor.", details: err.message });
        }
    }

    
}

export const citas = new CitasController();