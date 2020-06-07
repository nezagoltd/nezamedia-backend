/* eslint-disable no-undef */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../src/app';
import customMessages from '../../src/helpers/customMessages';
import statusCodes from '../../src/helpers/statusCodes';
import mockData from '../data/userMockData';
import taskScheduler from '../../src/database/redis/taskScheduler';
import redisClient from '../../src/database/redis/redis.config';
import BackgroundTasks from '../../src/database/redis/backgroundServices';

chai.use(chaiHttp);

const {
  badRequest,
  conflict,
  created, ok,
  unAuthorized,
  forbidden, notFound,
} = statusCodes;
const {
  signupSuccess,
  emailVerificationSuccess,
  verificationEmailResentSuccess,
  passwordResetRequestEmailSent,
  passwordResetSuccess,
} = customMessages.successMessages;
const {
  emailErr,
  usernameErr,
  userExistErr,
  userAlreadyVerified,
  tokenEmptyErr,
  unkownCredentials,
  unVerifiedAccount,
  passwordEmptyErr,
  userAlreadyVerifiedWhileAskedForLinkResend,
  userNotFound,
  emailOrUsernameRequired,
  resetPasswordLinkExpired,
  passwordErr,
  tokenMissingOrInvalidErrorMsg,
} = customMessages.errorMessages;
const {
  signupValidData,
  signupEmptyEmail,
  signupEmptyUsername,
  signupValidDataWithUnnecessaryData,
} = mockData.signupData;

const { fakeToken } = mockData.verifyAccountData;
const { expiredToken } = mockData;
const { expiredTokenCleanUp } = BackgroundTasks;
const { loginVerifiedAcc } = mockData.loginData;

let userToken;
let resetPasswordToken;
let tokenNotVerifiedAccount;

describe('Signup tests', () => {
  it('Will create a new user, expect it to return an object with status code of 201, and response body containing a token', (done) => {
    chai.request(server)
      .post('/api/users/signup')
      .set('Accept', 'Application/json')
      .send(signupValidData)
      .end((err, res) => {
        if (err) done(err);
        userToken = res.body.token;
        expect(res).to.have.status(created);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('token').to.be.a('string');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal(signupSuccess);
        done();
      });
  });

  it('Will create a new user when we send some unneccessary data, expect it to return an object with status code of 201, and response body containing a token', (done) => {
    chai.request(server)
      .post('/api/users/signup')
      .set('Accept', 'Application/json')
      .send(signupValidDataWithUnnecessaryData)
      .end((err, res) => {
        if (err) done(err);
        tokenNotVerifiedAccount = res.body.token;
        expect(res).to.have.status(created);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('token').to.be.a('string');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal(signupSuccess);
        done();
      });
  });
  it('Will fail to create a user because this user exists, expect it to return an object with status code of 409', (done) => {
    chai.request(server)
      .post('/api/users/signup')
      .set('Accept', 'Application/json')
      .send(signupValidData)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(conflict);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(userExistErr);
        done();
      });
  });
  it('Will fail to create a user because email is absent, expect it to return an object with status code of 400,', (done) => {
    chai.request(server)
      .post('/api/users/signup')
      .set('Accept', 'Application/json')
      .send(signupEmptyEmail)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(badRequest);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(emailErr);
        done();
      });
  });
  it('Will fail to create a user because username is absent, expect it to return an object with status code of 400,', (done) => {
    chai.request(server)
      .post('/api/users/signup')
      .set('Accept', 'Application/json')
      .send(signupEmptyUsername)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(badRequest);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(usernameErr);
        done();
      });
  });
});

describe('User verfication', () => {
  it('Will verify a user', (done) => {
    chai.request(server)
      .get(`/api/users/verify-user?token=${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(ok);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal(emailVerificationSuccess);
        done();
      });
  });
  it('Will not verify a user twice', (done) => {
    chai.request(server)
      .get(`/api/users/verify-user?token=${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(badRequest);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(userAlreadyVerified);
        done();
      });
  });
  it('Will not verify a user, because there is no token sent', (done) => {
    chai.request(server)
      .get('/api/users/verify-user')
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(badRequest);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(tokenEmptyErr);
        done();
      });
  });
  it('Will not verify a user, because there is no token sent', (done) => {
    chai.request(server)
      .get(`/api/users/verify-user?token=${fakeToken}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(badRequest);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        done();
      });
  });
});

describe('Login tests', () => {
  it('Will login a verified user using email to login', (done) => {
    chai.request(server)
      .post('/api/users/login')
      .send(loginVerifiedAcc)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(ok);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('token');
        expect(res.body.token).to.be.a('string');
        done();
      });
  });
  it('Will login a verified user using username to login', (done) => {
    chai.request(server)
      .post('/api/users/login')
      .send({ username: signupValidData.username, password: signupValidData.password })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(ok);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('token');
        expect(res.body.token).to.be.a('string');
        done();
      });
  });
  it('Will not login the user because the username and password do not match at all', (done) => {
    chai.request(server)
      .post('/api/users/login')
      .send({ username: signupValidData.username, password: 'signupValidData.password' })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(unAuthorized);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(unkownCredentials);
        done();
      });
  });
  it('Will not login a user because the account trying to login is not verified yet', (done) => {
    chai.request(server)
      .post('/api/users/login')
      .send({
        email: signupValidDataWithUnnecessaryData.email,
        password: signupValidDataWithUnnecessaryData.password,
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(forbidden);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(unVerifiedAccount);
        done();
      });
  });
  it('Will not login a user because the username sent does not exist', (done) => {
    chai.request(server)
      .post('/api/users/login')
      .send({
        username: 'signupValidDataWithUnnecessaryDataemail',
        password: signupValidDataWithUnnecessaryData.password,
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(unAuthorized);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(unkownCredentials);
        done();
      });
  });
  it('Will not login a user because the password is missing', (done) => {
    chai.request(server)
      .post('/api/users/login')
      .send({
        username: 'signupValidDataWithUnnecessaryDataemail',
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(badRequest);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(passwordEmptyErr);
        done();
      });
  });
});

describe('Resend verification email tests', () => {
  it('Will resend a verification email', (done) => {
    chai.request(server)
      .get(`/api/users/resend-verification-email?email=${signupValidDataWithUnnecessaryData.email}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(ok);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal(verificationEmailResentSuccess);
        done();
      });
  });
  it('Will not resend a verification email because the email is empty', (done) => {
    chai.request(server)
      .get('/api/users/resend-verification-email')
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(badRequest);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(emailErr);
        done();
      });
  });
  it('Will not resend a verification email because the user is already verified', (done) => {
    chai.request(server)
      .get(`/api/users/resend-verification-email?email=${signupValidData.email}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(badRequest);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(userAlreadyVerifiedWhileAskedForLinkResend);
        done();
      });
  });
  it('Will not resend a verification email because the user is already verified', (done) => {
    chai.request(server)
      .get('/api/users/resend-verification-email?email=cool@neza.com')
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(notFound);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(userNotFound);
        done();
      });
  });
});

describe('Reset Password tests', () => {
  it('Will request the reset password, using email', (done) => {
    chai.request(server)
      .post('/api/users/reset-password-request')
      .send({ email: signupValidData.email })
      .end((err, res) => {
        if (err) done(err);
        resetPasswordToken = res.body.token;
        expect(res).to.have.status(ok);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('token');
        expect(res.body.token).to.be.a('string');
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal(passwordResetRequestEmailSent);
        done();
      });
  });
  it('Will request the reset password, using username', (done) => {
    chai.request(server)
      .post('/api/users/reset-password-request')
      .send({ email: signupValidData.username })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(ok);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal(passwordResetRequestEmailSent);
        done();
      });
  });
  it('Will not request the reset password, because user does not exist', (done) => {
    chai.request(server)
      .post('/api/users/reset-password-request')
      .send({ email: 'cool@neza.nez' })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(notFound);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(userNotFound);
        done();
      });
  });
  it('Will not request the reset password, because email is not sent', (done) => {
    chai.request(server)
      .post('/api/users/reset-password-request')
      .send({ })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(badRequest);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(emailOrUsernameRequired);
        done();
      });
  });

  it('Will reset password,', (done) => {
    chai.request(server)
      .patch(`/api/users/reset-password/${resetPasswordToken}`)
      .send({ password: 'Nezamedia1.' })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(ok);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal(passwordResetSuccess);
        done();
      });
  });

  it('Will reset password,', (done) => {
    chai.request(server)
      .patch(`/api/users/reset-password/${resetPasswordToken}`)
      .send({ password: '1111111' })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(badRequest);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(passwordErr);
        done();
      });
  });

  it('Will not reset password, because we sent a fake token', (done) => {
    chai.request(server)
      .patch(`/api/users/reset-password/${fakeToken}`)
      .send({ password: 'nezaMedia2@' })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(badRequest);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(resetPasswordLinkExpired);
        done();
      });
  });
});

describe('Logout tests', () => {
  it('Will logout a logged in user', (done) => {
    chai.request(server)
      .get('/api/users/logout')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(ok);
        done();
      });
  });
  it('Will not logout a user, because the token sent is already logged out', (done) => {
    chai.request(server)
      .get('/api/users/logout')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(unAuthorized);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(tokenMissingOrInvalidErrorMsg);
        done();
      });
  });
  it('Will not logout because there is no token sent', (done) => {
    chai.request(server)
      .get('/api/users/logout')
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(unAuthorized);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(tokenMissingOrInvalidErrorMsg);
        done();
      });
  });
  it('Will not logout because the token is invalid', (done) => {
    chai.request(server)
      .get('/api/users/logout')
      .set('Authorization', `Bearer ${fakeToken}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(unAuthorized);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(tokenMissingOrInvalidErrorMsg);
        done();
      });
  });
  it('Will not logout because the account is not verified', (done) => {
    chai.request(server)
      .get('/api/users/logout')
      .set('Authorization', `Bearer ${tokenNotVerifiedAccount}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(unAuthorized);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(unVerifiedAccount);
        done();
      });
  });
});

describe('Testing cron jobs for background tasks (token)', () => {
  it('Will start the scheduler', async () => {
    taskScheduler.start();
  });
  before(() => {
    redisClient.sadd('token', expiredToken);
  });
  it('Should remove expired tokens if any', async () => {
    await expiredTokenCleanUp();
  });
});
