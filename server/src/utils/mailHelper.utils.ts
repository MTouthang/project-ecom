import nodemailer from "nodemailer";

export const mailHelper = async (
  user: string,
  subject: string,
  message: string,
) => {
  const transporter = nodemailer.createTransport({
    // host: process.env.SMTP_HOST, // hostname
    service: process.env.SMTP_SERVICE,
    secure: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOption = await transporter.sendMail({
    from: process.env.SMTP_MAIL,
    to: user,
    subject: subject,
    text: message,
  });

  console.log(`mail0ption ---${mailOption}`);
};
