const Movie = require('../models/movies');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getAllSavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .populate('owner')
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const { country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail } = req.body;
  Movie.create({ country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, owner: req.user._id })
    .then((movie) => {
      res.status(200).send(movie);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        throw new ValidationError('Validation data FAIL!');
      }
      next(error);
    });
};

const deleteSavedMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(new NotFoundError('Фильм не найден'))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('У вас недостаточно прав');
      }
      Movie.findByIdAndRemove(req.params._id)
        .then((newMovieData) => {
          res.send({ data: newMovieData });
        })
        .catch((err) => res.status(500).json({ message: err.message }));
    })
    .catch(next);
};

module.exports = {
  getAllSavedMovies,
  createMovie,
  deleteSavedMovie,
};
