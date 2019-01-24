require('./upsell-products.scss');
// var tpl = require('./upsell-products.pug');
var productTpl = require('./upsell-product-tpl.pug');

module.exports = function(ean, data) {
  var rows =
    data &&
    data.query_result &&
    data.query_result.data &&
    data.query_result.data.rows;
  if (rows) {
    var similarEans = rows.filter(row => row.ean1 == ean).map(row => row.ean2);

    similarEans.map(ean => {
      $.get(`https://storage.googleapis.com/qrq-me-data/core/${ean}.json`).then(
        renderSimilarProduct.bind(null, ean)
      );
    });
  }
};

function renderSimilarProduct(ean, data) {
  data.price =
    data.current_gross_selling_price &&
    String(data.current_gross_selling_price).replace('.', ',');
  data.img = data.image ? 'https://fama-erp.strongops.de/' + data.image : '';
  data.ean = ean;

  var $html = $(productTpl(data)),
    $imgContainer = $html.find('.upsell-product-img-container'),
    $img = $(`<img src="${data.img}" />`);

  $img.on('error', function() {
    $img.attr('src', 'public/images/no-product-image.png');
  });

  $html.on('click', function() {
    window.location.href = `?p=${data.barcode}&_from=${ean}`;
  });

  $imgContainer.html($img);

  $('.similarProducts')
    .append($html)
    .removeClass('hidden');
}
