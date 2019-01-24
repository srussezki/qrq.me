require('./product-card.scss');
var tpl = require('./product-card.pug');

module.exports = function(data) {
  var otherImages = [],
    images = [];

  if (
    data['product_external_data'] &&
    data['product_external_data']['external-images']
  ) {
    otherImages = data['product_external_data']['external-images'];
  }

  if (data.image) {
    if (data.image.match(/^http/)) {
      images.push(data.image);
    } else {
      images.push('https://fama-erp.strongops.de/' + data.image);
    }

    images = images.concat(otherImages);
  }

  return tpl({
    name: data.item_name,
    category: data.level_0_item_group,
    image: 'https://fama-erp.strongops.de/' + data.image,
    price: String(data.current_gross_selling_price).replace('.', ','),
    appPrice: (data.current_gross_selling_price * 0.9)
      .toFixed(2)
      .replace('.', ','),
    images: images,
    top10: data.top10,
    top100: data.top100,
    marketing_text: data.marketing_text,
    orders_yesterday: data.ORDERS_YESTERDAY,
    appLink: data.qrcode_fm02,
  });
};
