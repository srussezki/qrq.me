require('./amazon-reviews.scss');
var tpl = require('./amazon-reviews.pug');

module.exports = function(data) {
  if (
    data &&
    Array.isArray(data['amazon-reviews']) &&
    data['amazon-reviews'].length > 0
  ) {
    return tpl({
      reviews: data['amazon-reviews'],
    });
  }
};
