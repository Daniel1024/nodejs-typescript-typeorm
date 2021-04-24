import "reflect-metadata";
import * as express from "express";
import * as cors from 'cors';
import * as helmet from 'helmet';
import { createConnection } from 'typeorm';
import routes from './routes';

const PORT = process.env.APP_PORT || 3000;

async function bootstrap() {
  await createConnection();

  // create express app
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(helmet());

  app.use(express.json());

  app.use('/', routes);

  // start express server
  app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`));
}

bootstrap()
  .catch(error => console.log(error));
