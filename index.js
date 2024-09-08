import express from 'express'
import cors from 'cors'
import { citasRouter } from './routes/citasRoutes.js';
import { historialRouter } from './routes/historialRoutes.js';
import { horariosCitasRouter } from './routes/horariosCitasRoutes.js';
import { horariosRouter } from './routes/horariosRoutes.js';
import { medicosRouter } from './routes/medicosRoutes.js';
import { pacientesRouter } from './routes/pacientesRoutes.js';
import { personasRouter } from './routes/personasRoutes.js';
import { recetasRouter } from './routes/recetasRoutes.js';
import { salasRouter } from './routes/salasRoutes.js';
import { usuariosRouter } from './routes/usuariosRoutes.js';

const app = express();
app.use(express.json());//para usar respuestas tipo json
app.use(cors());

app.get('/',(req, res) =>{
    res.send('hola mundo');
});

app.use('/citas',citasRouter);
app.use('/historial',historialRouter);
app.use('/horariosCitas',horariosCitasRouter);
app.use('/horarios',horariosRouter);
app.use('/medicos',medicosRouter);
app.use('/pacientes',pacientesRouter);
app.use('/personas',personasRouter);
app.use('/recetas',recetasRouter);
app.use('/salas',salasRouter);
app.use('/usuarios',usuariosRouter);


app.listen(6500, () =>{
    console.log('servidor activo');
});