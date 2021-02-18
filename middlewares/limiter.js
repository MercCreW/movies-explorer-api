const rateLimit = require('express-rate-limit');
const { requestLimitExceedError } = require('../utils/constants');

const limiter = rateLimit({
  windowMs: 300000,
  max: 60,
  message: requestLimitExceedError,
});

module.exports = limiter;
