const topicRepository = require('../repositories/topicRepository');
const profileRepository = require('../repositories/profileRepository');
const followRepository = require('../repositories/followRepository');
const followRequestRepository = require('../repositories/followRequestRepository');

const ProfileTopicsReachedToLimitError = require('../errors/ProfileTopicsReachedToLimitError');
const InvalidCredentialsError = require('../errors/InvalidCredentialsError');

const followStatuses = require('../constants/followStatus');

module.exports = {
  async createNewTopic(userId, topicTitle, topicPrivacy, topicDescription) {
    const profile = await profileRepository.getProfileById(userId);
    if (profile.topics.length >= 5) throw new ProfileTopicsReachedToLimitError();
    return topicRepository.createNewTopic(userId, topicTitle, topicPrivacy, topicDescription);
  },

  async editTopic(userId, topicId, topicTitle, topicDescription) {
    const topic = await topicRepository.getTopicById(topicId);
    if (userId !== topic.userId) throw new InvalidCredentialsError();
    return topicRepository.editTopic(topicId, topicTitle, topicDescription);
  },

  async deleteTopic(userId, topicId) {
    const topic = await topicRepository.getTopicById(topicId);
    if (userId !== topic?.userId) throw new InvalidCredentialsError();
    return topicRepository.deleteTopicById(topicId);
  },

  async getTopicsByTopicIds(userId, topicIds) {
    const uniqueTopicIds = Array.from(new Set(topicIds));
    const topics = await Promise.all(
      uniqueTopicIds.map((topicId) => this.getTopicByTopicId(userId, topicId)),
    );
    return topics.filter((topic) => topic);
  },

  async getTopicByTopicId(userId, topicId) {
    const topic = await topicRepository.getTopicById(topicId);
    if (!topic) return null;
    if (userId === topic.userId) return topic;
    let followStatus = followStatuses.NONE;
    const follow = await followRepository.getFollowByTopicId(userId, topicId);
    if (follow) {
      followStatus = followStatuses.FOLLOWING;
    } else {
      const followRequest = await followRequestRepository
        .getFollowRequestByTopicId(userId, topicId);
      if (followRequest) {
        followStatus = followStatuses.REQUESTED_TO_FOLLOW;
      }
    }
    topic.followStatus = followStatus;
    return topic;
  },
};
