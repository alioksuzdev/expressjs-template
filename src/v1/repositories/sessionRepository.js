const Session = require('../models/session');
const sessionUtils = require('../utils/sessionUtils');

module.exports = {
  async createNewSession(userId, validYear = 1) {
    const token = await sessionUtils.generateNewToken();
    const session = new Session({
      id: token,
      userId,
      expiresAt: Date.now() + (1000 * 60 * 60 * 24 * 365 * validYear),
    });
    await session.save();
    return token;
  },

  async getSessionByToken(token) {
    const session = await Session.get(token);
    if (!session) return null;
    return { ...session };
  },

  deleteSessionByToken(token) {
    return Session.delete(token);
  },
};
