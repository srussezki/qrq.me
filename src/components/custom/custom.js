require('./custom.scss');
var tpl = require('./custom.pug');

const YoutubeVideosCard = require('./../../components/youtube-video/youtube-video');

module.exports = function(data) {
  if (!data || !Array.isArray(data)) {
    return;
  }

  data = data.map(topic => {
    var images = [];
    if (topic.image) images.push(topic.image);
    if (topic.image1) images.push(topic.image1);
    if (topic.image2) images.push(topic.image2);
    if (topic.image3) images.push(topic.image3);
    if (topic.image4) images.push(topic.image4);

    topic.images = images;

    if (topic.video) {
      topic.youtube = YoutubeVideosCard({
        'youtube-videos': [topic.video],
      });
    }

    return topic;
  });

  return tpl({
    custom: data,
  });
};
