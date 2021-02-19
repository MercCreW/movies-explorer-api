const movieIdExistError = 'Фильм с таким индентификационным ключом уже существует';
const validationDataIsFailError = 'Введены некорректные данные';
const noAccessError = 'В доступе отказано';
const movieNotFoundError = 'Фильм не найден';

const emailExistError = 'Данный email уже зарегистрирован';
const userDataError = 'Некорректные почта или пароль';
const authorizeError = 'Вы не авторизированы';
const incorrectUserIdError = 'Нет пользователя с таким id';
const userCouldntFindError = 'Не удалось найти пользователя';

const wrongURLError = 'URL введен некорректно.';
const invalidEmailError = 'Введён некорректный email';
const duplicateEmailError = 'Данный email уже зарегистрирован';

const serverError = 'На сервере произошла ошибка';
const requestLimitExceedError = 'Превышено число запросов';
const resourceNotFoundError = 'Запрашиваемый ресурс не найден';

module.exports = {
  movieIdExistError,
  validationDataIsFailError,
  noAccessError,
  movieNotFoundError,
  emailExistError,
  userDataError,
  authorizeError,
  incorrectUserIdError,
  userCouldntFindError,
  wrongURLError,
  invalidEmailError,
  duplicateEmailError,
  serverError,
  requestLimitExceedError,
  resourceNotFoundError,
};
