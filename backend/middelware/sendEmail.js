import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
     host: "smtp.gmail.com",
  port: 587,
  secure: false,
    // service: process.env.SERVICE, // or your SMTP service
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to,
    subject,
    text,
  });
};
