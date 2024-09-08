import { db } from "../database/conexion.js"; // agregar .js

class PersonasController{

    consultar(req, res) {
        try {
            db.query('SELECT * FROM tbl_persona', (err, data) => {
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
            const { nombre, apellido, fechaNac, email, numero, DPI } = req.body;
    
            // Validaciones de entrada
            if (!nombre || !apellido || !fechaNac || !email || !numero || !DPI) {
                return res.status(400).json({ error: "Todos los campos son requeridos." });
            }
    
            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: "El formato del email es incorrecto." });
            }
    
            // Validar que numero sea numérico y de longitud 8
            if (!/^\d{8}$/.test(numero)) {
                return res.status(400).json({ error: "El número debe tener exactamente 8 dígitos." });
            }
    
            // Validar que el DPI sea numérico y de longitud 13
            if (!/^\d{13}$/.test(DPI)) {
                return res.status(400).json({ error: "El DPI debe tener exactamente 13 dígitos." });
            }
    
            // Validar que fechaNac esté en formato YYYY-MM-DD
            const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!fechaRegex.test(fechaNac)) {
                return res.status(400).json({ error: "El formato de la fecha de nacimiento debe ser YYYY-MM-DD." });
            }
    
            // Inserción
            db.query('INSERT INTO tbl_persona (nombre, apellido, fechaNac, email, numero, DPI) VALUES(?, ?, ?, ?, ?, ?);',
                [nombre, apellido, fechaNac, email, numero, DPI],
                (err, rows) => {
                    if (err) {
                        // Manejo de duplicidad de email o DPI
                        if (err.code === 'ER_DUP_ENTRY') {
                            return res.status(400).json({ error: "El email o DPI ya está registrado." });
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
            const { nombre, apellido, fechaNac, email, numero, DPI } = req.body;
    
            // Validaciones de entrada
            if (!nombre || !apellido || !fechaNac || !email || !numero || !DPI) {
                return res.status(400).json({ error: "Todos los campos son requeridos." });
            }
    
            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: "El formato del email es incorrecto." });
            }
    
            // Validar que numero sea numérico y de longitud 8
            if (!/^\d{8}$/.test(numero)) {
                return res.status(400).json({ error: "El número debe tener exactamente 8 dígitos." });
            }
    
            // Validar que el DPI sea numérico y de longitud 13
            if (!/^\d{13}$/.test(DPI)) {
                return res.status(400).json({ error: "El DPI debe tener exactamente 13 dígitos." });
            }
    
            // Validar que fechaNac esté en formato YYYY-MM-DD
            const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!fechaRegex.test(fechaNac)) {
                return res.status(400).json({ error: "El formato de la fecha de nacimiento debe ser YYYY-MM-DD." });
            }
    
            // Actualización
            db.query('UPDATE tbl_persona SET nombre = ?, apellido = ?, fechaNac = ?, email = ?, numero = ?, DPI = ? WHERE idPersona = ?',
                [nombre, apellido, fechaNac, email, numero, DPI, id],
                (err, rows) => {
                    if (err) {
                        // Manejo de duplicidad de email o DPI
                        if (err.code === 'ER_DUP_ENTRY') {
                            return res.status(400).json({ error: "El email o DPI ya está registrado." });
                        }
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
            db.query('SELECT * FROM tbl_persona WHERE idPersona = ?',
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
            db.query('DELETE FROM tbl_persona WHERE idPersona = ?;',
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

export const personas = new PersonasController();