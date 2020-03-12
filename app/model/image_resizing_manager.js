
const CallbackRepository = require('./callback_repository')
const config = require('../../config')
const log = require('../../logger')
var Queue = require('bull');
var ResizingJob = require('./resizing_job')

class ImageResizingManager {
  constructor() {
    this.queue = new Queue(config.redis.queueName, config.redis.url);
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
    log.write(`Create job n ${job.id}`)
    resizingJob.startResize();
    repository.remove(job.id)
    done()
  });
}

module.exports = ImageResizingManager