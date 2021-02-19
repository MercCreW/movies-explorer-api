const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const AuthError = require('../errors/AuthError');
const { jwtSecretDevKey } = require('../utils/config');
const {
  emailExistError, incorrectUserIdError, validationDataIsFailError,
  userCouldntFindError, userDataError, duplicateEmailError,
} = require('../utils/constants');

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
      res.status(200).send({ email: user.email, name: user.name });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError(validationDataIsFailError);
      }
      if (err.code === 11000 && err.name === 'MongoError') {
        throw new ConflictError(emailExistError);
      }
      throw err;
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new ValidationError(incorrectUserIdError))
    .then((user) => {
      if (!user) {
        throw new NotFoundError(userCouldntFindError);
      }
      res.send({ email: user.email, name: user.name });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError(userDataError);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError(userDataError);
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : jwtSecretDevKey, { expiresIn: '7d' });
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
    .orFail(() => new NotFoundError(incorrectUserIdError))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        throw err;
      }
      throw new ConflictError(duplicateEmailError);
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
  getUser,
};
