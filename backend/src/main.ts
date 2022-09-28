import { config } from '@config';
import express from 'express';

async function bootstrap() {
  const app = express();
  await app.listen(config.server.port);
}

bootstrap().catch((err) => console.error(err));
