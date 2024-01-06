const dynamoose = require('dynamoose');

module.exports = dynamoose.model('usernames', new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
  },
  userId: String,
}, {
  timestamps: true,
}));
