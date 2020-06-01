import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieSession from 'cookie-session';
import passport from './passport/social.passport.config';
import allRoutes from './routes/index';
import nezamediaScheduler from './database/redis/taskerScheduler';

dotenv.config();

const { PORT } = process.env;
const server = express();

server.use(express.json());
server.use(morgan('combined'));
server.use(cookieSession({
  name: 'nezamediaSession',
  keys: ['key1'],
}));
server.use(passport.initialize());
server.use(passport.session());
server.use(allRoutes);

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`NezaMedia is running on port ${PORT}`);
  nezamediaScheduler.start();
});

export default server;
