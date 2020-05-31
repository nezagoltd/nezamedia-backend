/* eslint-disable camelcase */
import passport from 'passport';
import dotenv from 'dotenv';
import facebookStrategy from 'passport-facebook';
import googleStrategy from 'passport-google-oauth2';
import UserService from '../services/user.service';

dotenv.config();

const FacebookStrategy = facebookStrategy.Strategy;
const GoogleStrategy = googleStrategy.Strategy;
const {
  NEZAMEDIA_FCBK_APP_ID,
  NEZAMEDIA_FCBK_APP_SECRET,
  NEZAMEDIA_FCBK_CALLBACK_URL,
  NEZAMEDIA_GOOGLE_CLIENT_ID,
  NEZAMEDIA_GOOGLE_CLIENT_SECRET,
  NEZAMEDIA_GOOGLE_CALLBACK_URL,
} = process.env;

/**
 * @param{*} accessToken
 * @param{*} refreshToken
 * @param{*} user
 * @param{*} cb
 * @returns{*} user
 */
export const fcbkCallback = async (accessToken, refreshToken, user, cb) => {
  const {
    id, last_name, first_name, provider,
  } = user;
  const username = `${last_name}-${first_name}-${id}`;
  const userToSave = {
    socialMediaId: id,
    username,
    provider,
    email: `${username}@nezamedia.neza`,
    firstName: first_name,
    lastName: last_name,
    isVerified: true,
  };
  const savedUserInDb = await UserService.getOneOrCreateOne(userToSave, { socialMediaId: id });
  const { dataValues } = savedUserInDb[0];
  const userFromDb = dataValues;
  return cb(null, userFromDb);
};

/**
 * @param{*} request
 * @param{*} accessToken
 * @param{*} refreshToken
 * @param{*} profile
 * @param{*} cb
 * @returns{*} user
 */
export const googleCallback = async (request, accessToken, refreshToken, profile, cb) => {
  const {
    id, email, given_name, family_name,
  } = profile;
  const userToSave = {
    socialMediaId: id,
    username: email,
    provider: 'google',
    email,
    firstName: given_name,
    lastName: family_name,
    isVerified: true,
  };
  const savedUserInDb = await UserService.getOneOrCreateOne(userToSave, { socialMediaId: id });
  const { dataValues } = savedUserInDb[0];
  const userFromDb = dataValues;
  return cb(null, userFromDb);
};

// facebook
passport.use(new FacebookStrategy(
  {
    clientID: NEZAMEDIA_FCBK_APP_ID,
    clientSecret: NEZAMEDIA_FCBK_APP_SECRET,
    callbackURL: NEZAMEDIA_FCBK_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name'],
  },
  fcbkCallback,
));

//  google
passport.use(new GoogleStrategy(
  {
    clientID: NEZAMEDIA_GOOGLE_CLIENT_ID,
    clientSecret: NEZAMEDIA_GOOGLE_CLIENT_SECRET,
    callbackURL: NEZAMEDIA_GOOGLE_CALLBACK_URL,
    passReqToCallback: true,
    profileFields: ['id', 'displayName', 'email', 'given_name', 'family_name'],
  },
  googleCallback,
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

export default passport;
