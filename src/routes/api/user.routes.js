import { Router } from 'express';
import UserController from '../../controllers/user.controller';
import ValidateSignup from '../../middlewares/signupValidate';
import ValidateUserVerification from '../../middlewares/verifyUserValidate';
import ValidateLogin from '../../middlewares/loginValidate';
import ValidatePasswordReset from '../../middlewares/resetPasswordValidate';
import passport from '../../passport/social.passport.config';

const userRouter = Router();
const {
  saveNewUser,
  verifyUser,
  retrieveUser,
  resendVerificationEmail,
  passwordResetRequest,
  passwordUpdate, loginWithFacebook,
} = new UserController();
const { validateSignupData } = new ValidateSignup();
const {
  validateVerifyUser,
  validateResendVerificationEMail,
} = new ValidateUserVerification();
const { checkLoginCredentials } = new ValidateLogin();
const { passwordResetRequestValidate, passwordUpdateValidate } = new ValidatePasswordReset();

userRouter.post('/signup', validateSignupData, saveNewUser);
userRouter.get('/verify-user', validateVerifyUser, verifyUser);
userRouter.get('/resend-verification-email', validateResendVerificationEMail, resendVerificationEmail);
userRouter.post('/login', checkLoginCredentials, retrieveUser);
userRouter.post('/reset-password-request', passwordResetRequestValidate, passwordResetRequest);
userRouter.patch('/reset-password/:token', passwordUpdateValidate, passwordUpdate);

// login with social media
userRouter.get('/facebook', passport.authenticate('facebook'));
userRouter.get('/login-facebook', passport.authenticate('facebook',
  {
    session: false,
    successRedirect: '/',
    failureRedirect: '/',
  }));

userRouter.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
userRouter.get('/login-google', passport.authenticate('google', {
  scope: ['email', 'profile'],
  session: false,
  successRedirect: '/',
  failureRedirect: '/',
}));

export default userRouter;
