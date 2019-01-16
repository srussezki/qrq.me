import $ from 'jquery';


const urlParams = new URLSearchParams(window.location.search);
const storeId = urlParams.get('s');
const ean = urlParams.get('p');

const productDetailsUrl = 'https://script.google.com/macros/s/AKfycbxUFOlWyrTKamEdsntFY5TIm2WblTrKXX0iTyz2e0u_pRmpGsCe/exec?p=' + ean;


if(ean) {
  $.get(productDetailsUrl)
    .then(renderProductDetails)
    .always(() => {hide('.qrq-product-loader')});

} else {
  hide('.error-no-product', false);
}

function renderProductDetails(resp) {
  let data = resp.data && resp.data.length > 0 ? resp.data[0] : {};

  if(data.eanItem) {
    console.log(data);

    $('.qrq-headline').html(data.itemName);
    $('.qrq-ean').html(ean);
    $('.qrq-store').html(storeId);

    if(data.currentGrossSellingPrice) {
        $('.qrq-product-price').html("EUR " + String(data.currentGrossSellingPrice).replace('.', ','));
    }

    $('.qrq-product img').attr('src', 'http://fama-erp.strongops.de/' + data.image);

    show('.qrq-product');
  } else {
    console.error(ean + ' was not found');
  }
}




function hide(selector, hide) {
  if(hide === false) {
    $(selector).removeClass('hidden');
  } else {
    console.log(selector);
    $(selector).addClass('hidden');
  }
}

function show(selector) {
  hide(selector, false);
}



//   let p = {
//   "posId": 16307,
//   "itemName": "Bunte Zuckerstreusel",
//   "posAccountId": 2,
//   "currentGrossSellingPrice": 1.19,
//   "eanItem": "4002809124822",
//   "level1ItemGroup": "Snacks & Getränke",
//   "level2ItemGroup": "Lebensmittel",
//   "image": "/files/4002809124822.jpg",
//   "description": "",
//   "boughtTogether": "",
//   "rating": "",
//   "sellingratio": "",
//   "row_": 426
// }
