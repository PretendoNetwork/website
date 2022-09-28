import joi from 'joi';

export interface ServerConf {
  port: number;
  basePath: string;
  host: string; // url to access (without base path) (do not end with slash)
}

const notEndWithSlashRegex = /[^/]$/;

export const serverConfSchema = joi.object<ServerConf>({
  port: joi.number().default(8080),
  basePath: joi.string().default('/'),
  host: joi.string().regex(notEndWithSlashRegex).required(),
});
