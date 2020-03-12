'use strict';

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const paths = require('./app/client/paths')
var config = require('./config')
var log = require('./logger')


app.use(bodyParser())

app.set('view engine', 'ejs')

app.use(express.static('public'));

// Ping check to see if instance is reachable
app.get('/status', function (req, res) {
  res.send('OK').end();
});

app.get('/', function (req, res) {
  res.render('pages/index');
});

app.get(paths.urlMatch, function (req, res) {

  var jobStartTime,
      jobEndTime,
      jobDuration;

  jobStartTime = new Date().getTime();
  
  jobEndTime = new Date().getTime();
  jobDuration = jobEndTime - jobStartTime;
  res.header('X-ResizingJobDuration', jobDuration);
  
  res.send('OK').end();
});

log.write('resize server listening on ' + 3000);
app.listen(3000);