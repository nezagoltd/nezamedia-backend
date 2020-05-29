import { Router } from 'express';
import UserController from '../../controllers/user.controller';
import ValidateSignup from '../../middlewares/signupValidate';
import ValidateUserVerification from '../../middlewares/verifyUserValidate';
import ValidateLogin from '../../middlewares/loginValidate';
import ValidatePasswordReset from '../../middlewares/resetPasswordValidate';

const userRouter = Router();
const {
  saveNewUser,
  verifyUser,
  retrieveUser,
  resendVerificationEmail,
  passwordResetRequest,
  passwordUpdate,
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

export default userRouter;
