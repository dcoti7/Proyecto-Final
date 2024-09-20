import express from 'express'
import cors from 'cors'
import { citasRouter } from './routes/citasRoutes.js';
import { especialidadRouter } from './routes/especialidadRoutes.js';
import { historialRouter } from './routes/historialRoutes.js';
import { horariosRouter } from './routes/horariosRoutes.js';
import { medicosRouter } from './routes/medicosRoutes.js';
import { recetasRouter } from './routes/recetasRoutes.js';
import { salasRouter } from './routes/salasRoutes.js';
import { usuariosRouter } from './routes/usuariosRoutes.js';

const app = express();
app.use(express.json());//para usar respuestas tipo json
app.use(cors());



app.use('/especialidad',especialidadRouter);
app.use('/salas',salasRouter);
app.use('/usuarios',usuariosRouter);
app.use('/medicos',medicosRouter);
app.use('/horarios',horariosRouter);
app.use('/citas',citasRouter);
app.use('/historial',historialRouter);
app.use('/recetas',recetasRouter);

app.listen(6500, () =>{
    console.log('servidor activo');
});