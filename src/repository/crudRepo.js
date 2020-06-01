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
   * @param{object} data
   * @param{object} whereCondition
   * @returns{object} userFromDb
   * @description it tries to fin a user from db, if he/she does not exist, it creates hime/her
   */
  getOneOrCreateOne=async (data, whereCondition) => {
    const tableFields = Object.keys(this.model.rawAttributes);
    const acceptedSave = removeUnexpectedInput(tableFields, data);
    const userFromDb = await this.model.findOrCreate({
      defaults: acceptedSave, where: whereCondition,
    });
    return userFromDb;
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

  /**
   * @param {object} dataToUpdate
   * @param {object} whereCondition
   * @returns {object} updatedData
   * @method
   * @description it gets the data to update as argument and where condition and it returns the
   * updated data
   */
  updateOneBy = async (dataToUpdate, whereCondition) => {
    const tableFields = Object.keys(this.model.rawAttributes);
    const validDataToUpdate = removeUnexpectedInput(tableFields, dataToUpdate);
    const updatedData = await this.model.update(validDataToUpdate, {
      where: whereCondition, returning: true,
    });
    return updatedData;
  }
}
