const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/marvel', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const characterRoutes = require('./routes/character');
app.use(characterRoutes);
const comicRoutes = require('./routes/comic');
app.use(comicRoutes);

app.all('*', (req, res) => {
  res.json({ message: 'all routes.' });
});

app.listen(process.env.PORT || 3100, () => {
  console.log('Server has started.');
});
