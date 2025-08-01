import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "4b2fcfa5571dbf",
    pass: "****436f"
  }
});

/**
 * Função que envia um e-mail de boas-vindas para um novo usuário.
 * @param userEmail - O e-mail do destinatário.
 * @param userName - O nome do usuário para personalizar a mensagem.
 */
export async function sendWelcomeEmail(userEmail: string, userName: string) {
  
    const mailOptions = {
        from: '"Equipe EJCM" <no-reply@EJCM.com>', 
        to: userEmail,                                    
        subject: `Bem-vindo à Elektro, ${userName}!`, 
        text: `Olá ${userName}, seu cadastro na Elektro foi realizado com sucesso!`, 
        html: `<b>Olá ${userName},</b><p>Seu cadastro na Elektro foi realizado com sucesso!</p><p>Aproveite nossa plataforma para comprar e vender eletrônicos.</p>`,
    };

    try {

        const info = await transporter.sendMail(mailOptions);
        
        console.log('E-mail de boas-vindas enviado: %s', info.messageId);

        console.log('URL de pré-visualização: %s', nodemailer.getTestMessageUrl(info));

    } catch (error) {
        console.error('Erro ao enviar o e-mail de boas-vindas:', error);

    }
}