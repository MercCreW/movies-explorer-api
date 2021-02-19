const routes = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const { resourceNotFoundError } = require('../utils/constants');

const routersMovie = require('./movies.js');
const routersUsers = require('./users.js');
const { login, createUser } = require('../controllers/user');
const { validateLogin, validateUser } = require('../middlewares/validateReq');
const auth = require('../middlewares/auth');

routes.post('/signin', validateLogin, login);
routes.post('/signup', validateUser, createUser);

routes.use('/movies', auth, routersMovie);
routes.use('/users', auth, routersUsers);
routes.use('/*', (req, res, next) => {
  const error = new NotFoundError(resourceNotFoundError);
  next(error);
});

module.exports = routes;
