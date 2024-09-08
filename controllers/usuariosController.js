import { db } from "../database/conexion.js"; // agregar .js

class UsuariosController{

    consultar (req, res){
        try {
            db.query('select * from tbl_usuario',
                (err, data) =>{
                    if (err){
                        res.status(400).send(err);
                    }
                    res.status(200).json(data);
                }
            )
        }catch(err){
            res.status(500).send(err.message);
        }
    };

    //consultar por id
    consultarId(req, res){
        const {id} = req.params;
        try{
            db.query('select * from tbl_usuario where idUsuario = ?',
                [id],
                (err, data) =>{
                    if (err){
                        res.status(400).send(err);
                    }
                    res.status(200).json(data);
                }
            )
        }catch (err){
            res.status(500).send(err.message);
        }
    };


    ingresar (req, res){
        try{
            const { username, idPersona, idRol} = req.body;
            //query: un proceso de ejecucion de operacion
            db.query('insert into tbl_usuario(username, idPersona, idRol) values( ?, ?, ?);',
                [username, idPersona, idRol], (err, rows) =>{
                    if (err){
                        res.status(400).send(err);
                    }
                    if(rows.affectedRows == 1)
                        res.status(200).json({ respuesta: "Registro ingresado con éxito"})
                });
        }catch(err){
            res.status(500).send(err.message);
        }

    };
    

    actualizar(req, res){
        const { id } = req.params;
        try{
            const { username, idPersona, idRol } = req.body;
            db.query('update tbl_usuario set username = ?, idPersona = ?, idRol = ? where idUsuario = ?',
                [username, idPersona, idRol], (err, rows) =>{
                    if (err){
                        res.status(400).send(err);
                    }
                    if(rows.affectedRows == 1)
                        res.status(200).json({ respuesta: "Registro actualizado con éxito"})
                });
        } catch(err){
            res.status(500).send(err.message);
        };
    };


    borrar(req, res){
        const { id } = req.params;
        try{
            db.query('delete from tbl_usuario where idUsuario = ?;',
                [id], (err, rows) =>{
                    if (err){
                        res.status(400).send(err);
                    }
                    if(rows.affectedRows == 1)
                        res.status(200).json({ respuesta: "Registro eliminado con éxito"})
                });
        } catch(err){
            res.status(500).send(err.message);
        };
    };
    
}

export const usuarios = new UsuariosController();