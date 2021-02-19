const Movie = require('../models/movies');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const ConflictError = require('../errors/ConflictError');

const {
  movieIdExistError, validationDataIsFailError, noAccessError, movieNotFoundError,
} = require('../utils/constants');

const getAllSavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    movieId,
    nameRU,
    nameEN,
    thumbnail,
  } = req.body;
  Movie.findOne({ movieId })
    .then((id) => {
      if (id) {
        throw new ConflictError(movieIdExistError);
      }
      Movie.create({
        country,
        director,
        duration,
        year,
        description,
        image,
        trailer,
        movieId,
        nameRU,
        nameEN,
        thumbnail,
        owner: req.user._id,
      })
        .then((movie) => {
          res.status(200).send(movie);
        })
        .catch((error) => {
          if (error.name === 'ValidationError') {
            throw new ValidationError(validationDataIsFailError);
          }
          next(error);
        });
    })
    .catch(next);
};

const deleteSavedMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError(movieNotFoundError))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(noAccessError);
      }
      Movie.findByIdAndRemove(req.params.movieId)
        .then((newMovieData) => {
          res.send({ data: newMovieData });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getAllSavedMovies,
  createMovie,
  deleteSavedMovie,
};
