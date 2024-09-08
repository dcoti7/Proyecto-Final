import { db } from "../database/conexion.js"; // agregar .js

class HorariosController{

    consultar(req, res) {
        try {
            db.query('SELECT * FROM tbl_horario', (err, data) => {
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
            const { horaInicio, horaFin, idMedico, idSala } = req.body;
    
            // Validaciones de entrada
            if (!horaInicio || !horaFin || !idMedico || !idSala) {
                return res.status(400).json({ error: "Todos los campos son requeridos." });
            }
    
            // Validar que idMedico y idSala sean números
            if (isNaN(idMedico) || isNaN(idSala)) {
                return res.status(400).json({ error: "idMedico y idSala deben ser números." });
            }
    
            // Validar que horaInicio y horaFin tengan el formato correcto (HH:MM:SS)
            const horaRegex = /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
            if (!horaRegex.test(horaInicio) || !horaRegex.test(horaFin)) {
                return res.status(400).json({ error: "El formato de la hora debe ser HH:MM:SS." });
            }
    
            // Inserción
            db.query('INSERT INTO tbl_horario(horaInicio, horaFin, idMedico, idSala) VALUES(?, ?, ?, ?);',
                [horaInicio, horaFin, idMedico, idSala],
                (err, rows) => {
                    if (err) {
                        // Verificar si es un error de clave foránea
                        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                            return res.status(400).json({ error: "El idMedico o idSala no existen en las tablas correspondientes." });
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
            const { horaInicio, horaFin, idMedico, idSala } = req.body;
    
            // Validaciones de entrada
            if (!horaInicio || !horaFin || !idMedico || !idSala) {
                return res.status(400).json({ error: "Todos los campos son requeridos." });
            }
    
            // Validar que idMedico, idSala y id sean números
            if (isNaN(idMedico) || isNaN(idSala) || isNaN(id)) {
                return res.status(400).json({ error: "idMedico, idSala e id deben ser números." });
            }
    
            // Validar que horaInicio y horaFin tengan el formato correcto (HH:MM:SS)
            const horaRegex = /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
            if (!horaRegex.test(horaInicio) || !horaRegex.test(horaFin)) {
                return res.status(400).json({ error: "El formato de la hora debe ser HH:MM:SS." });
            }
    
            // Actualización
            db.query('UPDATE tbl_horario SET horaInicio = ?, horaFin = ?, idMedico = ?, idSala = ? WHERE idHorario = ?',
                [horaInicio, horaFin, idMedico, idSala, id],
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
            db.query('SELECT * FROM tbl_horario WHERE idHorario = ?',
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
            db.query('DELETE FROM tbl_horario WHERE idHorario = ?;',
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
    
}

export const horarios = new HorariosController();