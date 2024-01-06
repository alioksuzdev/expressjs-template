const requestMethods = require('../constants/requestMethods');

module.exports = [
  {
    path: '/health',
    method: requestMethods.GET,
    controller: () => true,
    validator: () => true,
    requiresAuthentication: false,
  },
];
