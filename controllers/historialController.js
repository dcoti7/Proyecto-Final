import { db } from "../database/conexion.js"; // agregar .js

class HistorialController{

    consultar(req, res) {
        try {
            db.query('SELECT * FROM historial', (err, data) => {
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
            const { idPaciente, idCita } = req.body;
    
            // Validaciones de entrada
            if (!idPaciente || !idCita) {
                return res.status(400).json({ error: "Todos los campos son requeridos." });
            }
    
            // Validar que idReceta sea un número
            if (isNaN(idPaciente) || isNaN(idCita)) {
                return res.status(400).json({ error: "El idPaciente e idCita debe ser un número." });
            }
    
            // Consulta de inserción
            db.query('INSERT INTO historial (idPaciente, idCita) VALUES(?, ?);',
                [idPaciente, idCita],
                (err, rows) => {
                    if (err) {
                        // Verificar si es un error de clave foránea
                        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                            return res.status(400).json({ error: "El idPaciente o idCita no existe en la tabla correspondiente." });
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
            const { idPaciente, idCita } = req.body;
    
            // Validaciones de entrada
            if (!idPaciente || !idCita) {
                return res.status(400).json({ error: "Todos los campos son requeridos." });
            }
    
            // Validar que idReceta y id sean números
            if (isNaN(idPaciente) || isNaN(idCita) || isNaN(id)) {
                return res.status(400).json({ error: "El idPaciente,idCita e id deben ser números." });
            }
    
            // Consulta de actualización
            db.query('UPDATE historial SET idPaciente = ?, idCita = ? WHERE idHistorial = ?',
                [idPaciente, idCita, id],
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
            db.query('SELECT * FROM historial WHERE idHistorial = ?',
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
            db.query('DELETE FROM historial WHERE idHistorial = ?;',
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

    historialMedico(req, res) {
        const { id } = req.params;

        try {
            // Validar que el id sea un número
            /* if (isNaN(id)) {
                return res.status(400).json({ error: "El id debe ser un número." });
            } */

            // Consulta SQL
            const sql = `
                SELECT h.idHistorial, p.idUsuario, 
                       CONCAT(p.nombres, " ", p.apellidos) AS Paciente, 
                       CONCAT(m.nombres, " ", m.apellidos) AS Medico, 
                       h.idCita, es.nombre AS Especialidad, 
                       c.fechaCita 
                FROM historial h
                JOIN usuario p ON p.idUsuario = h.idPaciente
                JOIN cita c ON c.idCita = h.idCita
                JOIN medico e ON e.idMedico = c.idMedico
                JOIN usuario m ON m.idUsuario = e.idMedico
                JOIN especialidad es ON e.idEspecialidad = es.idEspecialidad
                WHERE h.idHistorial = ?;
            `;

            // Ejecutar la consulta
            db.query(sql, [id], (err, data) => {
                if (err) {
                    return res.status(400).json({ error: "Error al realizar la consulta.", details: err });
                }

                // Si no se encuentra el registro
                if (data.length === 0) {
                    return res.status(404).json({ error: "Registro de historial no encontrado." });
                }

                // Si se encuentra el registro, devolverlo
                return res.status(200).json(data);
            });
        } catch (err) {
            return res.status(500).send({ error: "Error interno del servidor.", details: err.message });
        }
    }


    historialPorPaciente(req, res) {
        const { idUsuario } = req.params; // Obtener el idUsuario del paciente de los parámetros de la URL
    
        try {
            // Validar que el idUsuario sea un número
            /* if (isNaN(idUsuario)) {
                return res.status(400).json({ error: "El idUsuario debe ser un número." });
            } */
    
            // Consulta SQL para obtener el historial del paciente
            const sql = `
                SELECT 
                    h.idHistorial, 
                    p.idUsuario, 
                    CONCAT(p.nombres, " ", p.apellidos) AS Paciente, 
                    CONCAT(m.nombres, " ", m.apellidos) AS Medico, 
                    h.idCita, 
                    es.nombre AS Especialidad, 
                    c.fechaCita 
                FROM 
                    historial h
                JOIN 
                    usuario p ON p.idUsuario = h.idPaciente
                JOIN 
                    cita c ON c.idCita = h.idCita
                JOIN 
                    medico e ON e.idMedico = c.idMedico
                JOIN 
                    usuario m ON m.idUsuario = e.idUsuario  
                JOIN 
                    especialidad es ON e.idEspecialidad = es.idEspecialidad
                WHERE 
                    p.idUsuario = ?;
            `;
    
            // Realizar la consulta a la base de datos
            db.query(sql, [idUsuario], (err, results) => {
                if (err) {
                    return res.status(400).json({ error: "Error al consultar el historial del paciente.", details: err });
                }
    
                // Verificar si hay resultados
                if (results.length === 0) {
                    return res.status(400).json({ mensaje: "No se encontró historial para este paciente." });
                }
    
                // Devolver los resultados de la consulta
                return res.status(200).json(results);
            });
        } catch (err) {
            return res.status(500).json({ error: "Error interno del servidor.", details: err.message });
        }
    }


    historialGeneral(req, res) {
        try {
            // Consulta SQL para obtener el historial general
            const sql = `
                SELECT 
                    h.idHistorial, 
                    p.idUsuario, 
                    CONCAT(p.nombres, " ", p.apellidos) AS Paciente, 
                    CONCAT(m.nombres, " ", m.apellidos) AS Medico, 
                    h.idCita, 
                    es.nombre AS Especialidad, 
                    c.fechaCita 
                FROM 
                    historial h
                JOIN 
                    usuario p ON p.idUsuario = h.idPaciente
                JOIN 
                    cita c ON c.idCita = h.idCita
                JOIN 
                    medico e ON e.idMedico = c.idMedico
                JOIN 
                    usuario m ON m.idUsuario = e.idMedico
                JOIN 
                    especialidad es ON e.idEspecialidad = es.idEspecialidad;
            `;
            
            // Ejecutar la consulta
            db.query(sql, (err, data) => {
                if (err) {
                    return res.status(400).json({ error: "Error al realizar la consulta.", details: err });
                }
    
                // Verificar si hay registros
                if (data.length === 0) {
                    return res.status(404).json({ mensaje: "No se encontraron registros en la tabla." });
                }
    
                // Devolver los resultados de la consulta
                return res.status(200).json(data);
            });
        } catch (err) {
            return res.status(500).send({ error: "Error interno del servidor.", details: err.message });
        }
    }

    
}

export const historial = new HistorialController();