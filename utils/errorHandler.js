export default class ResponseError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    // this.message = message;
    this.statusCode = statusCode;
  }
}
