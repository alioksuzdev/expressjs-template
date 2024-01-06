const bcrypt = require('@node-rs/bcrypt');
const crypto = require('node:crypto');

module.exports = {
  encryptPassword(password) {
    return bcrypt.hash(password, bcrypt.DEFAULT_COST);
  },

  comparePasswords(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  },

  createPasswordResetToken() {
    return new Promise((resolve, reject) => {
      crypto.randomInt(100000, 999999, (err, token) => {
        if (err) reject(err);
        else resolve(token);
      });
    });
  },

  encryptPasswordResetToken(passwordResetToken) {
    return bcrypt.hash(passwordResetToken, bcrypt.DEFAULT_COST);
  },

  comparePasswordResetToken(passwordResetToken, encryptedPasswordResetToken) {
    return bcrypt.compare(passwordResetToken, encryptedPasswordResetToken);
  },
};
