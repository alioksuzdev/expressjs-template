const profileRepository = require('../repositories/profileRepository');
const mediaUtils = require('../utils/mediaUtils');

module.exports = {
  async getProfileById(userId, profileId) {
    return profileRepository.getProfileById(profileId);
  },

  async getProfilesByIds(userId, profileIds) {
    const uniqueProfileIds = Array.from(new Set(profileIds));
    const profiles = await Promise.all(
      uniqueProfileIds.map((profileId) => this.getProfileById(userId, profileId)),
    );
    return profiles.filter((profile) => profile);
  },

  async editProfile(userId, name, bio, profilePhoto, headerPhoto) {
    const preparedProfilePhoto = (await mediaUtils
      .prepareImageAttachments([profilePhoto], userId))[0];
    const preparedHeaderPhoto = (await mediaUtils
      .prepareImageAttachments([headerPhoto], userId))[0];
    await profileRepository
      .editProfile(userId, name, bio, preparedProfilePhoto, preparedHeaderPhoto);
    return this.getProfileById(userId, userId);
  },
};
