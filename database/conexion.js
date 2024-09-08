import mysql from 'mysql2';

export const db= mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'dbClinica'
})

db.connect((err) =>{
    if(err){
        throw err;
    }
    console.log('base de datos conectada');
})