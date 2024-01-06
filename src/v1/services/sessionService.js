const sessionRepository = require('../repositories/sessionRepository');

module.exports = {
  async createNewSession(userId) {
    return sessionRepository.createNewSession(userId, 1);
  },
};
