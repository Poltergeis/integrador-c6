import nodemailer from "nodemailer";

export class Mailer{
    constructor() {
        this.gmail = "mezagonzalezjulio@gmail.com";
        this.password = "dysf wjsf rpyk rafu";
        this.to = null;
    }

    async sendEmail() {
        // Crea el objeto de transporte usando Gmail
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: this.gmail || "", // Reemplaza con tu correo de Gmail
            pass: this.password || ""   // Reemplaza con tu contraseña o aplicación de Gmail
          }
        });
      
        // Opciones del correo
        const mailOptions = {
          from: this.gmail || "", // De quién está enviando
          to: this.to || "",                       // A quién enviar el correo
          subject: "movimiento de la persona mayor",             // Asunto del correo
          text: "hemos detectado movimiento de la persona mayor"                    // Contenido del correo
        };
      
        try {
          // Enviar el correo
          const info = await transporter.sendMail(mailOptions);
          console.log('Correo enviado: ' + info.response);
        } catch (error) {
          console.error('Error al enviar el correo: ', error);
        }
      }
}