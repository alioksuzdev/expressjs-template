const { v4: uuidv4 } = require('uuid');

module.exports = {
  generateId() {
    return `${uuidv4()}`;
  },
};
