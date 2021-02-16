require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const errorsHandler = require('./middlewares/errorsHandler');
const routes = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');
const { mongoDevUrl } = require('./utils/config');

const { NODE_ENV, MONGO_URL } = process.env;

const PORT = 3000;
const app = express();

app.use(cors());
app.use(helmet());
app.use(limiter);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : mongoDevUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Неполадки на сервере');
  }, 0);
});

app.use('/', routes);
app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

app.listen(PORT);
