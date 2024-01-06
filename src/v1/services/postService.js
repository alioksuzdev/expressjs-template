const postRepository = require('../repositories/postRepository');
const followRepository = require('../repositories/followRepository');

const mediaUtils = require('../utils/mediaUtils');

const postTypes = require('../constants/postTypes');

function prepareTitleAttachment(title) {
  return {
    type: postTypes.TEXT,
    title: title,
  };
}

module.exports = {
  async createNewPost(userId, topicId, title, images, videos, thumbnails) {
    const attachments = [];
    if (title?.length > 0) {
      const titleAttachment = prepareTitleAttachment(title);
      attachments.push(titleAttachment);
    }
    if (images.length > 0) {
      attachments.push(...await mediaUtils.prepareImageAttachments(images, userId));
    } else if (videos.length > 0) {
      attachments.push(...await mediaUtils.prepareVideoAttachments(videos, thumbnails, userId));
    }
    return postRepository.createNewPost(userId, topicId, attachments);
  },

  async scanAllPostsByUserId(userId, otherUserId) {
    return postRepository.scanAllPostsByUserId(otherUserId);
  },

  async getPostsByIds(userId, postIds) {
    const uniquePostIds = Array.from(new Set(postIds));
    const posts = await Promise.all(
      uniquePostIds.map((postId) => this.getPostById(userId, postId)),
    );
    return posts.filter((post) => post);
  },

  async getPostById(userId, postId) {
    const post = await postRepository.findPostById(postId);
    if (!post) return null;
    if (post.userId === userId || !post.private) {
      await this.populatePost(post);
      return post;
    }
    const follow = await followRepository.getFollowByTopicId(userId, post.topicId);
    if (!follow) {
      return {
        followToSee: true,
      };
    }
    await this.populatePost(post);
    return post;
  },

  async populatePost(post) {
    return post;
  },
};
