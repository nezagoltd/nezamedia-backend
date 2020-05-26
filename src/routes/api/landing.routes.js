import { Router } from 'express';
import customMessages from '../../helpers/customMessages';
import statusCode from '../../helpers/statusCodes';

const landingRoute = Router();
const { welcomeMessage } = customMessages;
const { ok } = statusCode;

landingRoute.get('/', (req, res) => {
  res.status(ok).json({ message: welcomeMessage });
});

export default landingRoute;
