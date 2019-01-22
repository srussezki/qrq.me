require('./price-comparison.scss');
var tpl = require('./price-comparison.pug');

module.exports = function(data) {
  let offers;

  if (
    data &&
    Array.isArray(data['third-party-offers']) &&
    data['third-party-offers'].length > 0
  ) {
    offers = data['third-party-offers'];
  } else {
    return;
  }

  return tpl({
    offers: offers.sort(byPrice),
  });
};

function byPrice(a, b) {
  return a['offer-price'] - b['offer-price'];
}
