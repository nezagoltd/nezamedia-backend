import { Router } from 'express';
import UserController from '../../controllers/user.controller';
import ValidateSignup from '../../middlewares/signupValidate';

const userRouter = Router();
const { saveNewUser } = new UserController();
const { validateSignupData } = new ValidateSignup();

userRouter.post('/signup', validateSignupData, saveNewUser);

export default userRouter;
