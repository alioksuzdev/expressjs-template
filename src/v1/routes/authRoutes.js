const authController = require('../controllers/authController');

const authValidator = require('../validators/authValidator');

const requestMethods = require('../constants/requestMethods');

module.exports = [
  {
    path: '/auth/login',
    method: requestMethods.POST,
    controller: authController.login,
    validator: authValidator.login,
    requiresAuthentication: false,
  },
  {
    path: '/auth/register',
    method: requestMethods.POST,
    controller: authController.register,
    validator: authValidator.register,
    requiresAuthentication: false,
  },
  {
    path: '/auth/logout',
    method: requestMethods.POST,
    controller: authController.logout,
    validator: authValidator.logout,
    requiresAuthentication: true,
  },
  {
    path: '/auth/continue-with-google',
    method: requestMethods.POST,
    controller: authController.continueWithGoogle,
    validator: authValidator.continueWithGoogle,
    requiresAuthentication: false,
  },
  {
    path: '/auth/continue-with-apple',
    method: requestMethods.POST,
    controller: authController.continueWithApple,
    validator: authValidator.continueWithApple,
    requiresAuthentication: false,
  },
  {
    path: '/auth/continue-with-apple-callback',
    method: requestMethods.POST,
    controller: authController.continueWithAppleCallback,
    validator: authValidator.continueWithAppleCallback,
    requiresAuthentication: false,
  },
];
