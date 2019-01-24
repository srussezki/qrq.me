const { download } = require('./gsutil.js');

download('/insights/3014230560125.json', '1234.json').then(
  () => {
    console.log(123);
  },
  err => {
    console.log(err);
  }
);
