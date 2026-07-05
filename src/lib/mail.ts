import nodemailer from "nodemailer";

export async function sendContactMail(input: { name: string; email: string; telephone?: string; message: string }) {
  const to = process.env.MAIL_TO;
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!to || !from || !host || !user || !pass) return { skipped: true };

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    to,
    from,
    replyTo: input.email,
    subject: "ILETISIM / TALEP FORMU",
    html: `
      <p><strong>Ad Soyad:</strong> ${input.name}</p>
      <p><strong>Mail:</strong> ${input.email}</p>
      <p><strong>Telefon:</strong> ${input.telephone || "-"}</p>
      <p><strong>Mesaj:</strong></p>
      <p>${input.message.replace(/\n/g, "<br>")}</p>
    `,
  });

  return { skipped: false };
}
