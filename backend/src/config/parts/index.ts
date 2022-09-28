import joi from 'joi';
import { LoggingConf, loggingConfSchema } from './logging';
import { ServerConf, serverConfSchema } from './server';

export interface Config {
  server: ServerConf;
  logging: LoggingConf;
}

export const configSchema = joi.object<Config>({
  server: serverConfSchema.default(),
  logging: loggingConfSchema.default(),
});
