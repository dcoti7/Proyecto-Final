import { db } from "../database/conexion.js"; // agregar .js

class HorariosController{
    consultar (req, res){
        try {
            db.query('select * from tbl_horario',
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
            db.query('select * from tbl_horario where idHorario = ?',
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
            const { horaInicio, horaFin, idMedico, idSala} = req.body;
            //query: un proceso de ejecucion de operacion
            db.query('insert into tbl_horario(horaInicio, horaFin, idMedico, idSala) values(?, ?, ?, ?);',
                [horaInicio, horaFin, idMedico, idSala], (err, rows) =>{
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
            const { horaInicio, horaFin, idMedico, idSala } = req.body;
            db.query('update tbl_horario set horaInicio = ?, horaFin = ?, idMedico = ?, idSala = ? where idHorario = ?',
                [horaInicio, horaFin, idMedico, idSala], (err, rows) =>{
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
            db.query('delete from tbl_horario where idHorario = ?;',
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

export const horarios = new HorariosController();