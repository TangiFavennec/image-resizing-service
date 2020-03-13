const urlMatch = new RegExp([
  '^\/?([0-9]+)x?([0-9]+)',
  '\/?(png|jpg|jpeg)?', // only png, jpg, jpeg allowed
  '\/(.*)$'
].join(''));

module.exports.urlMatch = urlMatch

