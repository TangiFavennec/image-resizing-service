'use strict';

const fs                 = require('fs');
const crypto             = require('crypto');
const request            = require('request');
var sharp                = require('sharp');
const config             = require('../../config');
const log                = require('../../logger');
var url                = require('url');

class ResizingJob {
  constructor(id, options, callback) {
    this.id = id
    this.options  = options || {};
    this.callback = callback;
  
    this.cacheFileName = this.generateCacheFilename();
    this.cacheFilePath = config.cacheDirectory + this.cacheFileName;
  }
}

ResizingJob.prototype.generateCacheFilename = function () {
  return crypto.createHash(config.cacheHash)
    .update(JSON.stringify(this.options))
    .digest('hex') + '.' + this.options.format;
};

ResizingJob.prototype.isAlreadyCached = function (filename, cb) {
  fs.exists(filename, function (exists) {
    cb(exists);
  });
};

ResizingJob.prototype.validateRemoteSource = function (cb) {
  if (!url.parse(this.options.url).hostname) {
    return cb(`Invalid hostname for resource ${this.options.url}`, 400);
  }

  var options = {
    url: this.options.url,
    timeout: config.imageRetrievalTimeOut
  };

  request.head(options, function (err, res, body) {
    if (err) {
      if (err.code === 'ETIMEDOUT') {
        cb('Image retrieval timed out (ETIMEDOUT)', 500);
      } else {
        cb('Image server side', 500);
      }
    } else if (res.statusCode !== 200) {
      cb('Unexpected response' ,res.statusCode);
    } else if (res.headers['content-type'].split('/')[0] !== 'image') {
      cb('Unexpected content type', 415);
    } else {
      cb(`Image successfully retrieved for url : ${options.url}`, 200);
    }
  });
};

ResizingJob.prototype.resizeStream = function () {
  var source = this.options.url;

  var transform = sharp().toFormat(this.options.format)
                           .resize(this.options.width, this.options.height)
                           .toFile(this.cacheFilePath, (err, info) => {
                             if(err){
                                this.callback({status: 500, details: 'Could not create resized file'})
                             }
                             else {
                              this.callback(null, this.cacheFilePath)
                             }
                             log.write(`Job ${this.id} ended`)
                           } )

  request(source).pipe(fs.createWriteStream(this.cacheFilePath))
  .on('close', () => {
    fs.createReadStream(this.cacheFilePath).pipe(transform)
  });
};

ResizingJob.prototype.startResize = function () {
  this.validateRemoteSource(function (details, status) {
    if (status !== 200) {
      return this.callback({status: status, url: this.options.url, details: details});
    }
    log.write(details)
    this.isAlreadyCached(this.cacheFilePath, function (exists) {
      if (exists) {
        log.write(`${new Date()} - CACHE HIT: ${this.options.imagefile} for job ${this.id}`);
        log.write(`Job ${this.id} ended`)
        this.callback(null, this.cacheFilePath, true);
      } else {
        log.write(`${new Date()} - RESIZE START: ${this.options.imagefile} for job ${this.id}`);
        this.resizeStream();
      }
    }.bind(this));

  }.bind(this));
};

module.exports = ResizingJob