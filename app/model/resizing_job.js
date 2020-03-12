'use strict';

const fs                 = require('fs');
const crypto             = require('crypto');
const request            = require('request');
var sharp              = require('sharp');
const config           = require('../../config');
const log                = require('../../logger');

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
                           } )

  request(source).pipe(fs.createWriteStream(this.cacheFilePath))
  .on('close', () => {
    fs.createReadStream(this.cacheFilePath).pipe(transform)
  });
};

module.exports = ResizingJob