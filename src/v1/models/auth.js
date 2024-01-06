const dynamoose = require('dynamoose');
const roles = require('../constants/roles');

module.exports = dynamoose.model('auths', new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
  },
  email: String,
  password: String,
  roles: {
    type: Array,
    schema: [String],
    default: [roles.USER],
  },
  loginTypes: {
    type: Array,
    schema: [String],
  },
}, {
  timestamps: true,
}));
