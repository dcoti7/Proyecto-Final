import express from 'express'
import cors from 'cors'
import { citasRouter } from './routes/citasRoutes.js';

const app = express();
app.use(express.json());//para usar respuestas tipo json
app.use(cors());

app.get('/',(req, res) =>{
    res.send('hola mundo');
});

app.use('/citas',citasRouter);




app.listen(6500, () =>{
    console.log('servidor activo');
});