require('./product-card.scss');

const _ = require('lodash');
const tpl = require('./product-card.html');
const tplFn = _.template(tpl);

module.exports = function(data) {
  var html = tplFn({ user: data.name });
  $('.product-card').html(html);
};
