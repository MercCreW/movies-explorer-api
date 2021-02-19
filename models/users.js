const mongoose = require('mongoose');
const validator = require('validator');
const { invalidEmailError } = require('../utils/constants');

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Пользователь',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: invalidEmailError,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    select: false,
  },
});

module.exports = mongoose.model('user', usersSchema);
