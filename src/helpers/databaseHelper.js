/**
 * @description it contains all static methods to help in data proper arrangement
 */
export default class DataHelperClass {
    /**
     *@param {object} expectedInput
     *@param {object} givenInput
     *@returns {object} filteredInput
     *@description {object} it filters the passed input from the frontend to avoid
     * unnecessary passed data which may be sent by attackers to break the system
     */
    static removeUnexpectedInput = (expectedInput, givenInput) => {
      const inputKeys = Object.keys(givenInput);
      const filteredInputs = {};

      inputKeys.forEach((currKey) => {
        if (expectedInput.includes(currKey)) {
          filteredInputs[currKey] = givenInput[currKey];
        }
      });

      return filteredInputs;
    }
}
