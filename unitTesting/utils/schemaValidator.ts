import Joi from "joi";

export const validate = (toValidate: unknown, schema: Joi.Schema): void => {
  const { error } = schema.validate(toValidate, {
    abortEarly: false,
  });
  if (error) {
    throw error;
  }
};
