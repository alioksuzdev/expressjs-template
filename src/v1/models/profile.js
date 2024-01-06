const dynamoose = require('dynamoose');
const Attachment = require('./attachment');

module.exports = dynamoose.model('profiles', new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
  },
  username: String,
  name: String,
  bio: {
    type: String,
    default: "Hi! I'm a new around here!",
  },
  profilePhoto: Attachment,
  headerPhoto: Attachment,
  topics: {
    type: Array,
    schema: [String],
    default: [],
  },
}, {
  timestamps: true,
}));
