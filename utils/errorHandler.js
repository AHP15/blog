export const handleError = (err, res) => {
  res.status(err.statusCode).send({
    success: false,
    message: err.message ?? "Something went wrong!"
  });
};

export default class ResponseError extends Error {
  constructor(message = 'Something went wrong!', statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}
