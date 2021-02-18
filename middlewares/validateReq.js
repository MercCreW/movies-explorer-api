const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');
const { wrongURLError } = require('../utils/constants');

const validateUrl = (value) => {
  if (!validator.isURL(value)) {
    throw new CelebrateError(wrongURLError);
  }
  return value;
};

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
});

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().min(4),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().alphanum().length(24).hex(),
  }),
});

const validateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(56),
    director: Joi.string().required().min(2).max(60),
    duration: Joi.string().required().min(1).max(4),
    year: Joi.string().required().min(1).max(4),
    description: Joi.string().required().min(2).max(100),
    image: Joi.string().custom(validateUrl).required(),
    trailer: Joi.string().custom(validateUrl).required(),
    thumbnail: Joi.string().custom(validateUrl).required(),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

module.exports = {
  validateUser,
  validateLogin,
  validateMovie,
  validateId,
  validateUserUpdate,
};
