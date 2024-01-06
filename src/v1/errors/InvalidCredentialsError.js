module.exports = class InvalidCredentialsError {
  constructor() {
    this.code = 400; // BAD_REQUEST
    this.retryable = false;
    this.isPleebError = true; // Used to determine if error is thrown by a library
  }
};
