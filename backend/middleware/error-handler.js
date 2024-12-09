const errorHandler = (error, _request, _response, next) => {
  console.error(error.message);

  next(error);
};

module.exports = errorHandler;
