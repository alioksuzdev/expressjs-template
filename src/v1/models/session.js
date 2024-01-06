const dynamoose = require('dynamoose');

module.exports = dynamoose.model('sessions', new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
  },
  userId: String,
  expiresAt: Date,
}, {
  timestamps: true,
}));
