import { db } from "../database/conexion.js"; // agregar .js

class PersonasController{

    consultar (req, res){
        try {
            db.query('select * from tbl_persona',
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
            db.query('select * from tbl_persona where idPersona = ?',
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
            const { nombre, apellido, fechaNac, email, numero, DPI } = req.body;
            //query: un proceso de ejecucion de operacion
            db.query('insert into tbl_persona (nombre, apellido, fechaNac, email, numero,DPI) values(?, ?, ?, ?, ?, ?);',
                [nombre, apellido, fechaNac, email,numero, DPI], (err, rows) =>{
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
            const { nombre, apellido, fechaNac, email, numero,DPI } = req.body;
            db.query('update tbl_persona set nombre = ?, apellido = ?, fechaNac = ?, email = ?, numero = ?, DPI = ? where idPersona = ?',
                [nombre, apellido, fechaNac, email, numero, DPI], (err, rows) =>{
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
            db.query('delete from tbl_persona where idPersona = ?;',
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

export const personas = new PersonasController();