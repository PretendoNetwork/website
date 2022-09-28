import joi from 'joi';

export interface LoggingConf {
  format: 'json' | 'pretty';
}

export const loggingConfSchema = joi.object({
  format: joi.string().valid('json', 'pretty').default('json'),
});
