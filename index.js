import 'dotenv/config';
import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes.js';
import db from './config/db.js';


//Crear la app
const app = express();

//Habilitar lectura de datos del formulario
app.use(express.urlencoded({extended: true}))

//Conexion a la base de datos
try{
    await db.authenticate();
    db.sync();
    console.log('Conexion a la base de datos establecida correctamente');
}catch(error){
    console.error('Error al conectar a la base de datos:', error);
}
//Habilitar pug
app.set('view engine', 'pug');
app.set('views', './views');

//Carpeta publica
app.use(express.static('public'))

//routing
app.use('/auth', usuarioRoutes);

//Definir un puerto y arrancar el proyecto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
