const dynamoose = require('dynamoose');

module.exports = new dynamoose.Schema({
  type: String,
  url: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  thumbnail: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  width: {
    type: Number,
    default: 0,
  },
  height: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    default: 0,
  },
});
