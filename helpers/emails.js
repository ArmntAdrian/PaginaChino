import nodemailer from 'nodemailer';
import { MailtrapTransport } from 'mailtrap';

const emailRegistro = async (datos) => {
    const { nombre, email, token } = datos;

    const transport = nodemailer.createTransport(
        MailtrapTransport({ token: process.env.MAILTRAP_TOKEN })
    );

    await transport.sendMail({
        from: {
            address: 'hello@demomailtrap.co',
            name: 'Pagina Chino',
        },
        to: email,
        subject: 'Confirma tu cuenta en Pagina Chiino',
        html: `
            <p>Hola ${nombre}, confirma tu cuenta en Pagina Chiino</p>
            <p>Tu cuenta ya está lista, solo debes confirmarla en el siguiente enlace:
                <a href="${process.env.BACKEND_URL}/auth/confirmar/${token}">Confirmar cuenta</a>
            </p>
            <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
        `,
    });
};

export { emailRegistro };
