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
  current_env: 'DEV',
  imageRetrievalTimeOut: 5000,
  defaultFormat: 'jpg',
  defaultHeight: 100,
  defaultQuality: 80,
  defaultWidth: 100,
  redis: {
    queueName: 'image resizing',
    port: 6379,
    url_dev: 'redis://127.0.0.1',
    url_prod: process.env.REDIS_URL
  }

};

module.exports = config;