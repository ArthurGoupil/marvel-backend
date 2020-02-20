const express = require('express');
const router = express.Router();
const uid2 = require('uid2');
const SHA256 = require('crypto-js/sha256');
const encBase64 = require('crypto-js/enc-base64');
const User = require('../models/User');

// DEALING WITH SIGN-UP AND PASSWORD ENCRYPTION
router.post('/user/sign_up', async (req, res) => {
  try {
    const email = req.fields.email;
    const password = req.fields.password;
    const token = uid2(16);
    const salt = uid2(64);
    const hash = SHA256(password + salt).toString(encBase64);
    const existingUser = await User.findOne({ 'account.email': email });
    if (!existingUser) {
      const user = new User({
        account: {
          email,
          token,
          salt,
          hash
        },
        favourites: {
          characters: [],
          comics: []
        }
      });
      await user.save();
      return res.status(200).json({
        _id: user._id,
        account: {
          email: user.account.email,
          token: user.account.token
        }
      });
    } else if (existingUser) {
      return res.status(409).json({
        message: `Another superhero has already choosen this email address. Don't try to fool me.`
      });
    }
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

// DEALING WITH LOG-IN
router.post('/user/log_in', async (req, res) => {
  try {
    const userEmail = req.fields.email;
    const userPassword = req.fields.password;
    if (userEmail && userPassword) {
      const user = await User.findOne({ 'account.email': userEmail });

      if (user) {
        const loginHash = SHA256(userPassword + user.account.salt).toString(
          encBase64
        );
        if (loginHash === user.account.hash && user) {
          return res.status(200).json({
            _id: user._id,
            account: {
              email: user.account.email,
              token: user.account.token
            }
          });
        } else return res.status(400).json({ error: 'Unauthorized.' });
      } else return res.status(400).json({ error: 'Unauthorized.' });
    } else return res.status(400).json({ error: `Missing parameter(s)` });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

module.exports = router;
