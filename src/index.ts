import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, json, urlencoded } from 'express';
import favicon from 'serve-favicon';

import router from './routes/v1/index';
import prisma from './prismaClient';

const app: Express = express();

dotenv.config();

const port = process.env.PORT || 8080;
//const clientUrl = process.env.CLIENT_URL;

app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(urlencoded({ extended: true }));

app.use(cors());

// const options: cors.CorsOptions = {
//   origin: clientUrl
// };
//
// app.use(cors(options));

app.options('*', cors());

app.use(json());

//all routes are prefixed with /v1
app.use(router);

//connect to the database and start the server
void prisma.$connect().then(() => {
  console.info('Connected to SQL Database');
  app.listen(port, () => {
    console.info(`Listening to port http://localhost:${port}`);
  });
});
