require('./attributes-list.scss');
var tpl = require('./attributes-list.pug');

module.exports = function(data) {
  if (data && Array.isArray(data.attributes)) {
    let attributes = data.attributes,
      groups = attributes.reduce((arr, attr) => {
        if (arr.indexOf(attr['attribute-group-name']) == -1) {
          arr.push(attr['attribute-group-name']);
        }
        return arr;
      }, []);

    console.log('groups', groups);
    console.log('attributes', attributes);
    return tpl({
      attributes: attributes,
      groups: groups,
    });
  }
};
