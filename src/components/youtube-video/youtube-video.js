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
    return tpl({
      ids: ids,
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
