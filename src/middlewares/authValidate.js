import { verifyToken } from '../helpers/tokenHandlers';
import ResponseHandlers from '../helpers/responseHandlers';
import statusCodes from '../helpers/statusCodes';
import customMessages from '../helpers/customMessages';
import UserService from '../services/user.service';

const { unAuthorized, forbidden } = statusCodes;
const { tokenMissingOrInvalidErrorMsg, unVerifiedAccount } = customMessages.errorMessages;

/**
 * @class
 * @classdesc it holds all of auth validation methods
 */
class ValidateAuth extends ResponseHandlers {
  /**
     * @constructor
     */
  constructor() {
    super();
    this.res = {};
  }

  /**
 *
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} next
 * @function
 * @description it allows user to continue if a user is authenticated and verified
 */
    isUserLoggedInAndVerified = async (req, res, next) => {
      this.res = res;
      let token = req.get('authorization');
      if (!token) {
        return this.errorResponse(this.res, unAuthorized, tokenMissingOrInvalidErrorMsg);
      }
      token = token.split(' ').pop();
      try {
        const decodedToken = verifyToken(token);
        const requestingUser = await UserService.getOneBy({ id: decodedToken.id });
        if (requestingUser) {
          const { dataValues } = requestingUser;
          if (dataValues.isVerified) {
            req.sessionUser = dataValues;
            return next();
          }
          return this.errorResponse(this.res, forbidden, unVerifiedAccount);
        }
        return this.errorResponse(this.res, unAuthorized, tokenMissingOrInvalidErrorMsg);
      } catch (err) {
        return this.errorResponse(this.res, unAuthorized, tokenMissingOrInvalidErrorMsg);
      }
    };
}

export default ValidateAuth;
