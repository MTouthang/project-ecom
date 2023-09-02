import nodemailer from "nodemailer";

// export const transporter = nodemailer.createTransport({
//     host: "smtp.forwardemail.net",
//   port: 465,
//   secure: false,
//   secureConnection: false,
//   auth: {
//     // TODO: replace `user` and `pass` values from <https://forwardemail.net>
//     user: "",
//     pass: "",
//   },
// });

export const mailHelper = async (
  user: string,
  subject: string,
  message: string,
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // hostname
    secure: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOption = await transporter.sendMail({
    from: "",
    to: user,
    subject: subject,
    text: message,
  });

  console.log(`mail0ption ---${mailOption}`);
};
