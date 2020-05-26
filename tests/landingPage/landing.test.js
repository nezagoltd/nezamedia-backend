/* eslint-disable no-undef */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../src/app';
import customMessages from '../../src/helpers/customMessages';
import statusCodes from '../../src/helpers/statusCodes';

chai.use(chaiHttp);
const { ok } = statusCodes;
const { welcomeMessage, whatWedo } = customMessages.landingPageMessages;

describe('Welcome Route test cases', () => {
  it('Welcome route will return an object with message property', (done) => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(ok);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('landingPageMessages');
        expect(res.body.landingPageMessages).to.be.an('object');
        expect(res.body.landingPageMessages).to.have.property('welcomeMessage');
        expect(res.body.landingPageMessages).to.have.property('whatWedo');
        expect(res.body.landingPageMessages.welcomeMessage).to.equal(welcomeMessage);
        expect(res.body.landingPageMessages.whatWedo).to.equal(whatWedo);
        done();
      });
  });
});
