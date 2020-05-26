import { Op } from 'sequelize';
import Validators from '../validations/validators';
import UserService from '../services/user.service';
import statusCodes from '../helpers/statusCodes';
import customMessages from '../helpers/customMessages';

const { badRequest, conflict } = statusCodes;
const { userExistErr } = customMessages.errorMessages;
/**
 * @class
 * @classdesc it validate signup data
 */
class ValidateSignup extends Validators {
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
 * @description it allows to continue if the signup data are valid otherwise
 * it sends error response to user
 */
validateSignupData = async (req, res, next) => {
  this.res = res;
  const userData = req.body;
  const { error } = this.validateUserSignupOrUpdateData({ user: userData });
  if (!error) {
    const existingUser = await UserService.getOneBy({
      [Op.or]: [{ email: userData.email }, { username: userData.username }],
    });
    if (!existingUser) {
      next();
    } else {
      this.errorResponse(this.res, conflict, userExistErr);
    }
  } else {
    this.displayValidationErrorMessage(this, error, this.res, badRequest);
  }
};
}

export default ValidateSignup;
