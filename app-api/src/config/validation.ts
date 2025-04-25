import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'deployment')
    .default('development'),

  PORT: Joi.number().default(3001),

  // Twilio
  TWILIO_ACCOUNT_SID: Joi.string().required(),
  TWILIO_AUTH_TOKEN: Joi.string().required(),
  TWILIO_PHONE_NUMBER: Joi.string().required(),
  ALERT_PHONE_NUMBER: Joi.string().required(),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('3600s'),

  // Email
  EMAIL_USER: Joi.string().email().required(),
  EMAIL_PASS: Joi.string().required(),

  // Frontend URL
  FRONTEND_RESET_PASSWORD_URL: Joi.string().uri().required(),

  // Database
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(3306),
  DB_NAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
});
