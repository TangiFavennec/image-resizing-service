
const CallbackRepository = require('./callback_repository')
const config = require('../../config')
const log = require('../../logger')
var Queue = require('bull');
var ResizingJob = require('./resizing_job')


class ImageResizingManager {
  constructor() {
    var url;
    // This should be handled with some program arg
    if(config.current_env == 'DEV'){
      url = config.redis.url_dev
    }
    else {
      url = config.redis.url_prod
    }
    url = `${url}:${config.redis.port}`
    this.queue = new Queue(config.redis.queueName, url);
    this.callbackRepository = new CallbackRepository()
  }
}

ImageResizingManager.prototype.addJob = function (resizingOptions, callback) {
  const job = this.queue.add(resizingOptions)
    .then(j => {
      this.callbackRepository.add(j.id, callback)
      return j
    })
    .then(j => {
      log.write(`Successfully programmed job n ${j.id}`)
    })
}

ImageResizingManager.prototype.startProcessing = function () {
  log.write('Start processing workers')
  let repository = this.callbackRepository
  this.queue.process(function (job, done) {
    var resizingJob = new ResizingJob(job.id, job.data, repository.getById(job.id))
    resizingJob.startResize();
    repository.remove(job.id)
    done()
  });
}

module.exports = ImageResizingManager