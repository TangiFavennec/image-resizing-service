'use strict';

const config = {
  appPort: process.env.PORT || 3000,
  appStdOut: true,
  cacheDirectory: __dirname + '/cache/',
  cacheHash: 'sha1',
  cacheHeader: {
    maxAge: 315360000,
    expires: 1209600000
  },
  imageRetrievalTimeOut: 5000,
  defaultFormat: 'jpg',
  defaultHeight: 100,
  defaultQuality: 80,
  defaultWidth: 100,
  redis: {
    queueName: 'image resizing',
    url: 'redis://127.0.0.1:6379'
  }

};

module.exports = config;