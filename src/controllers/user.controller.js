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
  signupSuccess, emailVerificationSuccess,
} = customMessages.successMessages;

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
    await EmailSenderHandlers
      .sendEmailVerification(token, `${req.body.firstName} ${req.body.lastName}`, req.body.email);
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
}
