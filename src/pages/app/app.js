import 'bootstrap';
import '../../scss/index.scss';
import './app.scss';

const ProductCard = require('./../../components/product-card/product-card');
const YoutubeVideosCard = require('./../../components/youtube-video/youtube-video');
const PriceComparisonCard = require('./../../components/price-comparison/price-comparison');
const ProductAttributes = require('./../../components/attributes-list/attributes-list');
const AmazonReviews = require('./../../components/amazon-reviews/amazon-reviews');
const UpsellProducts = require('./../../components/upsell-products/upsell-products');
const CustomCard = require('./../../components/custom/custom');

const appTpl = require('./app.pug');

const urlParams = new URLSearchParams(window.location.search);
const ean = urlParams.get('e') || urlParams.get('p');
const storeId = urlParams.get('s');

var allData = {
  ean: ean,
  storeId: storeId,
};

if (ean && ean.match(/^\d+$/)) {
  var $productRequest = $.get(
      `https://storage.googleapis.com/qrq-me-data/core/${ean}.json`
    ),
    $externalDataRequest = $.get(
      `https://storage.googleapis.com/qrq-me-data/insights/${ean}.json`
    ),
    $upsellDataRequest = $.get(`./public/data/upsell.json`);

  $productRequest.then(d => $.extend(allData, d)).then(render);

  $externalDataRequest.then(d => $.extend(allData, d)).then(render);

  // asynchronous load/*global ga:true*/ing
  $upsellDataRequest.then(UpsellProducts.bind(null, ean));

  // custom handling for mg showcase
  if (storeId == 'mg') {
    console.log('MG mode');
    setTimeout(() => {
      let url = `https://storage.googleapis.com/qrq-me-data/mg/${ean}.json`;
      $.get(url)
        .then(
          d => $.extend(allData, d),
          err => {
            console.error(`could not load ${url}`, err.statusText);
          }
        )
        .then(render);
    }, 300);
  }
}

function render() {
  var data = {
    storeId: storeId,
  };

  data.productData = ProductCard(allData);
  data.youtubeVideo = YoutubeVideosCard(allData.product_external_data);
  data.priceComparison = PriceComparisonCard(allData.product_external_data);
  data.productAtributes = ProductAttributes(allData.product_external_data);
  data.amazonReviews = AmazonReviews(allData.product_external_data);
  data.customCard = CustomCard(allData.custom);

  var html = appTpl(data);
  $('#app').html(html);
}

$(document).ready(function() {
  /*global ga:true*/
  if (ean) {
    ga('send', 'event', 'product-view', ean, storeId);
  }

  $('body').on('click', '.offer-link', function() {
    ga('send', 'event', 'offer-click-out', ean, $(this).attr('href'));
  });
});
