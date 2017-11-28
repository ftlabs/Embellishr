const dotenv = require('dotenv').config({ silent: process.env.NODE_ENVIRONMENT === 'production' });
const debug = require('debug')('correlations:index');
const express = require('express');
const path = require('path');
const app = express();
const fetchContent = require('./bin/lib/fetchContent');
const embellish = require('./bin/lib/embellish');
const v1v2 = require('./bin/lib/v1v2');
const validateRequest = require('./bin/lib/check-token');

const API_CACHE_TIME = 1800 // 30 Mins;

var requestLogger = function (req, res, next) {
  debug("RECEIVED REQUEST:", req.method, req.url);
  next(); // Passing the request to the next handler in the stack.
}

app.use(requestLogger);

// these routes do *not* have s3o
app.use('/static', express.static('static'));
app.use('/app', express.static('app'));

const TOKEN = process.env.TOKEN;
if (!TOKEN) {
  throw new Error('ERROR: TOKEN not specified in env');
}

// these route *do* use s3o
app.set('json spaces', 2);
if (process.env.BYPASS_TOKEN !== 'true') {
  app.use(validateRequest);
}

app.get('/api', (req, res) => {
  res.sendFile(path.join(__dirname + '/static/index.html'));
});

app.get('/api/:year([0-9]{4})/:month([0-9]{2})/:word', (req, res) => {
  const year = parseInt(req.params.year);
  const month = parseInt(req.params.month);
  const word = req.params.word;
  embellish.lookupWordByMonth(req.params.word, year, month).then(result => {
    let response = {};
    response['searchTerm'] = word;
    response[year] = result;
    res.json(response);
  })
});

app.get('/api/:year([0-9]{4})/:word', (req, res) => {
  const year = parseInt(req.params.year);
  const word = req.params.word;
  embellish.lookupWordByYear(word, year).then(results => {
    let response = {};
    response['searchTerm'] = word;
    response[year] = results;
    res.json(response);
  })
});

app.get('/api/summary/:year([0-9]{4})/:word', (req, res) => {
  const year = parseInt(req.params.year);
  const word = req.params.word;
  embellish.yearSummary(word, year).then(results => {
    let response = {};
    response['searchTerm'] = word;
    response[year] = results;
    res.json(response);
  })
});

app.get('/api/condensed/:year([0-9]{4})/:word', (req, res) => {
  const year = parseInt(req.params.year);
  const word = req.params.word;
  embellish.condensedSummary(word, year).then(results => {
    let response = {};
    response['searchTerm'] = word;
    response[year] = results;
    res.setHeader('Cache-Control', `private, max-age=${API_CACHE_TIME}`)
    res.json(response);
  }).catch(error => {
    console.log(error);
  })
});

app.get('/api/topSearchTerms/:num', (req, res) => {
  const num = parseInt(req.params.num);
  fetchContent.latestSearchTerms(num)
  .then(terms => {
    let response = {
      description: 'recent, top searched-for terms on ft.com',
      num,
      terms
    };
    res.setHeader('Cache-Control', `private, max-age=${API_CACHE_TIME}`)
    res.json(response);
  }).catch(error => {
    console.log(error);
  })
});


app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/app/dist/index.html'));
});


//---

function startListening() {
  app.listen(process.env.PORT, function () {
    console.log('Server is listening on port', process.env.PORT);
  });
}
//---
startListening();
