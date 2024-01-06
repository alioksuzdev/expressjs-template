const fs = require('fs');

const routes = [];
const files = fs.readdirSync(__dirname);
files.forEach((file) => {
  if (file !== 'index.js') {
    const fileName = file.split('.')[0];
    // eslint-disable-next-line global-require,import/no-dynamic-require
    routes.push(...require(`./${fileName}`));
  }
});

module.exports = routes;
