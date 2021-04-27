import "reflect-metadata";
import * as express from "express";
import * as cors from 'cors';
import * as helmet from 'helmet';
import { Connection, createConnection } from 'typeorm';
import routes from './routes';
import { UserEntity } from './entities';

const PORT = process.env.APP_PORT || 3000;

async function registerUser({ manager }: Connection): Promise<void> {
  const users = await manager.find(UserEntity);
  if (users.length === 0) {
    const user = new UserEntity();
    user.username = 'daniel1';
    user.password = '12345678';
    user.role = 'admin';
    await manager.save(user);
  }
}

async function bootstrap() {
  let retries = 5;
  while (retries) {
    try {
      const connection = await createConnection();
      registerUser(connection);
      break;
    } catch (err) {
      retries -= 1;
      console.log(`retries left: ${ retries }`);
      // wait 5 seconds
      await new Promise((res) => setTimeout(res, 5000));
    }
  }

  // create express app
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(helmet());

  app.use(express.json());

  app.use('/', routes);

  // start express server
  app.listen(PORT, () => console.log(`Example app listening at http://localhost:${ PORT }`));
}

bootstrap()
  .catch(error => console.log(error));
