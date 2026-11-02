import nodemailer, { type Transporter } from "nodemailer";
import { SHOP } from "@/content/shop";
import { DOMAIN } from "./site";
import { writeOutbox } from "./store";

// E-mails sent by the shop from its own mailbox at Hostinger, over SMTP. Settings in .env.local (.env.example):
// SMTP_USER and SMTP_PASSWORD, optionally SMTP_HOST and SMTP_PORT. With MAIL_OUTBOX=1 (local tests) every e-mail is
// written to DATA_DIR/outbox instead of being sent. Without either, nothing is sent and the server logs an error.

export type Mail = {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
  attachments?: { filename: string; content: string; contentType: string }[];
};

const g = globalThis as unknown as { __smtp?: Transporter | null };

function smtp() {
  if (g.__smtp !== undefined) return g.__smtp;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const port = Number(process.env.SMTP_PORT || 465);
  g.__smtp =
    user && pass
      ? nodemailer.createTransport({ host: process.env.SMTP_HOST || "smtp.hostinger.com", port, secure: port === 465, auth: { user, pass } })
      : null;
  return g.__smtp;
}

const sender = () => `"${DOMAIN}" <${process.env.SMTP_USER || SHOP.email}>`;

/** Sends an e-mail; false (and a line in the server log) when it could not leave. Never throws. */
export async function sendMail(mail: Mail): Promise<boolean> {
  const message = { from: sender(), ...mail };
  try {
    if (process.env.MAIL_OUTBOX === "1") {
      const out = await nodemailer.createTransport({ streamTransport: true, buffer: true, newline: "unix" }).sendMail(message);
      writeOutbox(`${Date.now()}-${mail.subject.replace(/[^a-z0-9]+/gi, "-").slice(0, 60)}.eml`, out.message as Buffer);
      return true;
    }
    const transport = smtp();
    if (!transport) {
      console.error("mail not sent: SMTP_USER and SMTP_PASSWORD are missing from .env.local");
      return false;
    }
    await transport.sendMail(message);
    return true;
  } catch (e) {
    console.error("mail not sent:", e instanceof Error ? e.message : e);
    return false;
  }
}

/** Whether e-mails can leave (shown on the dashboard). */
export const mailReady = () => process.env.MAIL_OUTBOX === "1" || Boolean(process.env.SMTP_USER && process.env.SMTP_PASSWORD);
