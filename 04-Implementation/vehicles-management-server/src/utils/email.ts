// npm packages
import nodemailer from "nodemailer";

// project imports
import { config } from "../config/config";

// interfaces and types
import { Transporter } from "nodemailer";

type EmailOptions = {
  email: string;
  subject: string;
  message: string;
};

/** Start Functions **/
const sendEmail = async (options: EmailOptions): Promise<void> => {
  const { host, port, user, password } = config.mailtrap;

  // 1) Create a transporter
  const transporter: Transporter = nodemailer.createTransport({
    host,
    port,
    auth: {
      user,
      pass: password,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: "ROM Soft <romsoft2023@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};
/** End Functions **/

export default sendEmail;
