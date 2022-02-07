/** Core Nodejs dependencies */
const path = require('path');


/** Third party dependencies */
const Joi = require('joi');

const dotenv = require('dotenv');


/** Application static objects */
const bullConfig = require('./bull');

const {
  appConfig: {
    defaultEnvironment,
    allowedEnvironments
  }
} = require('./appConfig');

const { statics } = require('../config');


const nodeEnvValidator = Joi.string()
  .allow(...allowedEnvironments)
  .default(defaultEnvironment);

const currentEnvironment = process.NODE_ENV || defaultEnvironment;

// require and configure dotenv, will load vars in .env.* file in PROCESS.ENV
const envFilePath = path.resolve(__dirname, '..', '..', `.env.${currentEnvironment}`);

const {
  error: envFileError,
  parsed: parsedEnvVars,
} = dotenv.config({ path: envFilePath });

/** Throwing error if incorrect file is not */
if (envFileError)
  throw new Error(`Environment file config error: ${envFileError}`);

const envValidator = Joi.object(
  {
    NODE_ENV: nodeEnvValidator,
    PORT: Joi.number()
      .default(4040),
    API_BASE: Joi.string().default('/api'),
    MONGOOSE_DEBUG: Joi.boolean()
      .when('NODE_ENV', {
        is: Joi.string().equal('development'),
        then: Joi.boolean().default(true),
        otherwise: Joi.boolean().default(false),
      }),
    JWT_SECRET: Joi.string().required()
      .description('JWT Secret required to sign'),
    JWT_EXPIRES_IN: Joi.number().default(1440)
      .description('JWT expiration time in seconds'),
    SALT_ROUNDS: Joi.number().required(),
    FORGOT_EXPIRY: Joi.number().required(),
    MONGO_HOST: Joi.string().required()
      .description('Mongo DB host url'),
    MONGO_PORT: Joi.number()
      .default(27017),
    SOCKET_IO_REDIS_PORT: Joi.number(),
    REDIS_DB_NO: Joi.number(),
    SEED: Joi.boolean().default(false),
  }
)
  .unknown()
  .required()


// validating current environemnt
const { error: envError, value } = envValidator.validate(
  parsedEnvVars
);

/** Throwing error if incorrect environment file is provided */
if (envError)
  throw new Error(`Environment validation error: ${envError.message}`);


const config = {
  ...parsedEnvVars,
  bullConfig
};


module.exports = config;
