module.exports = class ProfileTopicsReachedToLimitError {
  constructor() {
    this.code = 403; // FORBIDDEN
    this.retryable = false;
    this.isPleebError = true; // Used to determine if error is thrown by a library
  }
};
