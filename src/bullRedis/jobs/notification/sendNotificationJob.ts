import { Job } from "bull";
import nodemailer from "nodemailer";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.TWILIO_PHONE_NUMBER; // Número do WhatsApp configurado no Twilio
const client = twilio(accountSid, authToken);

export const sendNotificationProcessor = async (job: Job) => {
  const { contato, mensagem, equipamento } = job.data;

  // Envia WhatsApp se permitido
  if (contato.receberWhats && contato.telefone) {
    try {
      await client.messages.create({
        body: mensagem,
        from: whatsappFrom,
        to: `whatsapp:${contato.telefone}`
      });
      console.log(`WhatsApp enviado para ${contato.telefone}: ${mensagem}`);
    } catch (err) {
      console.error(`Erro ao enviar WhatsApp para ${contato.telefone}:`, err);
    }
  }

  // Envia e-mail se permitido
  if (contato.receberEmail && contato.email) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === '465', // true para porta 465
      auth: { 
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS // senha de aplicativo ou token
      },
    });
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: contato.email,
      subject: `Falha detectada no equipamento ${equipamento.name}`,
      text: mensagem
    });
    console.log(`E-mail enviado para ${contato.email}: ${mensagem}`);
  }
};
