const crypto = require('node:crypto');

module.exports = {
  generateNewToken() {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(48, (err, buffer) => {
        if (err) reject(err);
        else resolve(buffer.toString('hex').substring(0, 52));
      });
    });
  },
};
