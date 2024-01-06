const blockRepository = require('../repositories/blockRepository');

module.exports = {
  async blockUser(userId, otherUserId) {
    await blockRepository.blockUser(userId, otherUserId);
  },

  async unblockUser(userId, otherUserId) {
    await blockRepository.unblockUser(userId, otherUserId);
  },

  async checkBlock(userId, otherUserId) {
    return blockRepository.checkBlock(userId, otherUserId);
  },
};
