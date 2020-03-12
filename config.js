'use strict';

const config = {
  appPort: process.env.PORT || 3000,
  appStdOut: true,
  cacheDirectory: __dirname + '/cache/',
  cacheHash: 'sha1'
};

module.exports = config;