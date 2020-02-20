const express = require('express');
const formidableMiddleware = require('express-formidable');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(formidableMiddleware());
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
const userRoutes = require('./routes/user');
app.use(userRoutes);

app.all('*', (req, res) => {
  res.json({ message: 'all routes.' });
});

app.listen(process.env.PORT || 3100, () => {
  console.log('Server has started.');
});
