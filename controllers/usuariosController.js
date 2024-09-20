import bcrypt from 'bcrypt';
import { db } from "../database/conexion.js"; // agregar .js

class UsuariosController{

    consultar(req, res) {
        try {
            db.query('SELECT * FROM usuario', (err, data) => {
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
    
    async ingresar(req, res) {
        try {
            const { username, password, dpi, nombres, apellidos, fechaNacimiento, email, numero, idRol, estado } = req.body;

            // Validaciones de entrada
            if (!username || !password || !dpi || !nombres || !apellidos || !fechaNacimiento || !email || !numero || !idRol || !estado) {
                return res.status(400).json({ error: "Todos los campos son requeridos." });
            }

            // Encriptar la contraseña antes de guardarla
            const hashedPassword = await bcrypt.hash(password, 10); // 10 es el número de rondas de encriptación (puede ajustarse)

            // Inserción con la contraseña encriptada
            db.query('INSERT INTO usuario(username, password, dpi, nombres, apellidos, fechaNacimiento, email, numero, idRol, estado ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
                [username, hashedPassword, dpi, nombres, apellidos, fechaNacimiento, email, numero, idRol, estado],
                (err, rows) => {
                    if (err) {
                        // Verificar si es un error de clave foránea o duplicación
                        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                            return res.status(400).json({ error: "El idRol no existen en la tabla correspondiente." });
                        }
                        if (err.code === 'ER_DUP_ENTRY') {
                            return res.status(400).json({ error: "El username ya está registrado." });
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
            const { username, password, dpi, nombres, apellidos, fechaNacimiento, email, numero, idRol, estado } = req.body;
    
            // Validaciones de entrada
            if (!username || !password || !dpi || !nombres || !apellidos || !fechaNacimiento || !email || !numero || !idRol || !estado) {
                return res.status(400).json({ error: "Todos los campos son requeridos." });
            }
    
            // Validar que idPersona, idRol e id sean números
           /*  if (isNaN(idPersona) || isNaN(idRol) || isNaN(id)) {
                return res.status(400).json({ error: "Los campos idPersona, idRol e id deben ser números." });
            } */
    
            // Validar longitud de username
           /*  if (username.length > 50) {
                return res.status(400).json({ error: "El username debe tener máximo 50 caracteres." });
            } */
    
            // Actualización
            db.query('UPDATE usuario SET username = ?, password = ?, dpi = ?, nombres = ?, apellidos = ?, fechaNacimiento = ?, email = ?, numero = ?, idRol = ?, estado = ? WHERE idUsuario = ?',
                [username, password, dpi, nombres, apellidos, fechaNacimiento, email, numero, idRol, estado, id],
                (err, rows) => {
                    if (err) {
                        // Manejo de errores de clave foránea o duplicación
                        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                            return res.status(400).json({ error: "idRol no existen en las tablas correspondientes." });
                        }
                        if (err.code === 'ER_DUP_ENTRY') {
                            return res.status(400).json({ error: "El username ya está registrado." });
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
            db.query('SELECT * FROM usuario WHERE idUsuario = ?',
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
            db.query('DELETE FROM usuario WHERE idUsuario = ?;',
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

    async login(req, res) {
        const { username, password } = req.body;

        // Validar que ambos campos estén presentes
        if (!username || !password) {
            return res.status(400).json({ error: "Username y contraseña son requeridos." });
        }

        try {
            // Buscar el usuario en la base de datos por el username
            db.query('SELECT * FROM usuario WHERE username = ?', [username], async (err, data) => {
                if (err) {
                    return res.status(400).json({ error: "Error al consultar la base de datos.", details: err });
                }

                // Verificar si el usuario existe
                if (data.length === 0) {
                    return res.status(404).json({ error: "Usuario no encontrado." });
                }

                const usuario = data[0];

                // Asegurarse de que el campo 'password' exista
                if (!usuario.password) {
                    return res.status(500).json({ error: "Error interno: no se pudo recuperar la contraseña del usuario." });
                }

                // Comparar la contraseña ingresada con la encriptada
                const match = await bcrypt.compare(password, usuario.password);

                if (!match) {
                    return res.status(401).json({ error: "Contraseña incorrecta." });
                }

                // Si la contraseña coincide, excluir el campo 'password' y 'estado' antes de devolver el objeto de usuario
                const { password: userPassword, estado, ...userWithoutPasswordAndEstado } = usuario;

                return res.status(200).json({ mensaje: "Inicio de sesión exitoso", usuario: userWithoutPasswordAndEstado });
            });
        } catch (err) {
            return res.status(500).json({ error: "Error interno del servidor.", details: err.message });
        }
    }


    
}

export const usuarios = new UsuariosController();