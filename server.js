'use strict';

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs');
const paths = require('./app/client/paths')
var config = require('./config')
var log = require('./logger')
const ResizeRequestBuilder = require('./app/client/resize_request_builder');
var ImageResizingManager = require('./app/model/image_resizing_manager')

if (!fs.existsSync(config.cacheDirectory)) {
  fs.mkdirSync(config.cacheDirectory);
}

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.set('view engine', 'ejs')

app.use(express.static('public'));

// Create queue and start workers
const manager = new ImageResizingManager()
manager.startProcessing()

// Ping check to see if instance is reachable
app.get('/status', function (req, res) {
  res.send('OK').end();
});

app.get('/', function (req, res) {
  res.render('pages/index');
});


// Generic endpoint: reacts to http://localhost:3000/{widht x height}}/{format(,quality)}}/{targetImageUrl}}
app.get(paths.urlMatch, function (req, res) {
  var now,
    jobStartTime,
    jobEndTime,
    jobDuration;

  now = jobStartTime = new Date().getTime();

  var resizeRequest = (new ResizeRequestBuilder(req.params, req.query)).build()
  log.write('request built')

  manager.addJob(resizeRequest, function (err, file, cached) {
    if (err) {
      log.write(err)
      return res.status(err.status).json(err);
    }
  
    jobEndTime = new Date().getTime();
    jobDuration = jobEndTime - jobStartTime;
  
    if (cached) {
      jobDuration = 0;
    }
    res.header('X-ResizingJobDuration', jobDuration);
    res.header('Expires', new Date(now + config.cacheHeader.expires));
    res.sendFile(file, { maxAge: config.cacheHeader.maxAge });
  })
});

log.write('resize server listening on ' + config.appPort);
app.listen(config.appPort);