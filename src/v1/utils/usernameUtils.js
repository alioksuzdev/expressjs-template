module.exports = {
  convertNameToUsername(fullName) {
    if (!fullName) {
      // eslint-disable-next-line no-param-reassign
      fullName = 'user';
    }
    const usernameChars = [];
    const name = fullName.toLowerCase();
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < Math.min(name.length, 15); i++) {
      const char = name[i];
      if (this.isLetterOrNumber(char)) {
        usernameChars.push(char);
      }
    }
    while (usernameChars.length + 6 < 25) {
      usernameChars.push(...(this.generateRandomSixDigitNumber()));
    }
    return usernameChars.join('');
  },

  isLetterOrNumber(char) {
    return Number.isNaN(char) || !!char.match(/[a-z]/i);
  },

  generateRandomSixDigitNumber() {
    return `${Math.floor(100000 + Math.random() * 900000)}`;
  },
};
