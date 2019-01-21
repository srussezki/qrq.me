require('./price-comparison.scss');
var tpl = require('./price-comparison.pug');

module.exports = function(data) {
  if (!data || data.length === 0) {
    return;
  }

  return tpl({
    offers: data.sort(byPrice),
  });
};

function byPrice(a, b) {
  return a['offer-price'] - b['offer-price'];
}
