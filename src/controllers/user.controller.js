import _ from 'lodash';
import UserService from '../services/user.service';
import statusCodes from '../helpers/statusCodes';
import ResponseHandlers from '../helpers/responseHandlers';
import { generateToken } from '../helpers/tokenHandlers';
import { hashPassword } from '../helpers/passwordHandlers';
import customMessages from '../helpers/customMessages';
import EmailSenderHandlers from '../helpers/emailSenderHandlers';

const {
  created, ok,
} = statusCodes;
const {
  signupSuccess,
  emailVerificationSuccess,
  verificationEmailResentSuccess,
  passwordResetRequestEmailSent,
  passwordResetSuccess,
} = customMessages.successMessages;

const { verificationEmail, passwordResetRequestEmail, passwordResetSuccessEmail } = customMessages;

/**
 * @description this class user controller will work with req, and response to interact with db
 */
export default class UserController extends ResponseHandlers {
  /**
   * @constructor
   */
  constructor() {
    super();
    this.res = {};
  }

  /**
     * @param {object} req
     * @param {object} res
     * @returns {object} response to user
     */
  saveNewUser = async (req, res) => {
    this.res = res;
    req.body.password = hashPassword(req.body.password);
    const { dataValues } = await UserService.saveAll(req.body);
    const token = generateToken(dataValues);
    const link = `/api/users/verify-user?token=${token}`;
    await EmailSenderHandlers
      .sendAnyEmail(link, `${req.body.firstName} ${req.body.lastName}`, req.body.email, verificationEmail);
    this.successResponse(this.res, created, signupSuccess, token, undefined);
  }

  /**
     * @param {object} req
     * @param {object} res
     * @returns {object} response to user
     */
    verifyUser = async (req, res) => {
      this.res = res;
      await UserService.updateOneBy({ isVerified: true }, { email: req.email });
      this.successResponse(this.res, ok, emailVerificationSuccess, undefined, undefined);
    }

    /**
     * @param {object} req
     * @param {object} res
     * @method
     * @returns {object} response to user
     * @description it sends an authentication token to user if they are authenticated
     */
  retrieveUser = async (req, res) => {
    this.res = res;
    const { gottenUser } = req;
    const userToSend = _.omit(gottenUser, 'password');
    this.successResponse(this.res, ok, undefined, generateToken(userToSend), undefined);
  }

  /**
     * @param {object} req
     * @param {object} res
     * @method
     * @returns {object} response to user
     * @description it sends an authentication token to user if they are authenticated
     */
  resendVerificationEmail = async (req, res) => {
    this.res = res;
    const { userRequestedResendVerificationEmail } = req;
    const userToSend = _.omit(userRequestedResendVerificationEmail, 'password');
    const token = generateToken(userToSend);
    const link = `/api/users/verify-user?token=${token}`;
    await EmailSenderHandlers
      .sendAnyEmail(link, `${userToSend.firstName} ${userToSend.lastName}`, userToSend.email, verificationEmail);
    this.successResponse(this.res, ok, verificationEmailResentSuccess, undefined, undefined);
  }

  /**
     * @param {object} req
     * @param {object} res
     * @method
     * @returns {object} response to user
     * @description it sends an authentication token to user if they are authenticated
     */
  passwordResetRequest = async (req, res) => {
    this.res = res;
    const { userFromDb } = req;
    const userToSend = _.omit(userFromDb, 'password');
    const token = generateToken(userToSend);
    const link = `/api/users/reset-password?token=${token}`;
    await EmailSenderHandlers
      .sendAnyEmail(link, `${userToSend.firstName} ${userToSend.lastName}`, userToSend.email, passwordResetRequestEmail);
    this.successResponse(this.res, ok, passwordResetRequestEmailSent, token, undefined);
  }

  /**
     * @param {object} req
     * @param {object} res
     * @method
     * @returns {object} response to user
     * @description it sends an authentication token to user if they are authenticated
     */
  passwordUpdate = async (req, res) => {
    this.res = res;
    const { userId, newPassword, user } = req;
    await UserService.updateOneBy({ password: newPassword }, { id: userId });
    const linkToLogin = '/api/users/login';
    await EmailSenderHandlers
      .sendAnyEmail(linkToLogin, `${user.firstName} ${user.lastName}`, user.email, passwordResetSuccessEmail);
    this.successResponse(this.res, ok, passwordResetSuccess, undefined, undefined);
  }
}
