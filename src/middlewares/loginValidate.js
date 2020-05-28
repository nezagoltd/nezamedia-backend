import { Op } from 'sequelize';
import Validators from '../validations/validators';
import UserService from '../services/user.service';
import statusCodes from '../helpers/statusCodes';
import customMessages from '../helpers/customMessages';
import { verifyPassword } from '../helpers/passwordHandlers';

const { badRequest, unAuthorized, forbidden } = statusCodes;
const { unkownCredentials, unVerifiedAccount } = customMessages.errorMessages;
const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * @class
 * @classdesc this class contains all methods of validating login data
 */
class ValidateLogin extends Validators {
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
    checkLoginCredentials = async (req, res, next) => {
      this.res = res;
      const { error } = this.validateUserLoginData(req.body);
      if (!error) {
        const identifier = req.body.username ? req.body.username : req.body.email;
        let foundUser;
        if (EMAIL_REGEX.test(identifier)) {
          foundUser = await UserService.getOneBy({ email: identifier });
        } else {
          foundUser = await UserService.getOneBy({ username: identifier });
        }

        if (foundUser) {
          const { dataValues } = foundUser;
          if (dataValues.isVerified) {
            const isPasswordValid = verifyPassword(req.body.password, dataValues.password);
            if (isPasswordValid) {
              req.gottenUser = dataValues;
              next();
            } else {
              this.errorResponse(this.res, unAuthorized, unkownCredentials);
            }
          } else {
            this.errorResponse(this.res, forbidden, unVerifiedAccount);
          }
        } else {
          this.errorResponse(this.res, unAuthorized, unkownCredentials);
        }
      }
      this.displayValidationErrorMessage(this, error, this.res, badRequest);
    }
}

export default ValidateLogin;
