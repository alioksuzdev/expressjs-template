const dynamoose = require('dynamoose');
const Auth = require('../models/auth');
const Email = require('../models/email');
const Profile = require('../models/profile');
const Username = require('../models/username');

const idUtils = require('../utils/idUtils');
const mediaUtils = require('../utils/mediaUtils');
const passwordUtils = require('../utils/passwordUtils');

module.exports = {
  async createNewAuth(name, username, email, password, loginType) {
    const userId = idUtils.generateId();
    await dynamoose.transaction([
      Auth.transaction.create({
        id: userId,
        email: email.trim(),
        password: password?.length > 0 ? await passwordUtils.encryptPassword(password) : '',
        loginTypes: [loginType],
      }),
      Profile.transaction.create({
        id: userId,
        username: username.trim(),
        name: name.trim(),
        profilePhoto: (await mediaUtils.prepareAvatar(`${name}${username}`, userId))[0],
        headerPhoto: (await mediaUtils.prepareHeader(userId))[0],
      }),
      Username.transaction.create({
        id: username.trim(),
        userId,
      }),
      Email.transaction.create({
        id: email.trim(),
        userId,
      }),
    ]);
    return userId;
  },

  async getAuthByUsernameOrEmail(usernameOrEmail) {
    if (usernameOrEmail.includes('@')) {
      return this.getAuthByEmail(usernameOrEmail);
    }
    return this.getAuthByUsername(usernameOrEmail);
  },

  async getAuthByUserId(userId) {
    const auth = await Auth.get(userId);
    if (!auth) return null;
    return { ...auth };
  },

  async getAuthByEmail(email) {
    const emailObject = await Email.get(email);
    if (!emailObject) return null;
    return this.getAuthByUserId(emailObject.userId);
  },

  async getAuthByUsername(username) {
    const usernameObject = await Username.get(username);
    if (!usernameObject) return null;
    return this.getAuthByUserId(usernameObject.userId);
  },

  async updateUserPassword(userId, password, loginType) {
    await Auth.update(
      { id: userId },
      {
        $SET: {
          password: await passwordUtils.encryptPassword(password),
        },
        $ADD: {
          loginTypes: loginType,
        },
      },
      {
        condition: new dynamoose.Condition().where('id').exists(),
      },
    );
  },

  async addAnotherLoginType(userId, loginType) {
    await Auth.update(
      { id: userId },
      {
        $ADD: {
          loginTypes: loginType,
        },
      },
      {
        condition: new dynamoose.Condition().where('id').exists(),
      },
    );
  },
};
