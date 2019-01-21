import 'bootstrap';
import '../../scss/index.scss';
import './app.scss';

const ProductCard = require('./../../components/product-card/product-card');
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
    console.log(data);
    render();
  });
}

render();

function render() {
  var html = renderFn(appData);
  $('#app').html(html);
}
