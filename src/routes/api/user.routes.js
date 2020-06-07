import { Router } from 'express';
import UserController from '../../controllers/user.controller';
import ValidateSignup from '../../middlewares/signupValidate';
import ValidateUserVerification from '../../middlewares/verifyUserValidate';
import ValidateLogin from '../../middlewares/loginValidate';
import ValidatePasswordReset from '../../middlewares/resetPasswordValidate';
import passport from '../../passport/social.passport.config';
import ValidateAuth from '../../middlewares/authValidate';

const userRouter = Router();
const {
  saveNewUser,
  verifyUser,
  retrieveUser,
  resendVerificationEmail,
  passwordResetRequest,
  passwordUpdate,
  userLogout,
} = new UserController();
const { validateSignupData } = new ValidateSignup();
const {
  validateVerifyUser,
  validateResendVerificationEMail,
} = new ValidateUserVerification();
const { checkLoginCredentials } = new ValidateLogin();
const { passwordResetRequestValidate, passwordUpdateValidate } = new ValidatePasswordReset();
const { isUserLoggedInAndVerified } = new ValidateAuth();

userRouter.post('/signup', validateSignupData, saveNewUser);
userRouter.get('/verify-user', validateVerifyUser, verifyUser);
userRouter.get('/resend-verification-email', validateResendVerificationEMail, resendVerificationEmail);
userRouter.post('/login', checkLoginCredentials, retrieveUser);
userRouter.post('/reset-password-request', passwordResetRequestValidate, passwordResetRequest);
userRouter.patch('/reset-password/:token', passwordUpdateValidate, passwordUpdate);
userRouter.get('/logout', isUserLoggedInAndVerified, userLogout);

// login with social media
userRouter.get('/facebook', passport.authenticate('facebook'));
userRouter.get('/login-facebook', passport.authenticate('facebook',
  {
    session: true,
    successRedirect: '/',
    failureRedirect: '/',
  }));

userRouter.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
userRouter.get('/login-google', passport.authenticate('google', {
  scope: ['email', 'profile'],
  session: true,
  successRedirect: '/',
  failureRedirect: '/',
}));

export default userRouter;
