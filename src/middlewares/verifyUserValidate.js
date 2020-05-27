import UserService from '../services/user.service';
import statusCodes from '../helpers/statusCodes';
import customMessages from '../helpers/customMessages';
import ResponseHandlers from '../helpers/responseHandlers';
import { verifyToken } from '../helpers/tokenHandlers';

const { badRequest, notFound } = statusCodes;
const { tokenEmptyErr, userNotFound, userAlreadyVerified } = customMessages.errorMessages;
/**
 * @class
 * @classdesc it validate signup data
 */
class ValidateUserVerification extends ResponseHandlers {
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
validateVerifyUser = async (req, res, next) => {
  this.res = res;
  const token = req.query;

  if (token) {
    try {
      const decodedToken = verifyToken(token.token);
      const userFromDb = await UserService.getOneBy({ email: decodedToken.email });
      if (userFromDb) {
        const { dataValues } = userFromDb;
        if (dataValues.isVerified) {
          this.errorResponse(this.res, badRequest, userAlreadyVerified);
        } else {
          req.email = decodedToken.email;
          next();
        }
      } else {
        this.errorResponse(this.res, notFound, userNotFound);
      }
    } catch (err) {
      this.errorResponse(this.res, badRequest, err);
    }
  } else {
    this.errorResponse(this.res, badRequest, tokenEmptyErr);
  }
};
}

export default ValidateUserVerification;
