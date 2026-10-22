import nodemailer from "nodemailer";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function transport() {
  const port = Number(process.env.SMTP_PORT ?? 465);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

export async function sendThankYou(to: string, name: string, message: string) {
  const from = process.env.MAIL_FROM ?? process.env.SMTP_USER!;
  const t = transport();

  await t.sendMail({
    from,
    to,
    subject: "Thanks for reaching out",
    text: `Hi ${name},\n\nThanks for your message. I've received it and will reply soon.\n\nYour message:\n${message}\n`,
    html: `<p>Hi ${esc(name)},</p>
<p>Thanks for your message. I've received it and will reply soon.</p>
<p style="color:#555">Your message:</p>
<blockquote style="margin:0;padding-left:12px;border-left:3px solid #ccc;white-space:pre-wrap">${esc(message)}</blockquote>`,
  });

  if (process.env.NOTIFY_EMAIL) {
    await t.sendMail({
      from,
      to: process.env.NOTIFY_EMAIL,
      replyTo: to,
      subject: `New contact from ${name}`,
      text: `${name} <${to}>\n\n${message}`,
    });
  }
}
