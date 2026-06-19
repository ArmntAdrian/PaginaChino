import {check, validationResult} from 'express-validator';
import Usuario from '../models/Usuario.js';

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

    if(!resultado.isEmpty()){
        return res.render('auth/registro',{
            pagina: 'Crear Cuenta',
            errores: resultado.array()
        })
    }

   const usuario = await Usuario.create(req.body)
   res.json(usuario)
}
const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvidecontrasenia',{
        pagina: 'Recuperar Contraseña'
    })
}

export {
    formularioLogin,
    formularioRegistro,
    registrar,
    formularioOlvidePassword
}
