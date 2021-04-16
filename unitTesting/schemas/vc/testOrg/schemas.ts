import Joi from "joi";

export const template1 = Joi.object({
  "@context": Joi.array().items(Joi.string().uri()).required(),
  type: Joi.array().items(Joi.string()).required(),
  id: Joi.string().required(),
  issuer: Joi.string().required(),
  credentialSubject: Joi.object({
    type: Joi.string().required(),
    id: Joi.string().required(),
    givenName: Joi.string().required(),
    additionalName: Joi.string(),
    familyName: Joi.string().required(),
  }),
});

export const template2 = Joi.object({
  "@context": Joi.array().items(Joi.string().uri()).required(),
  type: Joi.array().items(Joi.string()).required(),
  id: Joi.string().required(),
  issuer: Joi.string().required(),
  credentialSubject: Joi.object({
    type: Joi.string().required(),
    id: Joi.string().required(),
    givenName: Joi.string().required(),
    familyName: Joi.string().required(),
  }),
});
