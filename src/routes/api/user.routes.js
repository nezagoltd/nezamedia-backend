import { Router } from 'express';
import UserController from '../../controllers/user.controller';

const userRouter = Router();
const { saveNewUser } = new UserController();

userRouter.post('/signup', saveNewUser);

export default userRouter;
