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

const renderFn = require('./app.pug');

const urlParams = new URLSearchParams(window.location.search);
const ean = urlParams.get('e') || urlParams.get('p');

var allData = {
  ean: ean,
  storeId: urlParams.get('s'),
};

if (ean && ean.match(/^\d+$/)) {
  var $productRequest = $.get(
      `https://storage.googleapis.com/qrq-me-data/core/${ean}.json`
    ),
    $externalDataRequest = $.get(
      `https://storage.googleapis.com/qrq-me-data/insights/${ean}.json`
    ),
    $upsellDataRequest = $.get(`./public/data/upsell.json`);

  $productRequest.then($.extend.bind(null, allData)).then(render);

  $externalDataRequest.then($.extend.bind(null, allData)).then(render);

  // rendered asynchronous
  $upsellDataRequest.then(UpsellProducts.bind(null, ean));
}

function render() {
  var data = {};

  data.productData = ProductCard(allData);
  data.youtubeVideo = YoutubeVideosCard(allData.product_external_data);
  data.priceComparison = PriceComparisonCard(allData.product_external_data);
  data.productAtributes = ProductAttributes(allData.product_external_data);
  data.amazonReviews = AmazonReviews(allData.product_external_data);
  data.customCard = CustomCard(allData.custom);

  var html = renderFn(data);
  $('#app').html(html);
}
