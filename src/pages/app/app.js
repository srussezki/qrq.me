import 'bootstrap';
import '../../scss/index.scss';
import './app.scss';

const ProductCard = require('./../../components/product-card/product-card');
const YoutubeVideosCard = require('./../../components/youtube-video/youtube-video');
const PriceComparisonCard = require('./../../components/price-comparison/price-comparison');

const renderFn = require('./app.pug');

const urlParams = new URLSearchParams(window.location.search);
const ean = urlParams.get('e');
// const storeId = urlParams.get('s');

var appData = {};

if (ean && ean.match(/^\d+$/)) {
  $.get(`./public/data/core/${ean}.json`).then(data => {
    appData.productData = ProductCard(data);
    render();
  });

  $.get(`./public/data/insights/${ean}.json`).then(data => {
    var productData = data && data.product_external_data;
    console.log(productData);
    if (productData['youtube-videos']) {
      appData.youtubeVideo = YoutubeVideosCard(productData['youtube-videos']);
    }
    if (productData['third-party-offers']) {
      appData.priceComparison = PriceComparisonCard(
        productData['third-party-offers']
      );
    }

    render();
  });
}

render();

function render() {
  var html = renderFn(appData);
  $('#app').html(html);
}
