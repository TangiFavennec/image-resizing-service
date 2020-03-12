'use strict';

var fs                 = require('fs');
var crypto             = require('crypto');
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


module.exports = ResizingJob