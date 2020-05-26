import { Router } from 'express';
import landingRoute from './api/landing.routes';
import apiRouter from './api/index';

const allRoutes = Router();

allRoutes.use('/', landingRoute);
allRoutes.use('/api', apiRouter);

export default allRoutes;
