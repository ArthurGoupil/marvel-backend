const express = require('express');
const router = express.Router();
md5 = require('js-md5');
const axios = require('axios');

const marvelPuk = process.env.MARVEL_PUK;
const marvelPrk = process.env.MARVEL_PRK;

const ts = Math.floor(new Date().getTime() / 1000);
const hash = md5(ts + marvelPrk + marvelPuk);

const isAuthenticated = require('../middleware/isAuthenticated');
const User = require('../models/User');

// GET MARVEL CHARACTERS
router.get('/characters/page=:page', async (req, res) => {
  const page = req.params.page;
  const limitPerPage = req.query.limit;
  const orderType = 'name';

  try {
    const response = await axios.get(
      `https://gateway.marvel.com/v1/public/characters?orderBy=${orderType}&offset=${limitPerPage *
        (page -
          1)}&limit=${limitPerPage}&ts=${ts}&apikey=${marvelPuk}&hash=${hash}`
    );
    res.status(200).json(response.data.data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// GET A CHARACTER WITH A GIVEN ID
router.get('/characterdata/:id', async (req, res) => {
  const id = req.params.id;
  console.log(id);

  try {
    const response = await axios.get(
      `https://gateway.marvel.com/v1/public/characters/${id}?ts=${ts}&apikey=${marvelPuk}&hash=${hash}`
    );
    res.status(200).json(response.data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// GET COMICS WITH A GIVEN CHARACTER ID
router.get('/character/:id/page=:page', async (req, res) => {
  const id = req.params.id;
  const page = req.params.page;
  const orderType = 'title';
  const limitPerPage = req.query.limit;

  try {
    const response = await axios.get(
      `https://gateway.marvel.com/v1/public/characters/${id}/comics?orderBy=${orderType}&offset=${limitPerPage *
        (page -
          1)}&limit=${limitPerPage}&ts=${ts}&apikey=${marvelPuk}&hash=${hash}`
    );
    res.status(200).json(response.data.data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// SEARCH AMONG CHARACTERS WITH A GIVEN NAME - Starts with method
router.get('/characters/search=:search/page=:page', async (req, res) => {
  const search = req.params.search;
  const page = req.params.page;
  const orderType = 'name';
  const limitPerPage = req.query.limit;

  try {
    const response = await axios.get(
      `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${search}&orderBy=${orderType}&offset=${limitPerPage *
        (page -
          1)}&limit=${limitPerPage}&ts=${ts}&apikey=${marvelPuk}&hash=${hash}`
    );
    res.status(200).json(response.data.data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PUT A CHARACTER IN FAVOURITES
router.post(
  'https://marvel-goupil-backend.herokuapp.com/character/favourite',
  isAuthenticated,
  async (req, res) => {
    try {
      const characterId = req.fields.characterId;
      const userId = req.user.id;
      const user = await User.findById(userId);
      user.favourites.characters.push(characterId);
      await user.save();
      res.status(200).json(user.favourites);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
);

module.exports = router;
