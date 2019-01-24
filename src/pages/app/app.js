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
const storeId = urlParams.get('s');

var appData = {};

if (ean && ean.match(/^\d+$/)) {
  var $productRequest = $.get(
      `https://storage.googleapis.com/qrq-me-data/core/${ean}.json`
    ),
    $externalDataRequest = $.get(
      `https://storage.googleapis.com/qrq-me-data/insights/${ean}.json`
    ),
    $upsellDataRequest = $.get(`./public/data/upsell.json`);

  console.log(storeId);

  $productRequest.then(data => {
    console.log('masterData', data);
    appData.productData = ProductCard(data);

    if (data.custom) {
      appData.customCard = CustomCard(data.custom);
    }

    render();
  });

  $externalDataRequest.then(data => {
    var productData = data && data.product_external_data;
    console.log('insightsData', productData);

    appData.youtubeVideo = YoutubeVideosCard(productData);
    appData.priceComparison = PriceComparisonCard(productData);
    appData.productAtributes = ProductAttributes(productData);
    appData.amazonReviews = AmazonReviews(productData);

    render();
  });

  $.when($productRequest, $externalDataRequest).then((d1, d2) => {
    var productData = d2[0] && d2[0].product_external_data;
    appData.productData = ProductCard(d1[0], productData);
    render();
  });

  $upsellDataRequest.then(UpsellProducts.bind(null, ean));
}

render();
render();

function render() {
  var html = renderFn(appData);
  $('#app').html(html);
}
