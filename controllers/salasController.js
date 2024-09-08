import { db } from "../database/conexion.js"; // agregar .js

class SalasController{
    
    consultar(req, res) {
        try {
            db.query('SELECT * FROM tbl_sala', (err, data) => {
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
            const { nombreSala, ubicacion } = req.body;
    
            // Validaciones de entrada
            if (!nombreSala || !ubicacion) {
                return res.status(400).json({ error: "Los campos nombreSala y ubicacion son requeridos." });
            }
    
            // Validaciones de longitud de texto (opcional, ajustar según requerimientos)
            if (nombreSala.length > 100) {
                return res.status(400).json({ error: "El nombreSala debe tener máximo 100 caracteres." });
            }
    
            // Inserción
            db.query('INSERT INTO tbl_sala (nombreSala, ubicacion) VALUES(?, ?);',
                [nombreSala, ubicacion],
                (err, rows) => {
                    if (err) {
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
            const { nombreSala, ubicacion } = req.body;
    
            // Validaciones de entrada
            if (!nombreSala || !ubicacion) {
                return res.status(400).json({ error: "Los campos nombreSala y ubicacion son requeridos." });
            }
    
            // Validaciones de longitud de texto
            if (nombreSala.length > 100) {
                return res.status(400).json({ error: "El nombreSala debe tener máximo 100 caracteres." });
            }
    
            // Actualización
            db.query('UPDATE tbl_sala SET nombreSala = ?, ubicacion = ? WHERE idSala = ?',
                [nombreSala, ubicacion, id],
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
            db.query('SELECT * FROM tbl_sala WHERE idSala = ?',
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
            db.query('DELETE FROM tbl_sala WHERE idSala = ?;',
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

export const salas = new SalasController();