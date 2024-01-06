const authService = require('../services/authService');
const sessionService = require('../services/sessionService');

async function prepareResponse(userId) {
  return {
    userId,
    token: await sessionService.createNewSession(userId),
  };
}

module.exports = {
  login(request) {
    const { username, password } = request.body;
    const userId = authService.login(username, password);
    return prepareResponse(userId);
  },

  async register(request) {
    const { name, email, password } = request.body;
    const userId = await authService.register(name, email, password);
    return prepareResponse(userId);
  },

  async logout(request) {
    const { token, userId } = request.auth;
    await authService.logout(userId, token);
  },

  async continueWithGoogle(request) {
    const { token } = request.body;
    const userId = await authService.continueWithGoogle(token);
    return prepareResponse(userId);
  },

  async continueWithApple(request) {
    const { token, name } = request.body;
    const userId = await authService.continueWithApple(token, name);
    return prepareResponse(userId);
  },

  async continueWithAppleCallback(request) {
    const urlParams = new URLSearchParams(request.body).toString();
    const packageNameAndroid = 'com.app.identifier';
    const redirectUri = `intent://callback?${urlParams}#Intent;package=${packageNameAndroid};scheme=signinwithapple;end`;
    return {
      behaviourOverride: 'redirect',
      redirectUri: redirectUri,
    };
  },
};
