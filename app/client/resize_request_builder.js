'use strict';

const path = require('path');
const config = require('../../config')

class ResizeRequestBuilder {
  constructor(params, query){
    this.params = params;
    this.query = query || '';
  }
}

function reformatUrl (url) {
  return url.replace(/^([a-z]+:)\/+([^\/])/, '$1//$2');
}

ResizeRequestBuilder.prototype.build = function () {

  var clientUrl = reformatUrl(this.params[4]);

  var resizeRequest = {
    action:  'resize',
    width:   parseInt(this.params[0]) || config.defaultWidth,
    height:  parseInt(this.params[1]) || config.defaultHeight,
    format:  this.params[2] || config.defaultFormat,
    quality: parseInt(this.params[3]) || config.defaultQuality, 
    imagefile: this.params[4],
    url: clientUrl
  };

  // Autocorrect for invalid arguments
  resizeRequest.quality = Math.round(Math.min(100, Math.max(0, resizeRequest.quality)));
  resizeRequest.suffix = path.extname(resizeRequest.imagefile);

  return resizeRequest;
};

module.exports = ResizeRequestBuilder;1