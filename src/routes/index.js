import { Router } from 'express';
import landingRoute from './api/landing.routes';

const allRoutes = Router();

allRoutes.use('/', landingRoute);

export default allRoutes;
