import { db } from "../database/conexion.js"; // agregar .js

class RecetasController{
    
    consultar(req, res) {
        try {
            db.query('SELECT * FROM tbl_receta', (err, data) => {
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
            const { medicamento, dosis, frecuencia, duracion, idCita } = req.body;
    
            // Validaciones de entrada
            if (!medicamento || !dosis || !frecuencia || !duracion || !idCita) {
                return res.status(400).json({ error: "Todos los campos son requeridos." });
            }
    
            // Validar que idCita sea un número
            if (isNaN(idCita)) {
                return res.status(400).json({ error: "El idCita debe ser un número." });
            }
    
            // Validaciones de longitud de texto (opcional, ajustar según requerimientos)
            if (medicamento.length > 100 || dosis.length > 100 || frecuencia.length > 100 || duracion.length > 100) {
                return res.status(400).json({ error: "El medicamento, dosis, frecuencia y duración deben tener máximo 100 caracteres." });
            }
    
            // Inserción
            db.query('INSERT INTO tbl_receta(medicamento, dosis, frecuencia, duracion, idCita) VALUES(?, ?, ?, ?, ?);',
                [medicamento, dosis, frecuencia, duracion, idCita],
                (err, rows) => {
                    if (err) {
                        // Verificar si es un error de clave foránea
                        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                            return res.status(400).json({ error: "El idCita no existe en la tabla correspondiente." });
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
            const { medicamento, dosis, frecuencia, duracion, idCita } = req.body;
    
            // Validaciones de entrada
            if (!medicamento || !dosis || !frecuencia || !duracion || !idCita) {
                return res.status(400).json({ error: "Todos los campos son requeridos." });
            }
    
            // Validar que idCita e id sean números
            if (isNaN(idCita) || isNaN(id)) {
                return res.status(400).json({ error: "El idCita e id deben ser números." });
            }
    
            // Validaciones de longitud de texto
            if (medicamento.length > 100 || dosis.length > 100 || frecuencia.length > 100 || duracion.length > 100) {
                return res.status(400).json({ error: "El medicamento, dosis, frecuencia y duración deben tener máximo 100 caracteres." });
            }
    
            // Actualización
            db.query('UPDATE tbl_receta SET medicamento = ?, dosis = ?, frecuencia = ?, duracion = ?, idCita = ? WHERE idReceta = ?',
                [medicamento, dosis, frecuencia, duracion, idCita, id],
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
            db.query('SELECT * FROM tbl_receta WHERE idReceta = ?',
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
            db.query('DELETE FROM tbl_receta WHERE idReceta = ?;',
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

export const recetas = new RecetasController();