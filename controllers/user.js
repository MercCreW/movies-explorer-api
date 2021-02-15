const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const AuthError = require('../errors/AuthError');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      res.status(200).send({ message: `Пользователь ${user} создан` });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Введены некорректные данные');
      }
      if (err.code === 11000 && err.name === 'MongoError') {
        throw new ConflictError('Данный email уже зарегистрирован');
      }
      throw err;
    })
    .catch(next);
};

const checkToken = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new AuthError('Вы не авторизированы'))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      console.log(user);
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'merc-2AI-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
    })
    .orFail(() => new NotFoundError({ message: 'Нет пользователя с таким id' }))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        throw err;
      }
      throw new ValidationError({ message: `Указаны некорректные данные: ${err.message}` });
    })
    .then((user) => {
      res.status(200).send((user));
    })
    .catch(next);
};

module.exports = {
  createUser,
  login,
  updateProfile,
  checkToken,
};
