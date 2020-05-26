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

  /**
   * @param {object} whereCondition
   * @returns {object} foundRes
   * @method
   * @description it gets whereCondition which should be an object containing the attribute of the
   * table and its value, example if you want to get by phoneNumber, ypu will pass the
   * whereCondition as this {phoneNumber:"+250722792371"} then it returns the object containing a
   * user with that phoneNumber
   */
  getOneBy = async (whereCondition) => {
    const inclusion = this.associateTable.map((table => ({ model: table })));
    const foundRes = await this.model.findOne({ where: whereCondition, include: inclusion });
    return foundRes;
  }
}
