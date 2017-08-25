/* Config */
global.config = require('./config.json');
global.config.version = require('./package.json').version;

/* Dependencies */
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

/* Mongoose connect */
mongoose.connect(`mongodb://localhost/${global.config.db}`);

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
  console.log('database: connected');
});

/* ExpressJS stuff */
let app = express();

/* Setting up views */
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
app.set('views', `${__dirname}/views`);

/* Setting up controllers */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('./controllers'));

app.listen(global.config.port, () => {
  console.log(`Listening on port ${global.config.port}`);
});
