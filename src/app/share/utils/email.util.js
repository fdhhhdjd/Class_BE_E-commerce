const nodemailer = require("nodemailer");
const emailConfig = require("../configs/email.conf");

class EmailUtil {
  constructor() {
    this.transport = nodemailer.createTransport({
      host: emailConfig.Host,
      port: emailConfig.Port,
      secure: emailConfig.Secure,
      auth: {
        user: emailConfig.User,
        pass: emailConfig.Password,
      },
    });
  }

  async sendEmail({ to, subject, text, html }) {
    const emailOptions = {
      from: emailConfig.User,
      to,
      subject,
      text,
      html,
    };

    try {
      const info = await this.transport.sendMail(emailOptions);
      console.log("Email sent: %s", info.messageId);
    } catch (error) {
      console.error("Error sending email: ", error);
      throw error;
    }
  }
}

module.exports = new EmailUtil();
