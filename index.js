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

app.use('/personas',personasRouter);
app.use('/usuarios',usuariosRouter);
app.use('/medicos',medicosRouter);
app.use('/pacientes',pacientesRouter);
app.use('/salas',salasRouter);
app.use('/horarios',horariosRouter);
app.use('/horariosCitas',horariosCitasRouter);
app.use('/citas',citasRouter);
app.use('/historial',historialRouter);
app.use('/recetas',recetasRouter);

app.listen(6500, () =>{
    console.log('servidor activo');
});