import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import dotenv from 'dotenv';
import customMessages from './customMessages';
import EmailVerificationService from '../services/emailVerification.service';

dotenv.config();

const {
  APP_NAME,
  APPLICATION_URL,
  NEZAMEDIA_EMAIL,
  NEZAMEDIA_EMAIL_PASSWORD,
  NEZAMEDIA_EMAIL_SERVICE,
} = process.env;
const {
  subject, intro, instructions, buttonText, outro,
} = customMessages.verificationEmail;

/**
 * @class
 * @classdesc this class hold all email sending processes handler
 */
class EmailSenderHandlers {
  /**
     * @method
     * @param{string} myToken
     * @param{string} names
     * @param{string} email
     * @returns{*} sendsEmail
     */
    static sendEmailVerification = async (myToken, names, email) => {
      const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
          name: APP_NAME,
          link: APPLICATION_URL,
        },
      });

      const emailMsg = {
        body: {
          name: names,
          intro,
          action: {
            instructions,
            button: {
              color: '#FF585B',
              text: buttonText,
              link: `${APPLICATION_URL}/api/users/verify-user?token=${myToken}`,
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
