const fs = require('fs');

const fileIn = './products.json';
const dir = '../src/public/data/core/';

var data = JSON.parse(fs.readFileSync(fileIn)),
  rows = data.query_result.data.rows;

rows.forEach(saveToFile);

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
        console.log('The file has been saved to ' + filename);
      }
    );
  }
}
