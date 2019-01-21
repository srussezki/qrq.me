require('./product-card.scss');
var tpl = require('./product-card.pug');

module.exports = function(data) {
  console.log(data);

  return tpl({
    name: data.item_name,
    category: data.level_0_item_group,
    image: 'https://fama-erp.strongops.de/' + data.image,
    price: String(data.current_gross_selling_price).replace('.', ','),
    appPrice: (data.current_gross_selling_price * 0.9)
      .toFixed(2)
      .replace('.', ','),
  });
};
