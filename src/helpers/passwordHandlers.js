import bcrypt from 'bcrypt';

/**
 *
 * @param {string} password
 * @returns {string} hashedPassword
 * @function
 * @description it returns hashedPassword after hashing the passed password as argument
 */
export const hashPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(14));

/**
 * @param {string} currPswd
 * @param {string} dbPswd
 * @returns {boolean} true
 * @function
 * @description it returns true if password compare is successful otherwise it returns false
 */
export const verifyPassword = (currPswd, dbPswd) => bcrypt.compareSync(currPswd, dbPswd);
