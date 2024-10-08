import { db } from "../database/conexion.js"; // agregar .js

class EspecialidadController{
    
    consultar(req, res) {
        try {
            db.query('SELECT * FROM Especialidad', (err, data) => {
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
            const { nombre } = req.body;
    
            // Validaciones de entrada
            if (!nombre ) {
                return res.status(400).json({ error: "El campo nombre es requerido." });
            }
    
           /*  if (isNaN(idMedico) || isNaN(idPaciente) || isNaN(idHorario)) {
                return res.status(400).json({ error: "idMedico, idPaciente y idHorario deben ser números." });
            } */
    
    
            // Inserción
            db.query('INSERT INTO Especialidad (nombre) VALUES(?);',
                [nombre],
                (err, rows) => {
                    /* if (err) {
                        // Verificar si es un error de clave foránea
                        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                            return res.status(400).json({ error: "El idMedico, idPaciente o idHorario no existen en las tablas correspondientes." });
                        }
                        return res.status(400).json({ error: "Error al insertar el registro.", details: err });
                    } */
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
            const { nombre } = req.body;
    
            // Validaciones de entrada
            if (!nombre) {
                return res.status(400).json({ error: "El campo nombre es requerido" });
            }
    
           /*  if (isNaN(idMedico) || isNaN(idPaciente) || isNaN(idHorario) || isNaN(id)) {
                return res.status(400).json({ error: "idMedico, idPaciente, idHorario e id deben ser números." });
            }
     */
    
            // Actualización
            db.query('UPDATE Especialidad SET nombre = ? WHERE idEspecialidad = ?',
                [nombre, id],
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
            db.query('SELECT * FROM Especialidad WHERE idEspecialidad = ?',
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
            db.query('DELETE FROM Especialidad WHERE idEspecialidad = ?;',
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

export const especialidad = new EspecialidadController();