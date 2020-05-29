import ResponseHandlers from '../helpers/responseHandlers';
import UserService from '../services/user.service';
import statusCodes from '../helpers/statusCodes';
import customMessages from '../helpers/customMessages';
import { verifyPassword } from '../helpers/passwordHandlers';

const { badRequest, unAuthorized, notFound } = statusCodes;
const { userNotFound, emailOrUsernameRequired } = customMessages.errorMessages;
const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * @class
 * @classdesc this class contains all methods of validating login data
 */
class ValidatePasswordReset extends ResponseHandlers {
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
     * @param {object} next
     * @returns {object} next
     * @method
     * @description it allows to continue if data are correct and add found user to req object
     */
    passwordResetRequestValidate = async (req, res, next) => {
      this.res = res;
      const identifier = req.body.username ? req.body.username : req.body.email;
      if (identifier) {
        let foundUser;
        if (EMAIL_REGEX.test(identifier)) {
          foundUser = await UserService.getOneBy({ email: identifier });
        } else {
          foundUser = await UserService.getOneBy({ username: identifier });
        }
        if (foundUser) {
          req.userFromDb = foundUser.dataValues;
          next();
        } else {
          this.errorResponse(this.res, notFound, userNotFound);
        }
      } else {
        this.errorResponse(this.res, badRequest, emailOrUsernameRequired);
      }
    }
}

export default ValidatePasswordReset;
