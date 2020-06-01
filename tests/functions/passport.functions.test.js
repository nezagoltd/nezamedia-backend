/* eslint-disable no-undef */
import { expect } from 'chai';
import { fcbkCallback, googleCallback } from '../../src/passport/social.passport.config';
import mockData from '../data/userMockData';

const { fcbkUser, googleUser } = mockData.passportData;
/**
   * @param {object} error
   * @param {object} data
   * @returns {object} response json object
   */
const cb = (error, data) => data;

describe('Passport functions', () => {
  it('google callback function', async () => {
    const result = await googleCallback({ request: 'request' }, 'token', 'retoken', googleUser, cb);
    expect(result).to.be.a('string');
  });
  it('facebook callback function', async () => {
    const result = await fcbkCallback('token', 'retoken', fcbkUser, cb);
    expect(result).to.be.a('string');
  });
});
