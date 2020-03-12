'use strict';

class ResizingJob {
  constructor(options, callback) {
    this.options  = options || {};
    this.callback = callback;
  }
}

module.exports = ResizingJob