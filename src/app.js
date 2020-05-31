import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import passport from './passport/social.passport.config';
import allRoutes from './routes/index';

dotenv.config();

const { PORT } = process.env;
const server = express();

server.use(express.json());
// server.use(morgan('combined'));
server.use(passport.initialize());
server.use(allRoutes);

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`NezaMedia is running on port ${PORT}`);
});

export default server;
