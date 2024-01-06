const axios = require('axios');
const jwt = require('jsonwebtoken');

const sessionDataAccess = require('../repositories/sessionRepository');

const InvalidCredentialsError = require('../errors/InvalidCredentialsError');
const InvalidSessionTokenError = require('../errors/InvalidSessionTokenError');

const InternalServerError = require('../errors/InternalServerError');

module.exports = {
  async authenticateRequest(request, requiresAuthentication) {
    if (!requiresAuthentication) {
      return;
    }

    const { headers } = request;
    const token = headers['x-session-token'];

    if (!token) {
      throw new InvalidCredentialsError();
    }

    let session;

    try {
      session = await sessionDataAccess.getSessionByToken(token);
    } catch (error) {
      throw new InternalServerError();
    }

    if (!session) {
      throw new InvalidSessionTokenError();
    }

    request.auth = {
      token,
      userId: session.userId,
    };
  },

  async getGoogleUserInfoByToken(token) {
    const { data } = await axios.get('https://www.googleapis.com/userinfo/v2/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },

  getAppleUserInfoByToken(token) {
    return jwt.decode(token);
  },
};
