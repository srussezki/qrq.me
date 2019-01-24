const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

const bucketName = 'qrq-me-data';

module.exports = {
  download: async function(srcFilename, destFilename) {
    await storage
      .bucket(bucketName)
      .file(srcFilename)
      .download({
        destination: destFilename,
      });
  },
};
