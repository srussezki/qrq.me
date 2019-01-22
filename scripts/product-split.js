const fs = require('fs');
const request = require('request');

const fileIn = '../src/public/data/products.json';
const dir = '../src/public/data/core/';

const redashUrl =
  'https://redash.paulorosario.com/api/queries/270/results.json?api_key=YMv78bOQ4SL9sUMnWpbttSc39qmklSuak4SBN4MQ';

const MODE = '';

if (MODE === 'file') {
  console.log('reading from FILE');
  fetchFromFile();
} else {
  console.log('reading from URL');
  fetchFromUrl();
}

// 1. fetch from URL
function fetchFromUrl() {
  request(redashUrl, (err, response, body) => {
    var data = JSON.parse(body),
      rows = data.query_result.data.rows;

    fs.writeFile(fileIn, body, 'utf-8');
    processAndSave(rows);

    // data.query_result.data.rows.forEach(saveToFile);
  });
}

// 2. read from file
function fetchFromFile() {
  var data = JSON.parse(fs.readFileSync(fileIn)),
    rows = data.query_result.data.rows;

  processAndSave(rows);
  // rows.forEach(saveToFile);
}

function processAndSave(products) {
  let categories = [],
    main_categories = [];

  // GET CATEGORIES
  products.forEach(product => {
    var main_cat = product.level_0_item_group,
      cat = product.item_group;

    if (main_cat && main_categories.indexOf(main_cat) == -1) {
      main_categories.push(main_cat);
    }
    if (cat && categories.indexOf(cat) == -1) {
      categories.push(cat);
    }
  });

  // GET TOP TEN IN CATEGORY
  categories.forEach(cat => {
    var top10 = products
      .filter(p => p.item_group == cat && p.ORDERS_30D > 0)
      .sort((p1, p2) => p2.ORDERS_30D - p1.ORDERS_30D)
      .slice(0, 10);

    top10.forEach(p => (p.top10 = p.item_group));
  });

  // GET TOP 100 IN MAIN CATEGORY
  main_categories.forEach(main_cat => {
    var top100 = products
      .filter(p => p.level_0_item_group == main_cat && p.ORDERS_30D > 0)
      .sort((p1, p2) => p2.ORDERS_30D - p1.ORDERS_30D)
      .slice(0, 10);

    top100.forEach(p => (p.top100 = p.level_0_item_group));
  });

  // SAVE TO SINGLE FILES
  products.forEach(saveToFile);
}

function saveToFile(product) {
  var ean = product.barcode,
    filename = `${dir}${ean}.json`;

  if (ean && ean.match(/^\d+$/)) {
    fs.writeFile(
      filename,
      JSON.stringify(product, null, '\t'),
      'utf-8',
      err => {
        if (err) throw err;
        // console.log('The file has been saved to ' + filename);
      }
    );
  }
}
