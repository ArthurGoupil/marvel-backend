const mongoose = require('mongoose');

const User = mongoose.model('User', {
  account: {
    email: {
      type: String,
      unique: true,
      required: true
    },
    token: {
      type: String,
      required: true
    },
    salt: {
      type: String,
      required: true
    },
    hash: {
      type: String,
      required: true
    }
  },
  favourites: {
    characters: {
      type: Array,
      default: []
    },
    comics: {
      type: Array,
      default: []
    }
  }
});

module.exports = User;
