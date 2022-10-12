require('dotenv/config');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./route/router.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/flexben', router);

module.exports =  app;