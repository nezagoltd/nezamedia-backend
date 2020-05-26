import Joi from '@hapi/joi';
import customMessages from '../helpers/customMessages';
import { displayValidationErrorMessage, createValidationErrorMessage } from './validationRules';
import ResponseHandlers from '../helpers/responseHandlers';

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,15}$/;
const PLAIN_TEXT_REGEX = /^[^-\s][\w\s-]+$/;
const SEX_REGEX = /^Male$|^male$|^Female$|^female$/;
const USERNAME_REGEX = /^([a-zA-Z0-9@_.-]{3,})+$/;
const {
  firstnameErr,
  lastnameErr,
  usernameErr,
  emailErr,
  passwordErr,
  ageErr,
  sexErr,
  cityErr,
  countryErr,
  emailEmptyErr,
  passwordEmptyErr,
} = customMessages.errorMessages;

/**
 *@classdesc contains all of validations, means some data needs to have specific format
 *otherwise we show error
 */
class Validators extends ResponseHandlers {
  /**
   * @constructor
   */
  constructor() {
    super();
    this.res = {};
    this.displayValidationErrorMessage = displayValidationErrorMessage;
  }

  /**
   * @param {object} regex
   * @param {object} message
   * @param {object} isUpdate
   * @returns {object} string
   * @method
   * @description it returns the cleared string to validate
   */
  clearToValidate = (regex, message, isUpdate) => (isUpdate ? Joi.string().regex(regex).trim()
    .messages(createValidationErrorMessage('string', message)) : Joi.string().regex(regex).trim().required()
    .messages(createValidationErrorMessage('string', message)));

  /**
   * @param {object} userData
   * @returns {object} errorMessage
   * @description it takes userData and validate them, and after it returns the error messages
   * if something is wrong
   */
  validateUserSignupOrUpdateData = (userData) => {
    const { isUpdate, user } = userData;
    const schema = Joi.object({
      firstName: this.clearToValidate(PLAIN_TEXT_REGEX, firstnameErr, isUpdate),
      lastName: this.clearToValidate(PLAIN_TEXT_REGEX, lastnameErr, isUpdate),
      password: this.clearToValidate(PASSWORD_REGEX, passwordErr, isUpdate),
      email: this.clearToValidate(EMAIL_REGEX, emailErr, isUpdate),
      age: isUpdate ? Joi.number().messages(createValidationErrorMessage('string', ageErr))
        : Joi.number().required().messages(createValidationErrorMessage('string', ageErr)),
      sex: this.clearToValidate(SEX_REGEX, sexErr),
      username: this.clearToValidate(USERNAME_REGEX, usernameErr),
      city: this.clearToValidate(PLAIN_TEXT_REGEX, cityErr),
      country: this.clearToValidate(PLAIN_TEXT_REGEX, countryErr),
    });
    return schema.validate(user, { abortEarly: false, allowUnknown: true });
  }


  /**
   * @param {object} userData
   * @returns {object} errors
   * @method
   * @description it returns error if there are any
   */
  validateUserLoginData = (userData) => {
    const schema = Joi.object({
      email: Joi.string().required().messages(createValidationErrorMessage('string', emailEmptyErr)),
      password: Joi.string().required().messages(createValidationErrorMessage('string', passwordEmptyErr)),
    });
    return schema.validate(userData, { abortEarly: false, allowUnknown: false });
  }
}

export default Validators;
