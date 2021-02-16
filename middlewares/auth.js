const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');
const { jwtSecretDevKey } = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError('Нужна авторизация');
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : jwtSecretDevKey}`);
  } catch (err) {
    throw new AuthError('Нужна авторизация');
  }
  req.user = payload;

  next();
};
