import { db } from "../database/conexion.js"; // agregar .js

class MedicosController{

    consultar(req, res) {
        try {
            db.query('SELECT * FROM medico', (err, data) => {
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
            const { idEspecialidad, idUsuario } = req.body;
    
            // Validaciones de entrada
            if (!idEspecialidad || !idUsuario) {
                return res.status(400).json({ error: "Todos los campos son requeridos." });
            }
    
            // Validar que idUsuario sea un número
            if (isNaN(idEspecialidad) || isNaN(idUsuario)) {
                return res.status(400).json({ error: "El idUsuario e idEspecialidad debe ser un número." });
            }
    
            // Inserción
            db.query('INSERT INTO medico (idEspecialidad, idUsuario) VALUES(?, ?);',
                [idEspecialidad, idUsuario],
                (err, rows) => {
                    if (err) {
                        // Verificar si es un error de clave foránea
                        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                            return res.status(400).json({ error: "El idUsuario o idEspecialidad no existe en la tabla correspondiente." });
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
            const { idEspecialidad, idUsuario } = req.body;
    
            // Validaciones de entrada
            if (!idEspecialidad || !idUsuario) {
                return res.status(400).json({ error: "Todos los campos son requeridos." });
            }
    
            // Validar que idUsuario e id sean números
            if (isNaN(idEspecialidad) || isNaN(idUsuario) || isNaN(id)) {
                return res.status(400).json({ error: "El idUsuario, idEspecialidad y id deben ser números." });
            }
    
            // Actualización
            db.query('UPDATE medico SET idEspecialidad = ?, idUsuario = ? WHERE idMedico = ?',
                [idEspecialidad, idUsuario, id],
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
            db.query('SELECT * FROM medico WHERE idMedico = ?',
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

    consultarCitas(req, res) {
        const { idUsuario } = req.params; // Obtener el idUsuario de los parámetros de la URL
    
        try {
            // Validar que el idUsuario sea un número
           /*  if (isNaN(idUsuario)) {
                return res.status(400).json({ error: "El idUsuario debe ser un número." });
            } */
    
            // Consulta SQL para obtener las citas
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
                    uMedico.idUsuario = ?;
            `;
    
            // Realizar la consulta a la base de datos
            db.query(sql, [idUsuario], (err, results) => {
                if (err) {
                    return res.status(400).json({ error: "Error al consultar las citas.", details: err });
                }
    
                // Verificar si hay resultados
                if (results.length === 0) {
                    return res.status(400).json({ mensaje: "No hay citas para este médico." });
                }
    
                // Devolver los resultados de la consulta
                return res.status(200).json(results);
            });
        } catch (err) {
            return res.status(500).json({ error: "Error interno del servidor.", details: err.message });
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
            db.query('DELETE FROM medico WHERE idMedico = ?;',
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

    async obtenerMedicos(req, res) {
        try {
            // Consulta SQL para obtener la información de los médicos y sus especialidades
            const sql = `
                SELECT 
                    m.idMedico, 
                    CONCAT(uMedico.nombres, " ", uMedico.apellidos) AS Medico,
                    e.nombre AS Especialidad
                FROM 
                    medico m 
                JOIN 
                    usuario uMedico ON m.idUsuario = uMedico.idUsuario
                JOIN
                    Especialidad e ON m.idEspecialidad = e.idEspecialidad;
            `;
    
            // Realizar la consulta a la base de datos
            db.query(sql, (err, results) => {
                if (err) {
                    return res.status(400).json({ error: "Error al consultar los médicos.", details: err });
                }
    
                // Verificar si hay resultados
                if (results.length === 0) {
                    return res.status(200).json({ mensaje: "No hay médicos disponibles." });
                }
    
                // Devolver los resultados de la consulta
                return res.status(200).json(results);
            });
        } catch (err) {
            return res.status(500).json({ error: "Error interno del servidor.", details: err.message });
        }
    }

    consultarMedicoLogin(req, res) {
        const { idUsuario } = req.params; // Obtener el idUsuario del médico desde los parámetros de la URL
    
        try {
            // Validar que el idUsuario sea un número
           /*  if (isNaN(idUsuario)) {
                return res.status(400).json({ error: "El idUsuario debe ser un número." });
            } */
    
            // Consulta SQL para obtener el médico por usuario
            const sql = `
                SELECT 
                    m.idMedico, 
                    CONCAT(uMedico.nombres, " ", uMedico.apellidos) AS Medico,
                    e.nombre AS Especialidad
                FROM 
                    medico m 
                JOIN 
                    usuario uMedico ON m.idUsuario = uMedico.idUsuario
                JOIN 
                    especialidad e ON m.idEspecialidad = e.idEspecialidad
                WHERE 
                    uMedico.idUsuario = ?;
            `;
    
            // Realizar la consulta a la base de datos
            db.query(sql, [idUsuario], (err, results) => {
                if (err) {
                    return res.status(400).json({ error: "Error al consultar el médico.", details: err });
                }
    
                // Verificar si hay resultados
                if (results.length === 0) {
                    return res.status(200).json({ mensaje: "No se encontró el médico para este usuario." });
                }
    
                // Devolver los resultados de la consulta
                return res.status(200).json(results);
            });
        } catch (err) {
            return res.status(500).json({ error: "Error interno del servidor.", details: err.message });
        }
    }
    
}

export const medicos = new MedicosController();