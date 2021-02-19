const router = require('express').Router();
const { getAllSavedMovies, createMovie, deleteSavedMovie } = require('../controllers/movie');
const { validateMovie, validateId } = require('../middlewares/validateReq');

router.get('/', getAllSavedMovies);
router.post('/', validateMovie, createMovie);
router.delete('/:movieId', validateId, deleteSavedMovie);

module.exports = router;
