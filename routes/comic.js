const express = require('express');
const router = express.Router();
md5 = require('js-md5');
const axios = require('axios');

const marvelPuk = process.env.MARVEL_PUK;
const marvelPrk = process.env.MARVEL_PRK;

const ts = Math.floor(new Date().getTime() / 1000);
const hash = md5(ts + marvelPrk + marvelPuk);

// GET MARVEL COMICS
router.get('/comics/page=:page', async (req, res) => {
  const page = req.params.page;
  const limitPerPage = req.query.limit;
  const orderType = 'title';

  try {
    const response = await axios.get(
      `https://gateway.marvel.com/v1/public/comics?orderBy=${orderType}&offset=${limitPerPage *
        (page -
          1)}&limit=${limitPerPage}&ts=${ts}&apikey=${marvelPuk}&hash=${hash}`
    );
    res.status(200).json(response.data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// SEARCH AMONG COMICS WITH A GIVEN TITLE - Starts with method
router.get('/comics/search=:search/page=:page', async (req, res) => {
  const search = req.params.search;
  const page = req.params.page;
  const orderType = 'title';
  const limitPerPage = req.query.limit;

  try {
    const response = await axios.get(
      `https://gateway.marvel.com/v1/public/comics?titleStartsWith=${search}&orderBy=${orderType}&offset=${limitPerPage *
        (page -
          1)}&limit=${limitPerPage}&ts=${ts}&apikey=${marvelPuk}&hash=${hash}`
    );
    res.status(200).json(response.data.data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
