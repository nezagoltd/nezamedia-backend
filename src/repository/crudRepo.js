import DataHelper from '../helpers/databaseHelper';

const { removeUnexpectedInput } = DataHelper;
/**
 * @description this class CrudRepository contains Create, Read, Update, methods which work with
 * database immediately, it can be extended or called from services, controllers, or routes
 */
export default class CrudRepository {
  /**
     * @param {object} model
     * @description returns the model name
     */
  constructor() {
    this.model = {};
    this.associateTable = [];
  }

  /**
     * @param {object} inputData
     * @returns {object} savedData
     * @description it returns the saved data
     */
  saveAll = async (inputData) => {
    const tableFields = Object.keys(this.model.rawAttributes);
    const acceptedSave = removeUnexpectedInput(tableFields, inputData);
    const savedData = await this.model.create(acceptedSave);
    return savedData;
  }
}
