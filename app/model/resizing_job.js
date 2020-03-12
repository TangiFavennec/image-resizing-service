'use strict';

var fs                 = require('fs');
var crypto             = require('crypto');
var request            = require('request');
const config           = require('../../config');

class ResizingJob {
  constructor(options, callback) {
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
        cb('Image retrieval itmed out, ETIMEDOUT');
      } else {
        cb('Image server side', 500);
      }
    } else if (res.statusCode !== 200) {
      cb('Unexpected response' ,res.statusCode);
    } else if (res.headers['content-type'].split('/')[0] !== 'image') {
      cb('Unexpected content type', 415);
    } else {
      cb('Image successfully retrieved', 200);
    }
  });
};

module.exports = ResizingJob