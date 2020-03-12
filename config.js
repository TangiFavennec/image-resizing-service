'use strict';

const config = {
  appPort: process.env.PORT || 3000,
  appStdOut: true,
  cacheDirectory: __dirname + '/cache/',
  cacheHash: 'sha1',
  imageRetrievalTimeOut: 5000,
  defaultFormat: 'jpg',
  defaultHeight: 100,
  defaultQuality: 80,
  defaultWidth: 100,

};

module.exports = config;