import {check, validationResult} from 'express-validator';
import Usuario from '../models/Usuario.js';
import {generarId} from '../helpers/tokens.js';
import { emailRegistro } from '../helpers/emails.js';

const formularioLogin = (req, res) => {
    res.render('auth/login',{
        pagina: 'Iniciar Sesión'
    })
}
const formularioRegistro = (req, res) => {
    res.render('auth/registro',{
        pagina: 'Crear Cuenta'
    })
}
const registrar = async (req, res) => {

    //validación
    await check('nombre').notEmpty().withMessage('El nombre no puede estar vacío').run(req);
    await check('email').isEmail().withMessage('El email no es válido').run(req);
    await check('password').isLength({min: 6}).withMessage('El password debe tener al menos 6 caracteres').run(req);
    await check('repetir_password').custom((value, {req}) => value === req.body.password).withMessage('Los passwords no coinciden').run(req);

    const resultado = validationResult(req);
    if(!resultado.isEmpty()){
        return res.render('auth/registro',{
            pagina: 'Crear Cuenta',
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    //Extraer los datos
    const {nombre, email, password} = req.body;

    //Verificar que el usuario no este duplicado
    const Email = req.body.email.trim().toLowerCase();
    const existeUsuario = await Usuario.findOne({where: {email:Email}})

    if(existeUsuario){
        return res.render('auth/registro',{
            pagina: 'Crear Cuenta',
            errores: [{msg: 'El usuario ya está registrado'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    const token = generarId();

    const usuario = await Usuario.create({
        nombre,
        email: Email,
        password,
        token: generarId()
    });

    //Enviar email de confirmación
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    });

    //Mostrar mensaje de confirmación
    return res.render('templates/mensaje',{
        pagina: 'Cuenta Creada Correctamente',
        mensaje: 'Hemos enviado un correo de confirmación, presiona el enlace'
    })
}
//Función para confirmar cuenta
const confirmar = (req, res, next) => {
    const {token} = req.params; 

    //Verificar el token

    //Confirmar la cuenta

    next();
}

//Formulario para olvide contraseña
const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvidecontrasenia',{
        pagina: 'Recuperar Contraseña'
    })
}

export {
    formularioLogin,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword
}
