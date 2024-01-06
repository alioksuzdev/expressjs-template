const authRepository = require('../repositories/authRepository');
const sessionRepository = require('../repositories/sessionRepository');

const authUtils = require('../utils/authUtils');
const usernameUtils = require('../utils/usernameUtils');
const passwordUtils = require('../utils/passwordUtils');

const loginTypes = require('../constants/loginTypes');

const InvalidCredentialsError = require('../errors/InvalidCredentialsError');

module.exports = {
  async register(name, email, password, loginType = loginTypes.PASSWORD) {
    const username = usernameUtils.convertNameToUsername(name);
    return authRepository.createNewAuth(name, username, email, password, loginType);
  },

  async login(username, password) {
    const auth = authRepository.getAuthByUsernameOrEmail(username);
    if (!auth || !auth.loginTypes.includes(loginTypes.PASSWORD)) {
      throw new InvalidCredentialsError();
    }
    const isCorrectPassword = await passwordUtils.comparePasswords(password, auth.password);
    if (!isCorrectPassword) {
      throw new InvalidCredentialsError();
    }
    return auth.id;
  },

  async logout(userId, token) {
    await sessionRepository.deleteSessionByToken(token);
  },

  async continueWithGoogle(token) {
    const { email, name } = await authUtils.getGoogleUserInfoByToken(token);
    const auth = await authRepository.getAuthByEmail(email);
    if (auth) {
      const userId = auth.id;
      if (!auth.loginTypes.includes(loginTypes.GOOGLE)) {
        authRepository.addAnotherLoginType(userId, loginTypes.GOOGLE);
      }
      return userId;
    }
    return this.register(name, email, null, loginTypes.GOOGLE);
  },

  async continueWithApple(token, name) {
    const { email } = await authUtils.getAppleUserInfoByToken(token);
    const auth = await authRepository.getAuthByEmail(email);
    if (auth) {
      const userId = auth.id;
      if (!auth.loginTypes.includes(loginTypes.APPLE)) {
        authRepository.addAnotherLoginType(userId, loginTypes.APPLE);
      }
      return auth.id;
    }
    return this.register(name, email, null, loginTypes.APPLE);
  },
};
