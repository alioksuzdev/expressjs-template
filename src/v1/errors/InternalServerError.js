module.exports = class InternalServerError {
  constructor() {
    this.code = 500; // INTERNAL_SERVER_ERROR
    this.retryable = true;
    this.isPleebError = true; // Used to determine if error is thrown by a library
  }
};
