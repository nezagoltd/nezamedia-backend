/**
    * @param {object} fieldDataType data type for the field
    * @param {object} errorMessage error message to display
    * @returns {object} validationErrorMessage
    * @description it returns an object of validation error messages
    */
export const createValidationErrorMessage = (fieldDataType, errorMessage) => ({
  [`${fieldDataType}.base`]: errorMessage,
  [`${fieldDataType}.pattern.base`]: errorMessage,
  [`${fieldDataType}.empty`]: errorMessage,
  [`${fieldDataType}.min`]: errorMessage,
  [`${fieldDataType}.max`]: errorMessage,
  [`${fieldDataType}.format`]: errorMessage,
  [`${fieldDataType}.less`]: errorMessage,
  [`${fieldDataType}.greater`]: errorMessage,
  'any.required': errorMessage,
  'any.only': errorMessage,
});

/**
      * @param {object} currClass
       * @param {object} error
       * @param {object} res
       * @param {integer} statusCode
       * @returns {object} next
       * @description it displays validation error message if there are any
       * it takes the following arguments :
       * ===>currClass = currentClass which will be referred as this keyword
       * ===>error = which will be an object containing the details array,
       *     that details array is the one which will be used to get the errors we want to display
       * ===>res = response, this is the initialize response from the class constructor,
       *    don't use the direct one from the middleware nor from the controller,
       *    for the sake of just to be uniform
       * ===>statusCode = which is the response status code, means 400, 401, 403, 404, 409 etc ...
       */
export const displayValidationErrorMessage = (currClass, error, res, statusCode) => {
  if (error) {
    const { details } = error;
    const messages = details.map((err) => err.message.replace(/['"]/g, '')).join(', ');
    currClass.errorResponse(res, statusCode, messages);
  }
};
