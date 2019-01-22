require('./youtube-video.scss');
var tpl = require('./youtube-video.pug');

module.exports = function(data) {
  let videos;

  if (data && data['youtube-videos'] && Array.isArray(data['youtube-videos'])) {
    videos = data['youtube-videos'];
  } else {
    return;
  }

  var ids = videos.map(getId).filter(id => id != undefined);

  if (ids.length > 0) {
    // var randomId = ids[Math.floor(Math.random() * ids.length)];

    return tpl({
      video: 'http://www.youtube.com/embed/' + ids[0],
    });
  }
};

function getId(url) {
  var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  var match = url.match(regExp);

  if (match && match[2].length == 11) {
    return match[2];
  }
}
