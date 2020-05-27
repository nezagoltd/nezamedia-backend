import { Router } from 'express';
import UserController from '../../controllers/user.controller';
import ValidateSignup from '../../middlewares/signupValidate';
import ValidateUserVerification from '../../middlewares/verifyUserValidate';

const userRouter = Router();
const { saveNewUser, verifyUser } = new UserController();
const { validateSignupData } = new ValidateSignup();
const { validateVerifyUser } = new ValidateUserVerification();

userRouter.post('/signup', validateSignupData, saveNewUser);
userRouter.get('/verify-user', validateVerifyUser, verifyUser);

export default userRouter;
