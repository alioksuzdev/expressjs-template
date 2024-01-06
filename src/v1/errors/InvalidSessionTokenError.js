module.exports = class InvalidSessionTokenError {
  constructor() {
    this.code = 401; // UNAUTHORIZED
    this.retryable = false;
    this.isPleebError = true; // Used to determine if error is thrown by a library
    this.behaviourOverride = 'logout';
  }
};
