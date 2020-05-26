/**
 * @class
 * @classdesc it contains methods of handle successResponse and error response
 */
class ResponseHandlers {
  /**
       * @method
       */
  constructor() {
    this.res = {};
  }

    /**
   * @param {object} res
   * @param {integer} code
   * @param {string} message
   * @param {string} token
   * @param {object} data
   * @returns {object} response
   * @description Returns a successful response
   */
    successResponse = (res, code, message, token, data) => res.status(code)
      .json({ message, token, data });

    /**
   * @param {object} res response object
   * @param {integer} code status code
   * @param {string} error error message
   * @returns {object} response json object
   * @description Returns an error response
   */
  errorResponse = (res, code, error) => res.status(code).json({ error });
}

export default ResponseHandlers;
