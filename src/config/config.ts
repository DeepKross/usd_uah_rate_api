import dotenv from 'dotenv';
import Joi, { ValidationResult } from 'joi';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().valid('production', 'development', 'test').default('development'),
  PORT: Joi.number().default(8080)
}).unknown();

type EnvVars = {
  NODE_ENV: 'production' | 'development' | 'test';
  PORT: number;
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { value: envVars, error }: ValidationResult = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Type assertion to ensure envVars has the expected shape
const validatedEnvVars = envVars as EnvVars;

interface Config {
  env: 'production' | 'development' | 'test';
  port: number;
}

const config: Config = {
  env: validatedEnvVars.NODE_ENV,
  port: validatedEnvVars.PORT
};

export default config;
