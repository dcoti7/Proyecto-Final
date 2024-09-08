import { db } from "../database/conexion.js"; // agregar .js

class CitasController{

    
    consultar (req, res){
        try {
            db.query('select * from tbl_cita',
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
            db.query('select * from tbl_cita where idCita = ?',
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
            const { idPaciente, idHorarioCita, fechaRegistro, motivo, estado} = req.body;
            //query: un proceso de ejecucion de operacion
            db.query('insert into tbl_cita (idPaciente, idHorarioCita, fechaRegistro, motivo, estado) values(?, ?, ?, ?, ?);',
                [idPaciente, idHorarioCita, fechaRegistro, motivo,estado], (err, rows) =>{
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
            const { dni, nombre, apellido, email } = req.body;
            db.query('update estudiantes set dni = ?, nombre = ?, apellido = ?, email = ? where id = ?',
                [dni, nombre, apellido, email, id], (err, rows) =>{
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
            db.query('delete from estudiantes where id = ?;',
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

export const citas = new CitasController();