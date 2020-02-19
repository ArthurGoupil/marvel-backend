const express = require('express');
const router = express.Router();
md5 = require('js-md5');
const axios = require('axios');

const marvelPuk = process.env.MARVEL_PUK;
const marvelPrk = process.env.MARVEL_PRK;
const ts = 1;
const hash = md5(ts + marvelPrk + marvelPuk);
const limitPerPage = 10;

// GET MARVEL CHARACTERS
router.get('/characters/page=:page', async (req, res) => {
  const page = req.params.page;
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

// GET COMICS WITH A GIVEN CHARACTER ID
router.get('/character/:id', async (req, res) => {
  const id = req.params.id;
  const orderType = 'title';

  try {
    const response = await axios.get(
      `https://gateway.marvel.com/v1/public/characters/${id}/comics?orderBy=${orderType}&ts=${ts}&apikey=${marvelPuk}&hash=${hash}`
    );
    res.status(200).json(response.data.data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// SEARCH AMONG CHARACTERS WITH A GIVEN NAME - Starts with method
router.get('/characters/search=:search', async (req, res) => {
  const search = req.params.search;
  const orderType = 'name';

  try {
    const response = await axios.get(
      `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${search}&orderBy=${orderType}&ts=${ts}&apikey=${marvelPuk}&hash=${hash}`
    );
    res.status(200).json(response.data.data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
