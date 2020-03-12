
class CallbackRepository {
  constructor(){
    this.data = {}
  }
}

CallbackRepository.prototype.getById = function (jobId) {
    return this.data[jobId]
}

CallbackRepository.prototype.add = function (jobId, callback) {
  this.data[jobId] = callback
}

CallbackRepository.prototype.remove = function (jobId) {
  delete this.data[jobId]
  console.log(this.data)
}

module.exports = CallbackRepository