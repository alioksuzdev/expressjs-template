const InvalidInputError = require('../errors/InvalidInputError');

module.exports = {
  login(request) {
    const { username, password } = request.body;
    if (!username || typeof username !== 'string') throw new InvalidInputError();
    if (!password || typeof password !== 'string') throw new InvalidInputError();
  },

  register(request) {
    const { name, email, password } = request.body;
    if (!name || typeof name !== 'string' || name.length > 50) throw new InvalidInputError();
    if (!email || typeof email !== 'string') throw new InvalidInputError();
    if (!password || typeof password !== 'string') throw new InvalidInputError();
  },

  logout(request) {
    // Handled by authentication handler
  },

  continueWithGoogle(request) {
    const { token } = request.body;
    if (!token || typeof token !== 'string') throw new InvalidInputError();
  },

  continueWithApple(request) {
    const { token, name } = request.body;
    if (!token || typeof token !== 'string') throw new InvalidInputError();
    if (!name) {
      request.body.name = 'user';
    } else {
      request.body.name = name.substring(0, Math.min(name.length, 50));
    }
  },

  continueWithAppleCallback(request) {
    // No need to validate
  },
};
