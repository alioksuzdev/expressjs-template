const dynamoose = require('dynamoose');

module.exports = dynamoose.model('emails', new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
  },
  userId: String,
}, {
  timestamps: true,
}));
