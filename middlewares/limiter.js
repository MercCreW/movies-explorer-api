const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 300000, 
  max: 60, 
  message: 'Превышено число запросов',
});

module.exports = limiter;
