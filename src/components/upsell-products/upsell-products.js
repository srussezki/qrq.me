require('./upsell-products.scss');
// var tpl = require('./upsell-products.pug');
var productTpl = require('./upsell-product-tpl.pug');

// TODO remove / pass as parameters
const urlParams = new URLSearchParams(window.location.search);
const storeId = urlParams.get('s');

module.exports = function(ean, data) {
  var rows =
    data &&
    data.query_result &&
    data.query_result.data &&
    data.query_result.data.rows;

  if (rows) {
    var similarEans = rows.filter(row => row.ean1 == ean).map(row => row.ean2);

    similarEans.map(ean => {
      let url =
        new URLSearchParams(window.location.search).get('s') == 'mg'
          ? `https://storage.googleapis.com/qrq-me-data/mg/${ean}.json`
          : `https://storage.googleapis.com/qrq-me-data/core/${ean}.json`;

      $.get(url).then(renderSimilarProduct.bind(null, ean));
    });
  }
};

function renderSimilarProduct(ean, data) {
  data.price =
    data.current_gross_selling_price &&
    Number(data.current_gross_selling_price)
      .toFixed(2)
      .replace('.', ',');

  data.img = String(data.image).match(/^http/)
    ? data.image
    : 'https://fama-erp.strongops.de/' + data.image;
  data.ean = ean;

  var $html = $(productTpl(data)),
    $imgContainer = $html.find('.upsell-product-img-container'),
    $img = $(`<img src="${data.img}" />`);

  $img.on('error', function() {
    $img.attr('src', 'public/images/no-product-image.png');
  });

  $html.on('click', function() {
    /*global ga:true*/
    let destinationEan = data.barcode || data.ean;
    ga('send', 'event', 'bought-together-product-click', destinationEan, ean);
    window.location.href = `?s=${storeId}&p=${destinationEan}&_from=${ean}`;
  });

  $imgContainer.html($img);

  // TODO remove timeout
  setTimeout(() => {
    $('.similarProducts')
      .append($html)
      .removeClass('hidden');
  }, 500);
}
