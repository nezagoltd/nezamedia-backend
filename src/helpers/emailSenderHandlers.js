import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import dotenv from 'dotenv';
import EmailVerificationService from '../services/emailVerification.service';

dotenv.config();

const {
  APP_NAME,
  APPLICATION_URL,
  NEZAMEDIA_EMAIL,
  NEZAMEDIA_EMAIL_PASSWORD,
  NEZAMEDIA_EMAIL_SERVICE,
} = process.env;

/**
 * @class
 * @classdesc this class hold all email sending processes handler
 */
class EmailSenderHandlers {
  /**
     * @method
     * @param{string} link
     * @param{string} names
     * @param{string} email
     * @param{object} emailContent
     * @returns{*} sendsEmail
     *
     */
    static sendAnyEmail = async (link, names, email, emailContent) => {
      const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
          name: APP_NAME,
          link: APPLICATION_URL,
        },
      });

      const {
        subject, intro, instructions, buttonText, buttonColor, outro,
      } = emailContent;

      const emailMsg = {
        body: {
          name: names,
          intro,
          action: {
            instructions,
            button: {
              color: buttonColor,
              text: buttonText,
              link: `${APPLICATION_URL}${link}`,
            },
          },
          outro,
        },
      };

      const emailHtml = mailGenerator.generate(emailMsg);
      const emailPlainText = mailGenerator.generatePlaintext(emailMsg);
      const transporter = nodemailer.createTransport({
        service: NEZAMEDIA_EMAIL_SERVICE,
        auth: {
          user: NEZAMEDIA_EMAIL,
          pass: NEZAMEDIA_EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      const mailOptions = {
        from: `'"${APP_NAME}" <${NEZAMEDIA_EMAIL}>'`,
        to: email,
        subject,
        text: emailPlainText,
        html: emailHtml,
      };
      await transporter.sendMail(mailOptions);
      await EmailVerificationService.saveAll({
        emailSentTo: email,
        emailSentFrom: NEZAMEDIA_EMAIL,
        emailMessage: emailHtml,
      });
    }
}

export default EmailSenderHandlers;
